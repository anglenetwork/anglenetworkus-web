import type { Metadata } from "next";
import { TermsOfServiceContent } from "@/lib/terms-of-service-setup/terms-of-service-content";
import { termsOfServiceConfig } from "@/lib/terms-of-service-setup/terms-of-service-config";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Terms of Service",
    "Terms and conditions for using The Angle website and services.",
    "/company/terms-of-service",
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 font-bold font-display text-3xl">Terms of Service</h1>
      <div className="prose prose-sm max-w-none font-sans text-sm">
        <p className="mb-4 text-gray-600 text-sm">
          Effective Date: {termsOfServiceConfig.effectiveDate}
        </p>
        <p className="mb-4 text-gray-600 text-sm">
          Last updated: {termsOfServiceConfig.lastUpdated}
        </p>
        <TermsOfServiceContent />
      </div>
    </div>
  );
}
