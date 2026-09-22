import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export default async function AdminOverviewPage() {
  const [beatCount, paidOrders, upcomingBookings] = await Promise.all([
    prisma.beat.count({ where: { published: true } }),
    prisma.order.findMany({ where: { status: "PAID" } }),
    prisma.booking.count({
      where: { status: "CONFIRMED", date: { gte: new Date() } },
    }),
  ]);

  const revenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);

  const stats = [
    { label: "Published Beats", value: beatCount },
    { label: "Revenue (Beats)", value: formatCents(revenueCents) },
    { label: "Upcoming Bookings", value: upcomingBookings },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">
        Admin Overview
      </h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-border bg-surface p-4"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="font-display mt-1 text-2xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
