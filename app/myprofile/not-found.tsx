import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-sans">
            This profile section doesn&apos;t exist.
          </p>
          <Button asChild className="font-sans">
            <Link href="/myprofile/profile-details">Go to Profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

