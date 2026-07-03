import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  profileCardBody,
  profileCardTitle,
} from "@/app/lib/typography/myprofile-page";

export default function NotFound() {
  return (
    <Card>
        <CardHeader>
          <CardTitle className={profileCardTitle}>Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={profileCardBody}>
            This profile section doesn&apos;t exist.
          </p>
          <Button asChild className="font-sans">
            <Link href="/myprofile/profile-details">Go to Profile</Link>
          </Button>
        </CardContent>
      </Card>
  );
}
