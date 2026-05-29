import type { Metadata } from "next";
import { Suspense } from "react";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import SubscriptionSuccessPageClient from "./subscription-success-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Subscription Confirmed",
    "Your subscription upgrade is being processed.",
    "/myprofile/subscriptions/success",
    { private: true },
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionSuccessPageClient />
    </Suspense>
  );
}
