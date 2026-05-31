/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection06() { return (<>
      {/* Section 6: Section 230 */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          6. Section 230 "Good Samaritan" Protections (Third-Party Content)
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          6.1 Third-Party Content; Not the Publisher or Speaker
        </h3>
        <p className="mb-4">
          The Services may include User-Generated Content and other third-party
          content (including comments, posts, links, embeds, and materials
          submitted by users or other third parties) ("
          <strong>Third-Party Content</strong>").{" "}
          <strong>
            To the fullest extent permitted by law, we are not responsible for
            Third-Party Content and we do not endorse it.
          </strong>
        </p>
        <p className="mb-4">
          For users in the United States, and as applicable under{" "}
          <strong>47 U.S.C. § 230</strong>,{" "}
          <strong>
            we will not be treated as the "publisher or speaker" of information
            provided by another information content provider.
          </strong>{" "}
          You understand and agree that any opinions, advice, statements,
          offers, or other information in Third-Party Content are those of the
          respective author(s) and not of{" "}
          <strong>{config.company.brandName}</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          6.2 Good Samaritan Moderation Rights
        </h3>
        <p className="mb-4">
          We reserve the right (but do not assume the obligation) to{" "}
          <strong>
            remove, edit, block, restrict, disable access to, or otherwise
            moderate
          </strong>{" "}
          any Third-Party Content or user access to the Services{" "}
          <strong>at any time</strong>, in our sole discretion, including if we
          believe the content is{" "}
          <strong>
            obscene, lewd, lascivious, filthy, excessively violent, harassing,
            hateful, defamatory, infringing, unlawful, misleading, spammy, or
            otherwise objectionable
          </strong>
          ,{" "}
          <strong>
            whether or not such material is constitutionally protected
          </strong>
          .
        </p>
        <p className="mb-4">
          We may take these actions <strong>in good faith</strong> to protect
          users, comply with law, enforce these Terms, or maintain the integrity
          and safety of the Services.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          6.3 No Monitoring Obligation
        </h3>
        <p className="mb-4">
          <strong>
            We do not have any obligation to monitor, screen, review, or remove
            Third-Party Content
          </strong>
          , and we do not guarantee that Third-Party Content will be accurate,
          complete, lawful, or suitable. Moderation may be performed manually,
          automatically, or not at all.{" "}
          <strong>
            Our decision to moderate (or not moderate) content does not create
            any duty or liability
          </strong>{" "}
          to you or any third party.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          6.4 Reporting
        </h3>
        <p className="mb-4">
          If you believe Third-Party Content violates these Terms, your rights,
          or applicable law, you may report it through any reporting tools
          available on the Services or contact us at{" "}
          <a
            href={`mailto:${contact.legalEmail}`}
            className="text-blue-600 hover:underline"
          >
            {contact.legalEmail}
          </a>
          . We may (but are not required to) review and take action in our
          discretion.
        </p>
      </section>

</>); }
