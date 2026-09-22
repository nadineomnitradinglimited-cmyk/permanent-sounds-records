"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

export type LicenseOptionData = {
  id: string;
  name: string;
  priceCents: number;
  fileFormat: string;
  deliverables: string;
  usageTerms: string;
  isExclusive: boolean;
};

export function LicenseSelector({
  beat,
  licenses,
}: {
  beat: { id: string; slug: string; title: string; coverArtUrl: string };
  licenses: LicenseOptionData[];
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  function handleAdd(license: LicenseOptionData) {
    addItem({
      beatId: beat.id,
      beatSlug: beat.slug,
      beatTitle: beat.title,
      coverArtUrl: beat.coverArtUrl,
      licenseOptionId: license.id,
      licenseName: license.name,
      priceCents: license.priceCents,
    });
    router.push("/cart");
  }

  return (
    <div className="space-y-3">
      {licenses.map((license) => {
        const inCart = items.some((i) => i.licenseOptionId === license.id);
        return (
          <div
            key={license.id}
            className={clsx(
              "rounded-md border p-4",
              license.isExclusive
                ? "border-brand bg-brand/5"
                : "border-border bg-surface",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{license.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {license.deliverables}
                </p>
                <p className="mt-1 text-xs text-muted">{license.usageTerms}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-lg font-semibold">
                  {formatCents(license.priceCents)}
                </p>
                <Button
                  variant={license.isExclusive ? "primary" : "secondary"}
                  className="mt-2"
                  disabled={inCart}
                  onClick={() => handleAdd(license)}
                >
                  {inCart ? "In Cart" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
