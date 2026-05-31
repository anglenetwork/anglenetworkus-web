/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "../privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacySection10() {
  return (
    <>
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
