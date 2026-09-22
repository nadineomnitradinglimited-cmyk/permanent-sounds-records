import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ClearCart } from "./ClearCart";

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const params = await searchParams;
  const reference =
    typeof params.reference === "string" ? params.reference : undefined;

  const order = reference
    ? await prisma.order.findUnique({ where: { lencoReference: reference } })
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      {order && <ClearCart />}

      {!order ? (
        <>
          <h1 className="font-display text-2xl font-bold uppercase">
            Order Not Found
          </h1>
          <p className="mt-2 text-sm text-muted">
            We couldn&apos;t find that order.
          </p>
        </>
      ) : order.status === "PAID" ? (
        <>
          <h1 className="font-display text-2xl font-bold uppercase text-brand">
            Payment Confirmed
          </h1>
          <p className="mt-2 text-sm text-muted">
            Check {order.email} for your download links, or view them in{" "}
            <Link href="/account" className="underline">
              your account
            </Link>
            .
          </p>
        </>
      ) : order.status === "FAILED" ? (
        <>
          <h1 className="font-display text-2xl font-bold uppercase">
            Payment Failed
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your payment didn&apos;t go through.{" "}
            <Link href="/cart" className="underline">
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
            <a href={`/checkout/success?reference=${reference}`} className="underline">
              Refresh
            </a>{" "}
            to check again.
          </p>
        </>
      )}

      <Link
        href="/beats"
        className="mt-8 inline-block text-sm text-muted underline"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
