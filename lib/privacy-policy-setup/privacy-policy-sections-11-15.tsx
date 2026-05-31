/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "./privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacyPolicySections11To15() {
  return (
    <>
      {/* Section 11: Data Retention */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          11) Data Retention
        </h2>
        <p className="mb-4">
          We keep Personal Information only as long as reasonably necessary for
          the purposes described, including legal, accounting, and security
          needs.
        </p>
        <p className="mb-4">
          <strong>Typical retention examples (customize):</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Account data</strong>: {config.retention.accountData}
          </li>
          <li>
            <strong>Newsletter subscriptions</strong>:{" "}
            {config.retention.newsletterSubscriptions}
          </li>
          <li>
            <strong>Analytics logs</strong>: {config.retention.analyticsLogs}
          </li>
          <li>
            <strong>Security logs</strong>: {config.retention.securityLogs}
          </li>
          <li>
            <strong>Legal holds</strong>: retained as required by law or ongoing
            disputes
          </li>
        </ul>
      </section>

      {/* Section 12: Security */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          12) Security
        </h2>
        <p className="mb-4">
          We use reasonable administrative, technical, and physical safeguards
          designed to protect Personal Information, such as:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Encryption in transit (HTTPS/TLS)</li>
          <li>Access controls and least-privilege permissions</li>
          <li>Monitoring, rate limiting, and abuse detection</li>
          <li>Vendor risk management where feasible</li>
        </ul>
        <p>
          No system is 100% secure. You are responsible for keeping your
          credentials confidential.
        </p>
      </section>

      {/* Section 13: International Data Transfers */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          13) International Data Transfers
        </h2>
        <p className="mb-4">
          If you access our services from outside{" "}
          <strong>{config.primaryCountry}</strong>, your information may be
          transferred to and processed in other countries.
        </p>
        <p className="mb-4">
          Where required, we use appropriate safeguards such as:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Standard contractual clauses or similar transfer mechanisms</li>
          <li>Contractual and technical protections with vendors</li>
        </ul>
      </section>

      {/* Section 14: Third-Party Links */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          14) Third-Party Links, Embedded Content, and Social Features
        </h2>
        <p className="mb-4">
          Our content may include links or embeds (e.g., videos, social posts).
          These third parties may collect data directly from you and set cookies
          under their own privacy policies. We encourage you to review their
          policies.
        </p>
        {config.features.socialSignIn && (
          <p>
            If we offer social features (sharing buttons, sign-in), the provider
            may receive usage data depending on your settings.
          </p>
        )}
      </section>

      {/* Section 15: User-Generated Content */}
      {config.features.userGeneratedContent && (
        <section>
          <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
            15) User-Generated Content and Public Areas (If Enabled)
          </h2>
          <p className="mb-4">
            If you post comments or other content in public areas, it may be
            visible to others and searchable. Please avoid posting sensitive
            information. We may moderate content according to our Terms.
          </p>
        </section>
      )}
    </>
  );
}
