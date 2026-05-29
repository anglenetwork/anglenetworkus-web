/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "./terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsOfServiceSections12To13() {
  return (
    <>
      {/* Section 12: Amendments and Termination */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          12. Amendments and Termination Rights
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          12.1 Amendments to These Terms
        </h3>
        <p className="mb-4">
          We may update, modify, or replace these Terms{" "}
          <strong>at any time</strong>, in our <strong>sole discretion</strong>,
          for any reason, including to reflect changes to the Services,
          features, business practices, technology, or applicable law.
        </p>
        <p className="mb-4">
          We will post the most current version of the Terms on the Services and
          update the "Effective Date" (or similar label).{" "}
          <strong>Changes are effective when posted</strong> unless we specify a
          later effective date or applicable law requires otherwise.
        </p>
        <p className="mb-4">
          <strong>
            Your continued access to or use of the Services after updated Terms
            are posted constitutes your acceptance of the revised Terms.
          </strong>{" "}
          If you do not agree to the revised Terms, you must stop using the
          Services.
        </p>
        <p className="mb-4">
          If we make a material change, we may (but are not required to) provide
          additional notice (for example, via email to the address associated
          with your account, an in-product notice, or a banner). It is your
          responsibility to keep your account contact information current and to
          review the Terms periodically.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          12.2 Changes to the Services
        </h3>
        <p className="mb-4">
          We reserve the right, at any time and in our sole discretion, to{" "}
          <strong>modify, suspend, discontinue, restrict, or terminate</strong>{" "}
          all or any part of the Services (including any feature, content,
          subscription offering, community tools, or availability of archives),
          temporarily or permanently, <strong>with or without notice</strong>.
          We will not be liable to you or any third party for any modification,
          suspension, or discontinuation of the Services, to the fullest extent
          permitted by law.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          12.3 Termination and Suspension by Us
        </h3>
        <p className="mb-4">
          We may, in our sole discretion,{" "}
          <strong>suspend, restrict, or terminate</strong> your access to the
          Services and/or your account (if any), and may remove or disable
          access to any UGC or other information associated with you,{" "}
          <strong>
            at any time, for any reason or no reason, with or without notice
          </strong>
          . This includes, without limitation, if we believe that you have
          violated these Terms, the Community Guidelines, applicable law, or if
          your conduct creates risk or potential legal exposure for us, other
          users, or third parties.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          12.4 Termination by You
        </h3>
        <p className="mb-4">
          You may stop using the Services at any time. If you have an account,
          you may request account deletion or closure through the methods
          provided on the Services (if available). Please note that certain
          information may be retained as described in our Privacy Policy and as
          required or permitted by law.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          12.5 Effect of Termination
        </h3>
        <p className="mb-4">
          Upon any termination or suspension,{" "}
          <strong>the license and all rights granted to you</strong> under these
          Terms will immediately cease. Sections that by their nature should
          survive termination (including, without limitation, intellectual
          property provisions, UGC licenses, disclaimers, limitations of
          liability, dispute resolution, and any other provisions intended to
          survive) <strong>will survive</strong> termination to the fullest
          extent permitted by law.
        </p>
      </section>

      {/* Section 13: Miscellaneous */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          13. Miscellaneous / General Legal Terms
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.1 Governing Law and Venue (Non-Arbitration Matters)
        </h3>
        <p className="mb-4">
          These Terms are governed by the laws of the{" "}
          <strong>{config.legal.governingLaw}</strong>, without regard to
          conflict of law principles. To the extent any dispute is permitted to
          proceed in court (rather than arbitration), you and{" "}
          <strong>{config.company.brandName}</strong> consent to the exclusive
          jurisdiction and venue of the state and federal courts located in{" "}
          <strong>{config.legal.jurisdiction}</strong>, and waive any objection
          to such venue.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.2 Severability
        </h3>
        <p className="mb-4">
          If any provision of these Terms is held unlawful, void, or
          unenforceable, that provision will be deemed severed and limited or
          eliminated to the minimum extent necessary, and the remaining
          provisions will remain in full force and effect.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.3 Entire Agreement
        </h3>
        <p className="mb-4">
          These Terms (together with any policies or additional terms expressly
          incorporated by reference, including our Privacy Policy and Community
          Guidelines) constitute the <strong>entire agreement</strong> between
          you and <strong>{config.company.brandName}</strong> regarding your use
          of the Services and supersede all prior or contemporaneous agreements,
          communications, or understandings.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.4 No Waiver
        </h3>
        <p className="mb-4">
          Our failure to enforce any right or provision of these Terms will not
          operate as a waiver of such right or provision. Any waiver must be in
          writing and signed by an authorized representative of{" "}
          <strong>{config.company.brandName}</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.5 Assignment
        </h3>
        <p className="mb-4">
          You may not assign, transfer, or sublicense any of your rights or
          obligations under these Terms without our prior written consent. We
          may assign or transfer these Terms (in whole or in part) without
          restriction, including to an affiliate or in connection with a merger,
          acquisition, reorganization, or sale of assets.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.6 Relationship of the Parties
        </h3>
        <p className="mb-4">
          Nothing in these Terms creates any partnership, joint venture,
          employment, fiduciary, or agency relationship between you and{" "}
          <strong>{config.company.brandName}</strong>. You have no authority to
          bind us in any way.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.7 Headings
        </h3>
        <p className="mb-4">
          Headings are for convenience only and do not affect the interpretation
          of these Terms.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.8 Notices and Contact Information
        </h3>
        <p className="mb-4">
          Questions about these Terms may be sent to:{" "}
          <a
            href={`mailto:${contact.legalEmail}`}
            className="text-blue-600 hover:underline"
          >
            {contact.legalEmail}
          </a>
          .
        </p>
        <p className="mb-4">
          If you need to send a legal notice to{" "}
          <strong>{config.company.brandName}</strong>, you must send it to:{" "}
          <strong>{getCompanyAddress()}</strong>, Attn: Legal Department, and
          also email a copy to{" "}
          <a
            href={`mailto:${contact.legalEmail}`}
            className="text-blue-600 hover:underline"
          >
            {contact.legalEmail}
          </a>
          . We may provide notices to you via the Services, email, or other
          reasonable means.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          13.9 Current Version
        </h3>
        <p className="mb-4">
          The most current version of these Terms will be posted on the
          Services. If a hyperlink is not functional in a particular view,
          please visit{" "}
          <Link
            href={config.links.termsOfServiceUrl}
            className="text-blue-600 hover:underline"
          >
            {config.links.termsOfServiceUrl}
          </Link>{" "}
          directly.
        </p>
      </section>
    </>
  );
}
