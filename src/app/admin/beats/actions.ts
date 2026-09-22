"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { savePublicUpload, savePrivateUpload } from "@/lib/upload";
import { slugify } from "@/lib/slug";

export type BeatFormState = { error?: string };

const LICENSE_SLOTS = 4;

function toCents(value: FormDataEntryValue | null): number {
  const n = parseFloat(String(value ?? "0"));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

async function readLicenseSlots(
  formData: FormData,
  existing?: { id: string; filePath: string }[],
) {
  const licenses = [];
  for (let i = 0; i < LICENSE_SLOTS; i++) {
    const name = String(formData.get(`l${i}_name`) ?? "").trim();
    if (!name) continue;

    const file = formData.get(`l${i}_file`);
    let filePath = existing?.[i]?.filePath ?? "";
    if (file instanceof File && file.size > 0) {
      filePath = await savePrivateUpload(file, "licenses");
    }

    const distributionLimitRaw = String(
      formData.get(`l${i}_distributionLimit`) ?? "",
    ).trim();

    licenses.push({
      name,
      priceCents: toCents(formData.get(`l${i}_price`)),
      fileFormat: String(formData.get(`l${i}_fileFormat`) ?? ""),
      deliverables: String(formData.get(`l${i}_deliverables`) ?? ""),
      usageTerms: String(formData.get(`l${i}_usageTerms`) ?? ""),
      distributionLimit: distributionLimitRaw
        ? parseInt(distributionLimitRaw, 10)
        : null,
      isExclusive: formData.get(`l${i}_exclusive`) === "on",
      sortOrder: i,
      filePath,
    });
  }
  return licenses;
}

export async function createBeatAction(
  _prevState: BeatFormState,
  formData: FormData,
): Promise<BeatFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };

  const coverFile = formData.get("coverArt");
  const previewFile = formData.get("previewAudio");
  if (!(coverFile instanceof File) || coverFile.size === 0) {
    return { error: "Cover art is required" };
  }
  if (!(previewFile instanceof File) || previewFile.size === 0) {
    return { error: "Preview audio is required" };
  }

  const licenses = await readLicenseSlots(formData);
  if (licenses.length === 0) {
    return { error: "At least one license option is required" };
  }

  let slug = slugify(title);
  const slugExists = await prisma.beat.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

  const coverArtUrl = await savePublicUpload(coverFile, "beats");
  const previewAudioUrl = await savePublicUpload(previewFile, "beats");

  await prisma.beat.create({
    data: {
      slug,
      title,
      bpm: parseInt(String(formData.get("bpm") ?? "0"), 10) || 0,
      key: String(formData.get("key") ?? ""),
      genre: String(formData.get("genre") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      coverArtUrl,
      previewAudioUrl,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      licenseOptions: { create: licenses },
    },
  });

  revalidatePath("/admin/beats");
  revalidatePath("/beats");
  redirect("/admin/beats");
}

export async function updateBeatAction(
  beatId: string,
  _prevState: BeatFormState,
  formData: FormData,
): Promise<BeatFormState> {
  await requireAdmin();

  const beat = await prisma.beat.findUnique({
    where: { id: beatId },
    include: { licenseOptions: { orderBy: { sortOrder: "asc" } } },
  });
  if (!beat) return { error: "Beat not found" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };

  const coverFile = formData.get("coverArt");
  const previewFile = formData.get("previewAudio");

  const coverArtUrl =
    coverFile instanceof File && coverFile.size > 0
      ? await savePublicUpload(coverFile, "beats")
      : beat.coverArtUrl;
  const previewAudioUrl =
    previewFile instanceof File && previewFile.size > 0
      ? await savePublicUpload(previewFile, "beats")
      : beat.previewAudioUrl;

  const licenses = await readLicenseSlots(formData, beat.licenseOptions);

  await prisma.$transaction([
    prisma.licenseOption.deleteMany({ where: { beatId } }),
    prisma.beat.update({
      where: { id: beatId },
      data: {
        title,
        bpm: parseInt(String(formData.get("bpm") ?? "0"), 10) || 0,
        key: String(formData.get("key") ?? ""),
        genre: String(formData.get("genre") ?? ""),
        tags: String(formData.get("tags") ?? ""),
        coverArtUrl,
        previewAudioUrl,
        featured: formData.get("featured") === "on",
        published: formData.get("published") === "on",
        licenseOptions: { create: licenses },
      },
    }),
  ]);

  revalidatePath("/admin/beats");
  revalidatePath("/beats");
  revalidatePath(`/beats/${beat.slug}`);
  redirect("/admin/beats");
}

export async function deleteBeatAction(beatId: string) {
  await requireAdmin();
  await prisma.beat.delete({ where: { id: beatId } });
  revalidatePath("/admin/beats");
  revalidatePath("/beats");
}

export async function togglePublishAction(beatId: string, published: boolean) {
  await requireAdmin();
  await prisma.beat.update({ where: { id: beatId }, data: { published } });
  revalidatePath("/admin/beats");
  revalidatePath("/beats");
}
