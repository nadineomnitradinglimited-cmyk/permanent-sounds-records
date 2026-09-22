import crypto from "crypto";

/**
 * LencoPay (Collections) integration.
 *
 * CONFIRMED against Lenco's public docs: webhook signature verification
 * (X-Lenco-Signature = HMAC-SHA512 of the payload, keyed with SHA256(secretKey)).
 *
 * NOT YET CONFIRMED: the exact request/response shape for initiating a
 * checkout (LencoPay's public-key widget isn't in Lenco's public API
 * reference). `initiateLencoCheckout` below is written against the common
 * shape used by this class of African payment gateway (Paystack-like) —
 * verify it against the snippet in your Lenco dashboard (LencoPay /
 * Collections -> API keys -> integration guide) before going live, and
 * adjust the request body / response fields here if they differ.
 */

const LENCO_API_BASE = "https://api.lenco.co/access/v2";

export type InitiateCheckoutInput = {
  reference: string;
  amountCents: number;
  email: string;
  currency?: string;
  redirectUrl: string;
  metadata?: Record<string, unknown>;
};

export type InitiateCheckoutResult = {
  checkoutUrl: string;
  reference: string;
};

export async function initiateLencoCheckout(
  input: InitiateCheckoutInput,
): Promise<InitiateCheckoutResult> {
  const secretKey = process.env.LENCO_SECRET_KEY;
  if (!secretKey) {
    throw new Error("LENCO_SECRET_KEY is not configured");
  }

  const response = await fetch(`${LENCO_API_BASE}/collections/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference: input.reference,
      amount: input.amountCents / 100,
      email: input.email,
      currency: input.currency ?? process.env.NEXT_PUBLIC_CURRENCY ?? "NGN",
      redirectUrl: input.redirectUrl,
      meta: input.metadata,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Lenco checkout initiation failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  return {
    checkoutUrl: data.data?.checkoutUrl ?? data.checkoutUrl,
    reference: input.reference,
  };
}

export async function verifyLencoTransaction(reference: string) {
  const secretKey = process.env.LENCO_SECRET_KEY;
  if (!secretKey) {
    throw new Error("LENCO_SECRET_KEY is not configured");
  }

  const response = await fetch(
    `${LENCO_API_BASE}/transaction-by-reference/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    },
  );

  if (!response.ok) {
    throw new Error(`Lenco verification failed: ${response.status}`);
  }

  return response.json();
}

export function verifyLencoWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secretKey = process.env.LENCO_SECRET_KEY;
  if (!secretKey || !signatureHeader) return false;

  const webhookHashKey = crypto
    .createHash("sha256")
    .update(secretKey)
    .digest("hex");

  const expected = crypto
    .createHmac("sha512", webhookHashKey)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signatureHeader, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
