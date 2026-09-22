import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { deleteBeatAction, togglePublishAction } from "./actions";

export default async function AdminBeatsPage() {
  const beats = await prisma.beat.findMany({
    include: { licenseOptions: { orderBy: { priceCents: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase">Beats</h1>
        <Link
          href="/admin/beats/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dim"
        >
          Add Beat
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {beats.map((beat) => (
          <div
            key={beat.id}
            className="flex items-center gap-4 rounded-md border border-border bg-surface p-3"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
              <Image
                src={beat.coverArtUrl}
                alt={beat.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{beat.title}</p>
              <p className="text-xs text-muted">
                {beat.genre} · from{" "}
                {formatCents(beat.licenseOptions[0]?.priceCents ?? 0)}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await togglePublishAction(beat.id, !beat.published);
              }}
            >
              <button
                className={
                  beat.published
                    ? "rounded-full bg-brand/10 px-3 py-1 text-xs text-brand"
                    : "rounded-full bg-border px-3 py-1 text-xs text-muted"
                }
              >
                {beat.published ? "Published" : "Unpublished"}
              </button>
            </form>
            <Link
              href={`/admin/beats/${beat.id}/edit`}
              className="text-sm text-muted hover:text-foreground"
            >
              Edit
            </Link>
            <form
              action={async () => {
                "use server";
                await deleteBeatAction(beat.id);
              }}
            >
              <button className="text-sm text-muted hover:text-brand">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
