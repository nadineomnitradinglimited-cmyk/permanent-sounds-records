import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BeatCard } from "@/components/beats/BeatCard";
import { clsx } from "@/lib/clsx";

export const metadata = { title: "Beats" };

export default async function BeatsPage({
  searchParams,
}: PageProps<"/beats">) {
  const params = await searchParams;
  const genre = typeof params.genre === "string" ? params.genre : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;

  const beats = await prisma.beat.findMany({
    where: {
      published: true,
      ...(genre ? { genre } : {}),
      ...(q
        ? { title: { contains: q } }
        : {}),
    },
    include: {
      licenseOptions: { orderBy: { priceCents: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const genres = await prisma.beat.findMany({
    where: { published: true },
    select: { genre: true },
    distinct: ["genre"],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase">Beats</h1>
      <p className="mt-1 text-sm text-muted">
        Preview, buy, or lease a beat for your next project.
      </p>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/beats">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search beats…"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <Link
          href="/beats"
          className={clsx(
            "rounded-full border border-border px-3 py-1 text-xs",
            !genre && "border-brand text-brand",
          )}
        >
          All
        </Link>
        {genres.map((g) => (
          <Link
            key={g.genre}
            href={`/beats?genre=${encodeURIComponent(g.genre)}`}
            className={clsx(
              "rounded-full border border-border px-3 py-1 text-xs",
              genre === g.genre && "border-brand text-brand",
            )}
          >
            {g.genre}
          </Link>
        ))}
      </form>

      {beats.length === 0 ? (
        <p className="mt-12 text-sm text-muted">No beats match your search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {beats.map((beat) => (
            <BeatCard
              key={beat.id}
              beat={{
                slug: beat.slug,
                title: beat.title,
                bpm: beat.bpm,
                genre: beat.genre,
                coverArtUrl: beat.coverArtUrl,
                previewAudioUrl: beat.previewAudioUrl,
                fromPriceCents: beat.licenseOptions[0]?.priceCents ?? 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
