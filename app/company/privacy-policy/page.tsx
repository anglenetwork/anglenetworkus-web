import { PrivacyPolicyContent } from "@/lib/privacy-policy-setup/privacy-policy-content";
import { privacyPolicyConfig } from "@/lib/privacy-policy-setup/privacy-policy-config";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 font-bold font-sans text-3xl">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none font-sans text-sm">
        <p className="mb-4 text-gray-600 text-sm">
          Last updated: {privacyPolicyConfig.lastUpdated}
        </p>
        <PrivacyPolicyContent />
      </div>
    </div>
  );
}
