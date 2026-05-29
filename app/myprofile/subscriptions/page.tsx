import type { Metadata } from "next";
import { Suspense } from "react";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import SubscriptionsPageClient from "./subscriptions-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Subscriptions",
    "Manage your The Angle subscription plan and billing.",
    "/myprofile/subscriptions",
    { private: true },
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionsPageClient />
    </Suspense>
  );
}
