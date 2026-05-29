import { PrivacyPolicySections01To05 } from "./privacy-policy-sections-01-05";
import { PrivacyPolicySections06To10 } from "./privacy-policy-sections-06-10";
import { PrivacyPolicySections11To15 } from "./privacy-policy-sections-11-15";
import { PrivacyPolicySections16To19 } from "./privacy-policy-sections-16-19";

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-8">
      <PrivacyPolicySections01To05 />
      <PrivacyPolicySections06To10 />
      <PrivacyPolicySections11To15 />
      <PrivacyPolicySections16To19 />
    </div>
  );
}
