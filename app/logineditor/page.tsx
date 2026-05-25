"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/studio";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          <h1 className="mb-6 text-center font-bold font-sans text-2xl">
            Sanity Studio Access
          </h1>
          <p className="mb-8 text-center font-sans text-muted-foreground">
            Please sign in to access the content management system.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => signIn("github", { callbackUrl })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 font-medium font-sans transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Login with GitHub
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 font-medium font-sans transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
