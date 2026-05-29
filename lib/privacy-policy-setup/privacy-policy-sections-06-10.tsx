/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "./privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacyPolicySections06To10() {
  return (
    <>
      {/* Section 6: Cookies */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          6) Cookies, Pixels, SDKs, and Similar Technologies
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) What We Use
        </h3>
        <p className="mb-4">We may use:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Cookies</strong> (first-party and third-party)
          </li>
          <li>
            <strong>Pixels / tags / beacons</strong>
          </li>
          <li>
            <strong>Local storage</strong>
          </li>
          <li>
            <strong>SDKs</strong> (primarily for app experiences, if applicable)
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          B) Categories of Cookies/Trackers
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Strictly Necessary</strong>: login, security, load
            balancing, consent tools
          </li>
          <li>
            <strong>Functional</strong>: remember settings and preferences
          </li>
          <li>
            <strong>Analytics</strong>: audience measurement, performance,
            debugging
          </li>
          {config.features.targetedAdvertising && (
            <li>
              <strong>Advertising</strong>: deliver and measure ads; limit
              frequency; support targeted advertising (if permitted)
            </li>
          )}
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          C) Your Controls
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Use our <strong>Cookie Preferences / Consent Tool</strong>:{" "}
            <Link
              href={config.links.cookiePreferences}
              className="text-blue-600 hover:underline"
            >
              {config.links.cookiePreferences}
            </Link>
          </li>
          <li>Adjust browser controls (block/delete cookies)</li>
          <li>Use device-level ad controls (mobile)</li>
          <li>
            Opt out of targeted advertising (see "Your Rights and Choices")
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          D) Global Privacy Control (GPC)
        </h3>
        <p className="mb-4">
          Where required or recognized, we treat{" "}
          <strong>Global Privacy Control</strong> signals as a request to opt
          out of certain tracking/"sale"/"sharing" for targeted advertising.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          E) Industry Privacy Signals (Optional, if you implement it)
        </h3>
        <p className="mb-4">
          If we support industry standards (e.g., IAB privacy strings), we may
          transmit your preferences to participating advertising partners to
          help enforce your choices across the ad ecosystem.
        </p>
      </section>

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

      {/* Section 8: Sale/Sharing */}
      {config.features.targetedAdvertising && (
        <section>
          <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
            8) "Sale" / "Sharing" / Targeted Advertising Disclosures (US State
            Laws)
          </h2>
          <p className="mb-4">
            Some privacy laws define "sale" or "sharing" broadly to include
            disclosure of data for{" "}
            <strong>cross-context behavioral advertising</strong>.
          </p>
          <p className="mb-4">
            If our advertising setup qualifies as "sale" or "sharing" under
            applicable law, you can opt out via:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              <strong>Do Not Sell or Share My Personal Information:</strong>{" "}
              <Link
                href={config.links.doNotSellLink}
                className="text-blue-600 hover:underline"
              >
                {config.links.doNotSellLink}
              </Link>
            </li>
            <li>
              <strong>Privacy Choices / Cookie Preferences:</strong>{" "}
              <Link
                href={config.links.cookiePreferences}
                className="text-blue-600 hover:underline"
              >
                {config.links.cookiePreferences}
              </Link>
            </li>
            <li>
              <strong>Global Privacy Control (GPC):</strong> supported where
              required/recognized
            </li>
          </ul>
          <p>
            <strong>
              We do not knowingly sell the Personal Information of minors under
              16
            </strong>{" "}
            (where applicable).
          </p>
        </section>
      )}

      {/* Section 9: Your Rights */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          9) Your Rights and Choices
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) Account + Communication Controls
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Newsletter unsubscribe</strong>: link in every email
          </li>
          <li>
            <strong>Update preferences</strong>:{" "}
            <Link
              href={config.links.accountPreferences}
              className="text-blue-600 hover:underline"
            >
              {config.links.accountPreferences}
            </Link>
          </li>
          <li>
            <strong>Delete your account</strong>:{" "}
            <Link
              href={config.links.accountDeletion}
              className="text-blue-600 hover:underline"
            >
              {config.links.accountDeletion}
            </Link>
          </li>
          <li>
            <strong>Cookie preferences</strong>:{" "}
            <Link
              href={config.links.cookiePreferences}
              className="text-blue-600 hover:underline"
            >
              {config.links.cookiePreferences}
            </Link>
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          B) Privacy Rights Requests (Depending on Location)
        </h3>
        <p className="mb-4">
          Depending on where you live, you may have rights to:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Access / Know</strong> what we collect and how we use it
          </li>
          <li>
            <strong>Delete</strong> Personal Information
          </li>
          <li>
            <strong>Correct</strong> inaccurate Personal Information
          </li>
          <li>
            <strong>Portability</strong> (receive a copy in a usable format)
          </li>
          {config.features.targetedAdvertising && (
            <li>
              <strong>Opt out</strong> of targeted advertising / profiling (as
              defined by law)
            </li>
          )}
          <li>
            <strong>
              Limit use/disclosure of Sensitive Personal Information
            </strong>{" "}
            (where applicable)
          </li>
          <li>
            <strong>Non-discrimination</strong> for exercising privacy rights
          </li>
        </ul>
        <p className="mb-4">
          <strong>How to submit a request:</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Privacy Request Portal:{" "}
            <Link
              href={contact.portal}
              className="text-blue-600 hover:underline"
            >
              {contact.portal}
            </Link>
          </li>
          <li>
            Email:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </li>
          {config.company.phone && (
            <li>Toll-free number: {config.company.phone}</li>
          )}
        </ul>
        <p className="mb-4">
          <strong>Verification:</strong> We may need to verify your identity
          before fulfilling a request.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          C) Authorized Agents (Optional)
        </h3>
        <p className="mb-4">
          If allowed by law, you may designate an authorized agent to submit
          requests on your behalf. We may require proof of authorization.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          D) Appeals (Recommended Best Practice)
        </h3>
        <p className="mb-4">
          If we deny your request, you may appeal by contacting{" "}
          <a
            href={`mailto:${config.links.appealsEmail}`}
            className="text-blue-600 hover:underline"
          >
            {config.links.appealsEmail}
          </a>{" "}
          with the subject line "Privacy Request Appeal."
        </p>
      </section>

      {/* Section 10: Children's Privacy */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          10) Children's Privacy
        </h2>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Our services are{" "}
            <strong>
              not intended for children under {config.children.standard}
            </strong>{" "}
            (choose your standard).
          </li>
          <li>
            We do not knowingly collect Personal Information from children under{" "}
            <strong>13</strong> without verifiable parental consent.
          </li>
          <li>
            If you believe a child has provided Personal Information, contact us
            at{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>{" "}
            so we can delete it.
          </li>
        </ul>
      </section>

    </>
  );
}
