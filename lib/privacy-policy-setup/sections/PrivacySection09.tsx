/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "../privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacySection09() {
  return (
    <>
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
              className="text-news-primary hover:underline"
            >
              {config.links.accountPreferences}
            </Link>
          </li>
          <li>
            <strong>Delete your account</strong>:{" "}
            <Link
              href={config.links.accountDeletion}
              className="text-news-primary hover:underline"
            >
              {config.links.accountDeletion}
            </Link>
          </li>
          <li>
            <strong>Cookie preferences</strong>:{" "}
            <Link
              href={config.links.cookiePreferences}
              className="text-news-primary hover:underline"
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
              className="text-news-primary hover:underline"
            >
              {contact.portal}
            </Link>
          </li>
          <li>
            Email:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-news-primary hover:underline"
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
            className="text-news-primary hover:underline"
          >
            {config.links.appealsEmail}
          </a>{" "}
          with the subject line "Privacy Request Appeal."
        </p>
      </section>
    </>
  );
}
