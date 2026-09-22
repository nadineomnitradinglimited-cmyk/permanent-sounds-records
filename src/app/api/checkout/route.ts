import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations/checkout";
import { initiateLencoCheckout } from "@/lib/payments/lenco";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { email, licenseOptionIds } = parsed.data;

  const licenseOptions = await prisma.licenseOption.findMany({
    where: { id: { in: licenseOptionIds } },
    include: { beat: true },
  });

  if (licenseOptions.length !== licenseOptionIds.length) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available." },
      { status: 400 },
    );
  }

  const unavailable = licenseOptions.find((lo) => !lo.beat.published);
  if (unavailable) {
    return NextResponse.json(
      { error: `${unavailable.beat.title} is no longer available.` },
      { status: 400 },
    );
  }

  const totalCents = licenseOptions.reduce((sum, lo) => sum + lo.priceCents, 0);
  const session = await auth();
  const reference = `order_${crypto.randomUUID()}`;
  const downloadExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const order = await prisma.order.create({
    data: {
      email,
      userId: session?.user.id,
      status: "PENDING",
      totalCents,
      lencoReference: reference,
      items: {
        create: licenseOptions.map((lo) => ({
          beatId: lo.beatId,
          licenseOptionId: lo.id,
          priceCents: lo.priceCents,
          downloadExpires,
        })),
      },
    },
  });

  try {
    const { checkoutUrl } = await initiateLencoCheckout({
      reference,
      amountCents: totalCents,
      email,
      redirectUrl: `${req.nextUrl.origin}/checkout/success?reference=${reference}`,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    console.error("Lenco checkout initiation failed", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
