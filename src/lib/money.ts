export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "NGN";

export function formatCents(cents: number, currency = CURRENCY) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
