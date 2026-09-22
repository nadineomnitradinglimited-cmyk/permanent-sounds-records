import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Image
            src="/logo.png"
            alt="Permanent Sounds Records"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className="font-display text-sm font-semibold tracking-wide uppercase">
              Permanent Sounds Records
            </p>
            <p className="mt-1 text-sm text-muted">
              Beats for sale and lease, plus studio sessions.
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/beats" className="hover:text-foreground">
                Browse Beats
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-foreground">
                Book a Session
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/account" className="hover:text-foreground">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted sm:px-6">
        <p>
          © {new Date().getFullYear()} Permanent Sounds Records. All rights
          reserved.
        </p>
        <p className="mt-1">Powered and designed by Nadine Cloud</p>
      </div>
    </footer>
  );
}
