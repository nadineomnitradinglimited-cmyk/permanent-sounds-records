import { prisma } from "@/lib/prisma";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata = { title: "Book a Session" };

export default async function BookingPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { priceCents: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase">
        Book a Session
      </h1>
      <p className="mt-1 text-sm text-muted">
        Pick a service, choose a time, and pay a deposit to confirm.
      </p>

      {services.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No services are available for booking right now.
        </p>
      ) : (
        <div className="mt-8">
          <BookingFlow services={services} />
        </div>
      )}
    </div>
  );
}
