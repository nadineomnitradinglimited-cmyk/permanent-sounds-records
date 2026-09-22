import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold uppercase">Log In</h1>
      <p className="mt-2 text-sm text-muted">
        Welcome back to Permanent Sounds Records.
      </p>

      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-foreground underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
