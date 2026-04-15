"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/studio";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center font-sans">
            Sanity Studio Access
          </h1>
          <p className="text-muted-foreground text-center mb-8 font-sans">
            Please sign in to access the content management system.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => signIn("github", { callbackUrl })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-sans font-medium"
            >
              Login with GitHub
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-sans font-medium"
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
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}

