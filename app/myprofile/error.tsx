"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[/myprofile] error boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-sans">
            An error happened while loading this profile section. Try again.
          </p>

          <pre className="text-xs whitespace-pre-wrap rounded-md border p-3 bg-neutral-50 text-neutral-900">
            {error?.message}
            {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
          </pre>

          <Button onClick={reset} className="font-sans">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

