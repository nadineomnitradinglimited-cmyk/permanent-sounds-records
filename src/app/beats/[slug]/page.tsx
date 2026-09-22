import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AudioPreview } from "@/components/beats/AudioPreview";
import { LicenseSelector } from "@/components/beats/LicenseSelector";

export default async function BeatDetailPage({
  params,
}: PageProps<"/beats/[slug]">) {
  const { slug } = await params;

  const beat = await prisma.beat.findUnique({
    where: { slug },
    include: { licenseOptions: { orderBy: { sortOrder: "asc" } } },
  });

  if (!beat || !beat.published) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image
              src={beat.coverArtUrl}
              alt={beat.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="mt-4">
            <AudioPreview src={beat.previewAudioUrl} />
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold uppercase">
            {beat.title}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {beat.genre} · {beat.bpm} BPM · {beat.key}
          </p>

          <div className="mt-6">
            <LicenseSelector
              beat={{
                id: beat.id,
                slug: beat.slug,
                title: beat.title,
                coverArtUrl: beat.coverArtUrl,
              }}
              licenses={beat.licenseOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
