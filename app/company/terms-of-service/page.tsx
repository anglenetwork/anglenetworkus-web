import { TermsOfServiceContent } from "@/lib/terms-of-service-setup/terms-of-service-content";
import { termsOfServiceConfig } from "@/lib/terms-of-service-setup/terms-of-service-config";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 font-sans">Terms of Service</h1>
      <div className="prose prose-sm max-w-none font-secondary text-sm">
        <p className="mb-4 text-sm text-gray-600">
          Effective Date: {termsOfServiceConfig.effectiveDate}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Last updated: {termsOfServiceConfig.lastUpdated}
        </p>
        <TermsOfServiceContent />
      </div>
    </div>
  );
}
