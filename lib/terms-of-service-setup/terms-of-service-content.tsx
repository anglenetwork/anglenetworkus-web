import { TermsOfServiceSections01To04 } from "./terms-of-service-sections-01-04";
import { TermsOfServiceSections05To08 } from "./terms-of-service-sections-05-08";
import { TermsOfServiceSections09To11 } from "./terms-of-service-sections-09-11";
import { TermsOfServiceSections12To13 } from "./terms-of-service-sections-12-13";

export function TermsOfServiceContent() {
  return (
    <div className="space-y-8">
      <TermsOfServiceSections01To04 />
      <TermsOfServiceSections05To08 />
      <TermsOfServiceSections09To11 />
      <TermsOfServiceSections12To13 />
    </div>
  );
}
