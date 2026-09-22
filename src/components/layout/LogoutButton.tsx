"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      Log Out
    </button>
  );
}
