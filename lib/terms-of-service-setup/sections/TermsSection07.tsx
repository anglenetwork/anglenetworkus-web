/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection07() {
  return (
    <>
      {/* Section 7: User Conduct */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          7. User Conduct and Community Guidelines
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          7.1 Community Standards
        </h3>
        <p className="mb-4">
          We want the Services to be a useful, safe place for readers to engage
          with news and one another. When you use the Services (including any
          comment or community features), you agree to follow these Terms and
          any additional community rules or "House Rules" we publish
          (collectively, the "<strong>Community Guidelines</strong>"). You are
          responsible for your conduct and for all activity that occurs under
          your account.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          7.2 Prohibited Conduct
        </h3>
        <p className="mb-4">
          You may not use the Services to do (or attempt to do) any of the
          following:
        </p>
        <p className="mb-2 font-semibold">Illegal or harmful activity</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Violate any applicable law or regulation, or encourage or facilitate
            illegal activity.
          </li>
          <li>
            Threaten, harass, stalk, abuse, intimidate, or harm any person, or
            incite violence.
          </li>
          <li>
            Post or transmit content that is defamatory, obscene, hateful,
            discriminatory, or otherwise unlawful or objectively abusive.
          </li>
          <li>
            Engage in doxxing, or post or solicit another person's sensitive
            personal information (e.g., addresses, phone numbers, government
            IDs, financial or medical information) without authorization.
          </li>
        </ul>
        <p className="mb-2 font-semibold">Impersonation and deception</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Impersonate any person or entity, including{" "}
            <strong>
              our journalists, editors, staff, moderators, contractors, sources,
              public officials, or law enforcement
            </strong>
            , or falsely state or misrepresent your affiliation with any person
            or organization.
          </li>
          <li>
            Misrepresent the source of content, including by{" "}
            <strong>
              manipulating headers, identifiers, metadata, routing information,
              or other technical data
            </strong>{" "}
            to disguise the origin of messages, posts, emails, or submissions.
          </li>
          <li>
            Coordinate disinformation campaigns, inauthentic engagement, or
            deceptive amplification (including use of fake accounts, purchased
            engagement, or coordinated brigading).
          </li>
        </ul>
        <p className="mb-2 font-semibold">
          Security, interference, and misuse of the Services
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Upload, transmit, or distribute any viruses, malware, spyware,
            ransomware, "time bombs," or other harmful code.
          </li>
          <li>
            Attempt to probe, scan, test, bypass, or compromise the security of
            the Services or any related systems or networks.
          </li>
          <li>
            Interfere with or disrupt the Services or servers/networks connected
            to the Services, including by flooding, spamming, or overloading.
          </li>
          <li>
            Attempt to access accounts, data, or systems you are not authorized
            to access, or attempt to circumvent technical restrictions
            (including rate limits, paywalls, geo-restrictions, or bot
            protections).
          </li>
          <li>
            Use automated means to post, create accounts, or generate engagement
            (including bots) without our express permission.
          </li>
        </ul>
        <p className="mb-2 font-semibold">Content and rights violations</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Post or submit content that infringes or violates any third-party
            rights (including copyright, trademark, privacy, or publicity
            rights).
          </li>
          <li>
            Remove, obscure, or alter proprietary notices, labels, or
            attributions on content.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          7.3 Real Name Policy for Commenting (Robust)
        </h3>
        <p className="mb-4">
          To promote accountability and reduce abuse,{" "}
          <strong>
            we may require that comments and certain community features be used
            under a real name or a name that reasonably identifies you
          </strong>
          , as determined by us in our sole discretion.{" "}
          <strong>
            Unique, fictitious, misleading, or impersonating names may be
            disallowed
          </strong>
          , except where we explicitly permit pseudonyms (for example, in
          designated areas or where safety considerations justify it). We may
          require additional verification, suspend, or remove accounts that do
          not comply with this policy.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          7.4 Moderation, Enforcement, and Disclosure
        </h3>
        <p className="mb-4">
          We may (but are not obligated to) monitor, review, moderate, or remove
          content and restrict access to the Services at any time, for any
          reason, including for violations of these Terms or the Community
          Guidelines. We may also suspend or terminate accounts, remove content,
          and take other appropriate action.
        </p>
        <p className="mb-4">
          To the extent permitted by law, we may{" "}
          <strong>preserve and disclose information</strong> (including account
          information, UGC, IP addresses, and related records) if we believe in
          good faith that such preservation or disclosure is reasonably
          necessary to: (a) comply with legal process or government requests;
          (b) enforce these Terms; (c) respond to claims that content violates
          the rights of third parties; or (d) protect the rights, property, or
          safety of <strong>{config.company.brandName}</strong>, our users, or
          the public.
        </p>
      </section>
    </>
  );
}
