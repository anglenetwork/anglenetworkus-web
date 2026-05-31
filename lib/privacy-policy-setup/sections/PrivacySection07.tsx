/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "../privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacySection07() {
  return (
    <>
      {/* Section 7: When We Share Information */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          7) When We Share Information
        </h2>
        <p className="mb-4">We may share Personal Information with:</p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) Service Providers (Processors)
        </h3>
        <p className="mb-4">Vendors who help us run the site, such as:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Hosting and infrastructure</li>
          <li>Analytics and performance monitoring</li>
          <li>Newsletter/email delivery</li>
          <li>Customer support tools</li>
          <li>Security and fraud prevention</li>
          {(config.features.subscriptions || config.features.donations) && (
            <li>Payment processing (if applicable)</li>
          )}
        </ul>
        <p className="mb-4">
          They are permitted to use Personal Information{" "}
          <strong>only to provide services to us</strong> (subject to
          contracts).
        </p>

        {config.features.targetedAdvertising && (
          <>
            <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
              B) Advertising and Measurement Partners (If Enabled)
            </h3>
            <p className="mb-4">
              We may share identifiers and event data (cookie IDs, device IDs,
              IP, page views, ad interactions) to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Deliver ads</li>
              <li>Measure ad performance</li>
              <li>Manage frequency</li>
              <li>
                Support targeted advertising (depending on your choices and
                location)
              </li>
            </ul>
          </>
        )}

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          {config.features.targetedAdvertising ? "C" : "B"}) Affiliates
        </h3>
        <p className="mb-4">
          If we operate as part of a corporate group, we may share data with
          affiliates for internal administration, security, and service
          delivery.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          {config.features.targetedAdvertising ? "D" : "C"}) Legal, Safety, and
          Business Transfers
        </h3>
        <p className="mb-4">We may share information:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>To comply with law, court order, or legal process</li>
          <li>
            To protect rights, safety, and integrity of our users and services
          </li>
          <li>
            In connection with a merger, acquisition, financing, or sale of
            assets (with appropriate protections)
          </li>
        </ul>
      </section>
    </>
  );
}
