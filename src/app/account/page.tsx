import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session) return null;

  const [orders, bookings] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id, status: "PAID" },
      include: { items: { include: { beat: true, licenseOption: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { service: true },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase">
        My Account
      </h1>
      <p className="mt-1 text-sm text-muted">{session.user.email}</p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold uppercase">
          Purchases
        </h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No purchases yet.{" "}
            <Link href="/beats" className="underline">
              Browse beats
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-md border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{order.createdAt.toLocaleDateString()}</span>
                  <span>{formatCents(order.totalCents)}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {item.beat.title} — {item.licenseOption.name}
                      </span>
                      {item.downloadExpires > new Date() ? (
                        <a
                          href={`/api/downloads/${item.downloadToken}`}
                          className="text-brand underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-muted">Link expired</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold uppercase">
          Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No bookings yet.{" "}
            <Link href="/booking" className="underline">
              Book a session
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{booking.service.name}</p>
                  <p className="text-muted">
                    {booking.date.toLocaleDateString()} · {booking.startTime}
                  </p>
                </div>
                <span
                  className={
                    booking.status === "CONFIRMED"
                      ? "text-green-400"
                      : booking.status === "CANCELLED"
                        ? "text-muted line-through"
                        : "text-brand"
                  }
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
