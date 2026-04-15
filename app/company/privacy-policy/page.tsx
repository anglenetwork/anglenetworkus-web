import { PrivacyPolicyContent } from "@/lib/privacy-policy-setup/privacy-policy-content";
import { privacyPolicyConfig } from "@/lib/privacy-policy-setup/privacy-policy-config";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 font-sans">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none font-sans text-sm">
        <p className="mb-4 text-sm text-gray-600">
          Last updated: {privacyPolicyConfig.lastUpdated}
        </p>
        <PrivacyPolicyContent />
      </div>
    </div>
  );
}
