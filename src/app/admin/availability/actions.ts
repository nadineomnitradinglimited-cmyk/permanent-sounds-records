"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function setDayAvailabilityAction(
  dayOfWeek: number,
  formData: FormData,
) {
  await requireAdmin();

  const enabled = formData.get("enabled") === "on";
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");

  await prisma.availability.deleteMany({ where: { dayOfWeek } });

  if (enabled && startTime && endTime) {
    await prisma.availability.create({
      data: { dayOfWeek, startTime, endTime },
    });
  }

  revalidatePath("/admin/availability");
  revalidatePath("/booking");
}

export async function addBlackoutDateAction(formData: FormData) {
  await requireAdmin();

  const dateStr = String(formData.get("date") ?? "");
  const reason = String(formData.get("reason") ?? "") || null;
  if (!dateStr) return;

  const date = new Date(`${dateStr}T00:00:00`);
  await prisma.blackoutDate.create({ data: { date, reason } });

  revalidatePath("/admin/availability");
  revalidatePath("/booking");
}

export async function deleteBlackoutDateAction(id: string) {
  await requireAdmin();
  await prisma.blackoutDate.delete({ where: { id } });
  revalidatePath("/admin/availability");
  revalidatePath("/booking");
}
