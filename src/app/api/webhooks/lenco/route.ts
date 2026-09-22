import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyLencoWebhookSignature } from "@/lib/payments/lenco";
import {
  sendOrderConfirmationEmail,
  sendBookingConfirmationEmail,
} from "@/lib/email";

// Field names below (event.event / event.data.reference) follow Lenco's
// documented webhook event names (transaction.successful /
// transaction.failed) but haven't been confirmed against a live payload —
// double check against real webhook logs once LENCO_SECRET_KEY is live.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-lenco-signature");

  if (!verifyLencoWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event;
  const reference: string | undefined = event.data?.reference;

  if (!reference) {
    return NextResponse.json({ received: true });
  }

  if (reference.startsWith("booking_")) {
    await handleBookingEvent(req, eventType, reference);
  } else {
    await handleOrderEvent(req, eventType, reference);
  }

  return NextResponse.json({ received: true });
}

async function handleOrderEvent(
  req: NextRequest,
  eventType: string,
  reference: string,
) {
  const order = await prisma.order.findUnique({
    where: { lencoReference: reference },
    include: { items: { include: { beat: true, licenseOption: true } } },
  });
  if (!order) return;

  if (eventType === "transaction.successful") {
    if (order.status !== "PAID") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        });

        const exclusiveBeatIds = order.items
          .filter((item) => item.licenseOption.isExclusive)
          .map((item) => item.beatId);

        if (exclusiveBeatIds.length > 0) {
          await tx.beat.updateMany({
            where: { id: { in: exclusiveBeatIds } },
            data: { published: false },
          });
        }
      });

      await sendOrderConfirmationEmail({
        to: order.email,
        orderId: order.id,
        items: order.items.map((item) => ({
          beatTitle: item.beat.title,
          licenseName: item.licenseOption.name,
          downloadUrl: `${req.nextUrl.origin}/api/downloads/${item.downloadToken}`,
        })),
      });
    }
  } else if (eventType === "transaction.failed") {
    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
    }
  }
}

async function handleBookingEvent(
  _req: NextRequest,
  eventType: string,
  reference: string,
) {
  const booking = await prisma.booking.findUnique({
    where: { lencoReference: reference },
    include: { service: true },
  });
  if (!booking) return;

  if (eventType === "transaction.successful") {
    if (booking.status !== "CONFIRMED") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CONFIRMED",
          amountPaidCents: booking.service.depositCents,
        },
      });

      await sendBookingConfirmationEmail({
        to: booking.email,
        serviceName: booking.service.name,
        date: booking.date.toLocaleDateString(),
        startTime: booking.startTime,
      });
    }
  } else if (eventType === "transaction.failed") {
    if (booking.status === "PENDING") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });
    }
  }
}
