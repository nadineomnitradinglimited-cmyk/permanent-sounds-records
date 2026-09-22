"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = items.reduce((sum, item) => sum + item.priceCents, 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name"),
        licenseOptionIds: items.map((i) => i.licenseOptionId),
      }),
    });

    const data = await res.json();
    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted">
        Your cart is empty.{" "}
        <button onClick={() => router.push("/beats")} className="underline">
          Browse beats
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.licenseOptionId}
            className="flex items-center justify-between text-sm"
          >
            <span>
              {item.beatTitle} — {item.licenseName}
            </span>
            <span>{formatCents(item.priceCents)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </div>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
        <p className="mt-1 text-xs text-muted">
          Your download links will be sent here.
        </p>
      </div>

      {error && <p className="text-sm text-brand">{error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Redirecting to payment…" : "Pay Now"}
      </Button>
    </form>
  );
}
