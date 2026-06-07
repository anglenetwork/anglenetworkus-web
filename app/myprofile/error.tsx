"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  profileCardBody,
  profileCardTitle,
} from "@/app/lib/typography/myprofile-page";

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
    <div className="mx-auto max-w-2xl px-4 py-8 xl:py-12">
      <Card>
        <CardHeader>
          <CardTitle className={profileCardTitle}>
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={profileCardBody}>
            An error happened while loading this profile section. Try again.
          </p>

          <pre className="whitespace-pre-wrap rounded-md border bg-neutral-50 p-3 text-neutral-900 text-xs">
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
