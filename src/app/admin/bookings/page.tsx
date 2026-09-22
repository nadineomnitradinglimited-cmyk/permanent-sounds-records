import { prisma } from "@/lib/prisma";
import { clsx } from "@/lib/clsx";
import { setBookingStatusAction } from "./actions";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">Bookings</h1>

      <div className="mt-6 space-y-2">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center gap-4 rounded-md border border-border bg-surface p-3 text-sm"
          >
            <div className="flex-1">
              <p className="font-medium">
                {booking.service.name} — {booking.name}
              </p>
              <p className="text-xs text-muted">
                {booking.date.toLocaleDateString()} · {booking.startTime}–
                {booking.endTime} · {booking.email} · {booking.phone}
              </p>
            </div>
            <span
              className={clsx(
                "rounded-full px-2 py-1 text-xs",
                booking.status === "CONFIRMED" && "bg-brand/10 text-brand",
                booking.status === "PENDING" && "bg-border text-muted",
                booking.status === "CANCELLED" && "bg-border text-muted line-through",
              )}
            >
              {booking.status}
            </span>
            {booking.status !== "CANCELLED" && (
              <form
                action={async () => {
                  "use server";
                  await setBookingStatusAction(booking.id, "CANCELLED");
                }}
              >
                <button className="text-muted hover:text-brand">Cancel</button>
              </form>
            )}
            {booking.status === "PENDING" && (
              <form
                action={async () => {
                  "use server";
                  await setBookingStatusAction(booking.id, "CONFIRMED");
                }}
              >
                <button className="text-muted hover:text-foreground">
                  Confirm
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
