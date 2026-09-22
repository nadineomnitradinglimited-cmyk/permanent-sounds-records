import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { clsx } from "@/lib/clsx";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { beat: true, licenseOption: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">Orders</h1>

      <div className="mt-6 space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-md border border-border bg-surface p-3 text-sm"
          >
            <div className="flex items-center justify-between">
              <span>
                {order.email} · {order.createdAt.toLocaleDateString()}
              </span>
              <div className="flex items-center gap-3">
                <span>{formatCents(order.totalCents)}</span>
                <span
                  className={clsx(
                    "rounded-full px-2 py-1 text-xs",
                    order.status === "PAID" && "bg-brand/10 text-brand",
                    order.status === "PENDING" && "bg-border text-muted",
                    order.status === "FAILED" && "bg-border text-muted line-through",
                  )}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <ul className="mt-2 text-xs text-muted">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.beat.title} — {item.licenseOption.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
