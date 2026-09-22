export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase">
        Permanent Sounds Records
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Original beats for sale and lease, and a studio for recording,
        mixing, and mastering. Browse the catalog, grab a license, or book a
        session — everything runs through this site.
      </p>

      <div className="mt-8 rounded-md border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold uppercase">
          Contact
        </h2>
        <p className="mt-2 text-sm text-muted">
          Reach out for custom production, bulk licensing, or studio
          availability.
        </p>
      </div>
    </div>
  );
}
