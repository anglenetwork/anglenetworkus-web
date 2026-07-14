import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/lib/privacy-policy-setup/privacy-policy-content";
import { privacyPolicyConfig } from "@/lib/privacy-policy-setup/privacy-policy-config";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Privacy Policy",
    "How The Angle collects, uses, and protects your personal information.",
    "/company/privacy-policy",
  );
}

export default function PrivacyPolicyPage() {
  return (
    <SitePageWidth className="py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 font-bold font-display text-3xl">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none font-sans text-sm">
          <p className="mb-4 text-news-muted text-sm">
            Last updated: {privacyPolicyConfig.lastUpdated}
          </p>
          <PrivacyPolicyContent />
        </div>
      </div>
    </SitePageWidth>
  );
}
