import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations/booking";
import { getAvailableSlots, isPastDate } from "@/lib/booking";
import { initiateLencoCheckout } from "@/lib/payments/lenco";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { serviceId, date, startTime, endTime, name, email, phone, notes } =
    parsed.data;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return NextResponse.json({ error: "Service not available" }, { status: 400 });
  }

  const bookingDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(bookingDate.getTime()) || isPastDate(bookingDate)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const openSlots = await getAvailableSlots(serviceId, bookingDate);
  const slotStillOpen = openSlots.some(
    (s) => s.start === startTime && s.end === endTime,
  );
  if (!slotStillOpen) {
    return NextResponse.json(
      { error: "That time slot is no longer available." },
      { status: 409 },
    );
  }

  const session = await auth();
  const reference = `booking_${crypto.randomUUID()}`;

  const booking = await prisma.booking.create({
    data: {
      userId: session?.user.id,
      name,
      email,
      phone,
      notes,
      serviceId,
      date: bookingDate,
      startTime,
      endTime,
      status: "PENDING",
      lencoReference: reference,
    },
  });

  try {
    const { checkoutUrl } = await initiateLencoCheckout({
      reference,
      amountCents: service.depositCents,
      email,
      redirectUrl: `${req.nextUrl.origin}/booking/success?reference=${reference}`,
      metadata: { bookingId: booking.id },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });
    console.error("Lenco booking deposit initiation failed", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
