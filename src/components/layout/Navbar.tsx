import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

const links = [
  { href: "/beats", label: "Beats" },
  { href: "/booking", label: "Book a Session" },
  { href: "/about", label: "About" },
];

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Permanent Sounds Records"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-wide uppercase">
            Permanent Sounds
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Cart
          </Link>
          {session ? (
            <>
              <Link
                href="/account"
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {session.user.name || "Account"}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dim"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
