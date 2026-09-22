"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatCents } from "@/lib/money";
import { LinkButton } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = items.reduce((sum, item) => sum + item.priceCents, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase">Cart</h1>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Your cart is empty.{" "}
          <Link href="/beats" className="underline">
            Browse beats
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.licenseOptionId}
                className="flex items-center gap-4 rounded-md border border-border bg-surface p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                  <Image
                    src={item.coverArtUrl}
                    alt={item.beatTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.beatTitle}</p>
                  <p className="text-xs text-muted">{item.licenseName}</p>
                </div>
                <p className="font-medium">{formatCents(item.priceCents)}</p>
                <button
                  onClick={() => removeItem(item.licenseOptionId)}
                  className="text-xs text-muted hover:text-brand"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <span className="font-display text-lg font-semibold uppercase">
              Total
            </span>
            <span className="font-display text-lg font-semibold">
              {formatCents(total)}
            </span>
          </div>

          <LinkButton href="/checkout" className="mt-6 w-full">
            Checkout
          </LinkButton>
        </>
      )}
    </div>
  );
}
