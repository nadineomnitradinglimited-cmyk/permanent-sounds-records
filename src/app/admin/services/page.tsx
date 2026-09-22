import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createServiceAction, deleteServiceAction } from "./actions";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">Services</h1>

      <div className="mt-6 space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-4 rounded-md border border-border bg-surface p-3"
          >
            <div className="flex-1">
              <p className="font-medium">{service.name}</p>
              <p className="text-xs text-muted">
                {service.durationMinutes} min · {formatCents(service.priceCents)}{" "}
                · {formatCents(service.depositCents)} deposit
              </p>
            </div>
            <span
              className={
                service.active ? "text-xs text-brand" : "text-xs text-muted"
              }
            >
              {service.active ? "Active" : "Inactive"}
            </span>
            <Link
              href={`/admin/services/${service.id}/edit`}
              className="text-sm text-muted hover:text-foreground"
            >
              Edit
            </Link>
            <form
              action={async () => {
                "use server";
                await deleteServiceAction(service.id);
              }}
            >
              <button className="text-sm text-muted hover:text-brand">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="font-display text-lg font-semibold uppercase">
          Add Service
        </h2>
        <div className="mt-4">
          <ServiceForm action={createServiceAction} />
        </div>
      </div>
    </div>
  );
}
