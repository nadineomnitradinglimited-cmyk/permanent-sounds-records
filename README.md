# Permanent Sounds Records

Beat store (buy/lease), studio session booking, and an admin dashboard, built with Next.js 16, Prisma/SQLite, Auth.js, and Lenco for payments.

## Getting started

```bash
npm install
cp .env.example .env   # fill in real values before going live
npx prisma migrate dev
npm run db:seed        # creates an admin user + sample beats/services
npm run dev
```

Open http://localhost:3000. The seed script prints an admin login (email is `ADMIN_EMAIL` from `.env`, password `changeme123` — change it after first login).

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/app/admin` — protected admin dashboard (beats, services, availability, bookings, orders)
- `src/lib` — Prisma client, auth config, payments, email, validation
- `src/store/cart-store.ts` — client-side cart (Zustand, persisted to localStorage)
- `prisma/schema.prisma` — data model; `prisma/seed.ts` — demo data
- `public/uploads` — publicly-servable beat cover art & previews (admin uploads)
- `private-uploads` — gated license deliverables, only ever served through `/api/downloads/[token]` after a paid order

## Payments (Lenco)

`src/lib/payments/lenco.ts` wraps checkout initiation, transaction verification, and webhook signature checking.

**Before going live**, confirm the checkout-initiation request/response shape against the integration snippet in your Lenco dashboard (LencoPay / Collections → API keys) — that specific endpoint wasn't in Lenco's public API reference at the time this was built, so it's implemented against the common shape for this class of gateway and needs a final check. The webhook signature verification (`X-Lenco-Signature`, HMAC-SHA512) **is** confirmed against Lenco's docs.

Set `LENCO_PUBLIC_KEY`, `LENCO_SECRET_KEY`, and `LENCO_WEBHOOK_SECRET` in `.env`, and point Lenco's webhook at `/api/webhooks/lenco`.

## Email

Order and booking confirmations send through SMTP (`src/lib/email.ts`, via Nodemailer). Without `SMTP_HOST` set, emails are skipped with a console warning instead of failing — fine for local dev, but required before launch.

## Database

SQLite for local dev (`prisma/dev.db`, gitignored) — zero setup. Prisma ORM v7 uses a driver-adapter model (`prisma.config.ts` + `@prisma/adapter-better-sqlite3`), not the older `datasource url` pattern. For production, switch `prisma/schema.prisma`'s datasource provider to `postgresql`, swap the adapter in `src/lib/prisma.ts` (e.g. `@prisma/adapter-pg` with a hosted Postgres like Neon or Supabase), and re-run migrations.

## Branding

Colors and fonts live in `src/app/globals.css` (Tailwind v4 `@theme` tokens — no `tailwind.config.js`). Brand red is `#e31e24`, matched to the logo.
