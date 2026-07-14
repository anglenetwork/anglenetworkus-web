/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "./privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacyPolicySections16To19() {
  return (
    <>
      {/* Section 16: Automated Decisions */}
      {config.features.personalizedContent && (
        <section>
          <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
            16) Automated Decisions / Profiling (If You Personalize)
          </h2>
          <p className="mb-4">We may use automated processing to:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Recommend articles or topics</li>
            <li>Detect fraud or abuse</li>
            {config.features.targetedAdvertising && (
              <li>Measure and optimize ad delivery (if enabled)</li>
            )}
          </ul>
          <p>
            Where required, you may have the right to opt out of certain
            profiling or request more information about the logic involved.
          </p>
        </section>
      )}

      {/* Section 17: Journalistic Ethics */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          17) Journalistic Ethics, Reader Trust, and Source Protection
        </h2>
        <p className="mb-4">
          We recognize a dual responsibility: protecting reader data and
          protecting journalistic integrity.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Source protection:</strong> We take steps designed to
            prevent analytics and technical logs from being used to identify
            confidential sources.
          </li>
          <li>
            <strong>Data minimization:</strong> We aim to collect only what we
            need to operate and improve our services.
          </li>
          <li>
            <strong>Integrity and transparency:</strong> We strive to present
            clear labeling of advertising/sponsored content and to provide
            meaningful privacy choices.
          </li>
        </ul>
        {config.links.ethicsPolicy && (
          <p>
            (You can link here to your{" "}
            <strong>Ethics Policy / Editorial Standards</strong> page:{" "}
            <Link
              href={config.links.ethicsPolicy}
              className="text-news-primary hover:underline"
            >
              {config.links.ethicsPolicy}
            </Link>
            .)
          </p>
        )}
      </section>

      {/* Section 18: Changes to Policy */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          18) Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, or legal requirements.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>We will update the "Last Updated" date at the top.</li>
          <li>
            If changes are material, we will provide additional notice (e.g.,
            site banner or email).
          </li>
        </ul>
      </section>

      {/* Section 19: Contact Us */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          19) Contact Us
        </h2>
        <p className="mb-4">For questions, requests, or complaints:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Email:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-news-primary hover:underline"
            >
              {contact.email}
            </a>
          </li>
          <li>
            Privacy Request Portal:{" "}
            <Link
              href={contact.portal}
              className="text-news-primary hover:underline"
            >
              {contact.portal}
            </Link>
          </li>
          <li>Address: {contact.address}</li>
        </ul>
      </section>

      {/* Optional Addenda */}
      {config.features.euUkUsers && (
        <>
          <section>
            <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
              A) EU/UK Addendum (GDPR/UK GDPR) for EU/UK Users
            </h2>
            <p className="mb-4">
              <strong>Legal bases</strong> may include:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Performance of a contract (account/newsletter delivery)</li>
              <li>
                Legitimate interests (site security, analytics, service
                improvement)
              </li>
              <li>
                Consent (certain cookies/targeted advertising; marketing where
                required)
              </li>
              <li>Legal obligation (compliance requests)</li>
            </ul>
            <p className="mb-4">
              <strong>Your GDPR rights</strong> may include access, deletion,
              correction, objection, restriction, portability, and withdrawal of
              consent.
            </p>
            <p>
              You may also lodge a complaint with your local supervisory
              authority.
            </p>
          </section>

          <section>
            <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
              B) "Notice at Collection" (If You Want a California-style front
              panel)
            </h2>
            <p className="mb-4">At or before collection, we collect:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                Identifiers (email/account), internet activity (usage/device),
                approximate location (IP-derived), and preferences
              </li>
            </ul>
            <p className="mb-4">For purposes:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                Service delivery, personalization, analytics, advertising
                (optional), security, and compliance
              </li>
            </ul>
            <p className="mb-4">Disclosures:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                We may "sell/share" for targeted advertising (if enabled); opt
                out via{" "}
                <Link
                  href={config.links.doNotSellLink}
                  className="text-news-primary hover:underline"
                >
                  {config.links.doNotSellLink}
                </Link>{" "}
                and{" "}
                <Link
                  href={config.links.cookiePreferences}
                  className="text-news-primary hover:underline"
                >
                  {config.links.cookiePreferences}
                </Link>
                .
              </li>
            </ul>
          </section>
        </>
      )}
    </>
  );
}
