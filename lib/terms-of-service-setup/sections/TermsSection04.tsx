/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection04() {
  return (
    <>
      {/* Section 4: User-Generated Content */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          4. User-Generated Content (UGC) and Licensing
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.1 User-Generated Content
        </h3>
        <p className="mb-4">
          Certain features of the Services may allow you or other users to
          submit, post, upload, transmit, or otherwise make content available,
          including comments, messages, images, videos, audio, usernames,
          profile information, "tips," or other materials (collectively, "
          <strong>User-Generated Content</strong>" or "<strong>UGC</strong>").
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.2 Public, Non-Confidential Submission
        </h3>
        <p className="mb-4">
          <strong>
            Any UGC you submit is provided voluntarily and is considered
            non-confidential and non-proprietary.
          </strong>{" "}
          You understand and agree that: (a){" "}
          <strong>no confidential, fiduciary, or special relationship</strong>{" "}
          is created by your submission of UGC; (b) we have{" "}
          <strong>no obligation</strong> to treat any UGC as confidential; and
          (c) we may use UGC consistent with these Terms without notice to you.
        </p>
        <p className="mb-4">
          UGC may be visible to the public and may be shared or reposted by
          others.{" "}
          <strong>You should not submit UGC you do not want made public</strong>{" "}
          or that you do not have the right to share.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.3 License Grant to {config.company.brandName}
        </h3>
        <p className="mb-4">
          By submitting, posting, or uploading UGC on or through the Services,
          you <strong>grant</strong> <strong>{config.company.legalName}</strong>
          , <strong>{config.company.brandName}</strong>, and our affiliates,
          licensees, successors, and assigns a{" "}
          <strong>
            worldwide, royalty-free, fully paid-up, perpetual, irrevocable,
            transferable, and fully sub-licensable (through multiple tiers)
          </strong>
          , non-exclusive right and license to:
        </p>
        <p className="mb-4">
          <strong>
            use, host, store, cache, reproduce, copy, modify, adapt, edit,
            translate, publish, publicly perform, publicly display, distribute,
            transmit, broadcast, create derivative works from, and otherwise
            exploit
          </strong>{" "}
          your UGC (in whole or in part), in any manner and in{" "}
          <strong>any media or technology now known or later developed</strong>,
          including for editorial, news reporting, promotional, marketing,
          advertising, analytics, product development, and distribution
          purposes,{" "}
          <strong>
            without further notice to you and without compensation
          </strong>
          .
        </p>
        <p className="mb-4">
          This license includes the right to use your{" "}
          <strong>name, username, likeness, and voice</strong> as they appear in
          your UGC, to the extent included in the UGC you submit.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.4 Moral Rights Waiver
        </h3>
        <p className="mb-4">
          To the extent permitted by applicable law, you{" "}
          <strong>waive and agree not to assert</strong> any "moral rights,"
          rights of attribution, integrity, disclosure, or similar rights you
          may have in your UGC, including any right to object to modifications,
          edits, or deletions (for example, edits for length, clarity,
          formatting, or to comply with our policies). Where a waiver is not
          permitted, you agree not to exercise such rights in a manner that
          interferes with our rights under these Terms.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.5 You Retain Ownership; Our Rights Are Broad
        </h3>
        <p className="mb-4">
          You retain whatever ownership rights you have in your UGC, subject to
          the license granted above. We are not required to use or display any
          UGC, and we may remove, edit, or refuse to publish UGC at any time for
          any reason, in our sole discretion (subject to applicable law).
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.6 Your Representations and Warranties
        </h3>
        <p className="mb-4">You represent and warrant that:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            (a) you <strong>own</strong> your UGC or have all necessary rights,
            permissions, and consents to submit it and to grant the rights
            described in these Terms;
          </li>
          <li>
            (b) your UGC does not infringe, violate, or misappropriate any
            third-party rights (including copyright, trademark, privacy,
            publicity, or other proprietary rights); and
          </li>
          <li>
            (c) your UGC complies with these Terms and all applicable laws and
            regulations.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.7 No Payment; No Obligation to Credit
        </h3>
        <p className="mb-4">
          You acknowledge and agree that: (a) you will{" "}
          <strong>not receive compensation</strong> for any UGC you submit or
          for any use of UGC by us or others acting under the rights granted in
          these Terms; and (b) while we may choose to credit you,{" "}
          <strong>we are not required to do so</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          4.8 Responsibility for UGC
        </h3>
        <p className="mb-4">
          UGC is the sole responsibility of the person who submitted it. UGC may
          not reflect our views, and we do not endorse any UGC. We have no
          obligation to monitor, review, or verify UGC, but we may do so at any
          time. If you believe UGC violates your rights (including defamation or
          infringement), please contact us at{" "}
          <a
            href={`mailto:${contact.legalEmail}`}
            className="text-news-primary hover:underline"
          >
            {contact.legalEmail}
          </a>{" "}
          or use the reporting tools provided on the Services (if available).
        </p>
      </section>
    </>
  );
}
