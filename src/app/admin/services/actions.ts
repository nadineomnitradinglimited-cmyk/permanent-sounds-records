"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export type ServiceFormState = { error?: string };

function toCents(value: FormDataEntryValue | null): number {
  const n = parseFloat(String(value ?? "0"));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function readServiceFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    durationMinutes:
      parseInt(String(formData.get("durationMinutes") ?? "0"), 10) || 0,
    priceCents: toCents(formData.get("price")),
    depositCents: toCents(formData.get("deposit")),
    active: formData.get("active") === "on",
  };
}

export async function createServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();
  const data = readServiceFields(formData);
  if (!data.name) return { error: "Name is required" };

  await prisma.service.create({ data });
  revalidatePath("/admin/services");
  revalidatePath("/booking");
  redirect("/admin/services");
}

export async function updateServiceAction(
  serviceId: string,
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();
  const data = readServiceFields(formData);
  if (!data.name) return { error: "Name is required" };

  await prisma.service.update({ where: { id: serviceId }, data });
  revalidatePath("/admin/services");
  revalidatePath("/booking");
  redirect("/admin/services");
}

export async function deleteServiceAction(serviceId: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: serviceId } });
  revalidatePath("/admin/services");
  revalidatePath("/booking");
}
