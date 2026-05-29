import type { Metadata } from "next";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import PricingPageClient from "./pricing-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
  "Pricing",
  "Compare The Angle subscription plans and choose the tier that fits you.",
  "/pricing",
);
}

export default function PricingPage() {
  return <PricingPageClient />;
}
