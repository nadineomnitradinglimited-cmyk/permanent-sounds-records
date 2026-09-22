import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/beats", label: "Beats" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminSidebar() {
  return (
    <nav className="w-48 shrink-0 space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
