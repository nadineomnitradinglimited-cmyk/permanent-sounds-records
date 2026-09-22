"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { BookingStatus } from "@/generated/prisma/client";

export async function setBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
) {
  await requireAdmin();
  await prisma.booking.update({ where: { id: bookingId }, data: { status } });
  revalidatePath("/admin/bookings");
}
