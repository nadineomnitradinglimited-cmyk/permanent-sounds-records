import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden sm:min-h-[80vh]">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-6xl">
              Beats. Leases. <span className="text-brand">Studio Time.</span>
            </h1>
            <p className="mt-6 max-w-md text-balance text-muted sm:text-lg">
              Buy or lease original beats, or book a session at Permanent
              Sounds Records — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/beats"
                className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dim"
              >
                Browse Beats
              </Link>
              <Link
                href="/booking"
                className="rounded-md border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div>
            <h2 className="font-display text-xl font-semibold uppercase">
              Lease or Buy
            </h2>
            <p className="mt-2 text-sm text-muted">
              MP3, WAV, trackout, and exclusive rights — pick the license
              that fits your project.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold uppercase">
              Book the Studio
            </h2>
            <p className="mt-2 text-sm text-muted">
              Real-time availability for recording, mixing, and mastering
              sessions.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold uppercase">
              Instant Delivery
            </h2>
            <p className="mt-2 text-sm text-muted">
              Pay securely with Lenco and get your files or booking
              confirmation right away.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
