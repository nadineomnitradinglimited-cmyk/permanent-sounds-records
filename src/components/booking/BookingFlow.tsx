"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./Calendar";
import { formatCents } from "@/lib/money";
import { clsx } from "@/lib/clsx";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";

type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  depositCents: number;
};

type Slot = { start: string; end: string };

export function BookingFlow({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = services.find((s) => s.id === serviceId);

  async function fetchSlots(svcId: string, d: Date) {
    setLoadingSlots(true);
    const dateStr = format(d, "yyyy-MM-dd");
    const res = await fetch(
      `/api/bookings/availability?serviceId=${svcId}&date=${dateStr}`,
    );
    const data = await res.json();
    setSlots(data.slots ?? []);
    setLoadingSlots(false);
  }

  function selectService(id: string) {
    setServiceId(id);
    setSlot(null);
    setSlots([]);
    if (date) fetchSlots(id, date);
  }

  function selectDate(d: Date) {
    setDate(d);
    setSlot(null);
    setSlots([]);
    if (serviceId) fetchSlots(serviceId, d);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !slot) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        date: format(date, "yyyy-MM-dd"),
        startTime: slot.start,
        endTime: slot.end,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        notes: formData.get("notes") || undefined,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-semibold">1. Choose a service</p>
          <div className="space-y-2">
            {services.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => selectService(s.id)}
                className={clsx(
                  "w-full rounded-md border p-3 text-left text-sm transition-colors",
                  serviceId === s.id
                    ? "border-brand bg-brand/5"
                    : "border-border bg-surface hover:border-foreground/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{s.name}</span>
                  <span>{formatCents(s.priceCents)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {s.durationMinutes} min · {formatCents(s.depositCents)} deposit
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">2. Pick a date</p>
          <Calendar selected={date} onSelect={selectDate} />
        </div>

        {date && (
          <div>
            <p className="mb-2 text-sm font-semibold">3. Pick a time</p>
            {loadingSlots ? (
              <p className="text-sm text-muted">Loading availability…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted">
                No open slots on {format(date, "MMM d")}.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s.start}
                    onClick={() => setSlot(s)}
                    className={clsx(
                      "rounded-md border px-3 py-1.5 text-sm",
                      slot?.start === s.start
                        ? "border-brand bg-brand text-white"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    {s.start}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">4. Your details</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>

          {error && <p className="text-sm text-brand">{error}</p>}

          <Button
            type="submit"
            disabled={!date || !slot || submitting}
            className="w-full"
          >
            {submitting
              ? "Redirecting to payment…"
              : service
                ? `Pay ${formatCents(service.depositCents)} deposit`
                : "Select a service"}
          </Button>
        </form>
      </div>
    </div>
  );
}
