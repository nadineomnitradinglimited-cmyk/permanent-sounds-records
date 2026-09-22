import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BookingSuccessPage({
  searchParams,
}: PageProps<"/booking/success">) {
  const params = await searchParams;
  const reference =
    typeof params.reference === "string" ? params.reference : undefined;

  const booking = reference
    ? await prisma.booking.findUnique({
        where: { lencoReference: reference },
        include: { service: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      {!booking ? (
        <>
          <h1 className="font-display text-2xl font-bold uppercase">
            Booking Not Found
          </h1>
          <p className="mt-2 text-sm text-muted">
            We couldn&apos;t find that booking.
          </p>
        </>
      ) : booking.status === "CONFIRMED" ? (
        <>
          <h1 className="font-display text-2xl font-bold uppercase text-brand">
            Booking Confirmed
          </h1>
          <p className="mt-2 text-sm text-muted">
            {booking.service.name} on {booking.date.toLocaleDateString()} at{" "}
            {booking.startTime}. A confirmation was sent to {booking.email}.
          </p>
        </>
      ) : booking.status === "CANCELLED" ? (
        <>
          <h1 className="font-display text-2xl font-bold uppercase">
            Payment Failed
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your deposit didn&apos;t go through.{" "}
            <Link href="/booking" className="underline">
              Try again
            </Link>
            .
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold uppercase">
            Processing Payment…
          </h1>
          <p className="mt-2 text-sm text-muted">
            This can take a few seconds.{" "}
            <a
              href={`/booking/success?reference=${reference}`}
              className="underline"
            >
              Refresh
            </a>{" "}
            to check again.
          </p>
        </>
      )}

      <Link
        href="/"
        className="mt-8 inline-block text-sm text-muted underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
