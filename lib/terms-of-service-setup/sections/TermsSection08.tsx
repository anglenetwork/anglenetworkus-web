/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection08() {
  return (
    <>
      {/* Section 8: DMCA */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          8. DMCA Compliance (Notice and Takedown)
        </h2>
        <p className="mb-4">
          <strong>{config.company.brandName}</strong> respects the intellectual
          property rights of others and expects users of the Services to do the
          same. It is our policy, in appropriate circumstances and at our
          discretion, to remove or disable access to material that we believe
          infringes the copyrights of others and to terminate the accounts of
          users who are repeat infringers.
        </p>
        <p className="mb-4">
          This Section is intended to comply with the notice-and-takedown
          provisions of the{" "}
          <strong>
            Digital Millennium Copyright Act ("DMCA"), 17 U.S.C. § 512
          </strong>
          .
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          8.1 Designated DMCA Agent
        </h3>
        <p className="mb-4">
          If you believe that content on the Services infringes your copyright,
          please send a written notice to our Designated Agent at:
        </p>
        <div className="mb-4 border-gray-300 border-l-4 pl-4">
          <p>
            <strong>Designated Agent:</strong>{" "}
            {config.dmca.agentName || "[Full Name / Title]"}
            {config.dmca.agentTitle && ` / ${config.dmca.agentTitle}`}
          </p>
          <p>
            <strong>{config.company.legalName}</strong>
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {getCompanyAddress() || "[Street Address]"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${contact.dmcaEmail}`}
              className="text-blue-600 hover:underline"
            >
              {contact.dmcaEmail}
            </a>
          </p>
          {config.dmca.phone && (
            <p>
              <strong>Phone (optional):</strong> {config.dmca.phone}
            </p>
          )}
        </div>
        <p className="mb-4 text-gray-600 text-sm italic">
          Note: Only DMCA notices should be sent to the Designated Agent. Other
          inquiries may not receive a response.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          8.2 DMCA Takedown Notice Requirements
        </h3>
        <p className="mb-4">
          To be effective, your DMCA notice must be <strong>in writing</strong>{" "}
          and must include the following information (as required by{" "}
          <strong>17 U.S.C. § 512(c)(3)</strong>):
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            <strong>Your physical or electronic signature</strong> (or the
            signature of a person authorized to act on behalf of the copyright
            owner).
          </li>
          <li>
            <strong>Identification of the copyrighted work</strong> claimed to
            have been infringed (or, if multiple works are covered by a single
            notice, a representative list).
          </li>
          <li>
            <strong>Identification of the allegedly infringing material</strong>{" "}
            and information reasonably sufficient to permit us to locate it on
            the Services (for example, the exact URL(s) and a description of
            where the material appears).
          </li>
          <li>
            <strong>Your contact information</strong>, including your name,
            mailing address, telephone number, and email address.
          </li>
          <li>
            A statement that you have a <strong>good-faith belief</strong> that
            the use of the material in the manner complained of is{" "}
            <strong>not authorized</strong> by the copyright owner, its agent,
            or the law.
          </li>
          <li>
            A statement that the information in the notice is{" "}
            <strong>accurate</strong>, and{" "}
            <strong>under penalty of perjury</strong>, that you are the
            copyright owner or are authorized to act on behalf of the copyright
            owner.
          </li>
        </ol>
        <p className="mb-4">
          Upon receipt of a notice that substantially complies with the DMCA, we
          may remove or disable access to the material and may notify the user
          who posted it.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          8.3 DMCA Counter-Notification
        </h3>
        <p className="mb-4">
          If you believe that material you posted was removed or disabled by
          mistake or misidentification, you may submit a{" "}
          <strong>counter-notification</strong> to our Designated Agent. Your
          counter-notice must be <strong>in writing</strong> and include:
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            <strong>Your physical or electronic signature.</strong>
          </li>
          <li>
            Identification of the material that has been removed or disabled and
            the location where it appeared before it was removed or disabled
            (e.g., URL).
          </li>
          <li>
            A statement <strong>under penalty of perjury</strong> that you have
            a good-faith belief that the material was removed or disabled as a
            result of mistake or misidentification.
          </li>
          <li>
            <strong>Your name, address, and telephone number</strong>, and a
            statement that you <strong>consent to the jurisdiction</strong> of
            the Federal District Court for the judicial district in which your
            address is located (or, if outside the United States, for any
            judicial district in which we may be found), and that you will
            accept service of process from the person who submitted the original
            DMCA notice or that person's agent.
          </li>
        </ol>
        <p className="mb-4">
          If we receive a valid counter-notification, we may forward it to the
          original complaining party and, as permitted by the DMCA, may restore
          the material unless the complaining party files a court action seeking
          an order to restrain the allegedly infringing activity.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          8.4 Repeat Infringer Policy
        </h3>
        <p className="mb-4">
          In accordance with the DMCA and other applicable law,{" "}
          <strong>
            we maintain a policy to terminate, in appropriate circumstances, the
            accounts of users who are deemed to be repeat infringers.
          </strong>{" "}
          We may also, in our discretion, limit access to the Services, remove
          content, or take other appropriate action against users who repeatedly
          submit or post content that is alleged to infringe copyrights.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          8.5 Warning Against Misrepresentations (DMCA § 512(f))
        </h3>
        <p className="mb-4">
          <strong>Any person who knowingly materially misrepresents</strong>{" "}
          that material or activity is infringing (or that material was removed
          or disabled by mistake or misidentification) may be subject to
          liability under <strong>17 U.S.C. § 512(f)</strong>, including
          damages, costs, and attorneys' fees. We reserve the right to seek
          remedies against abusive or bad-faith DMCA notices and
          counter-notices.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          8.6 Other Claims
        </h3>
        <p className="mb-4">
          If your complaint involves something other than copyright (for
          example, trademark, defamation, privacy, or harassment), please
          contact us at{" "}
          <a
            href={`mailto:${contact.legalEmail}`}
            className="text-blue-600 hover:underline"
          >
            {contact.legalEmail}
          </a>{" "}
          so we can route your request appropriately.
        </p>
      </section>
    </>
  );
}
