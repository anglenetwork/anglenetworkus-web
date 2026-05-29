/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "./terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsOfServiceSections05To08() {
  return (
    <>
      {/* Section 5: AI and Scraping Restrictions */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          5. Artificial Intelligence and Scraping Restrictions
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          5.1 No Automated Access; No Scraping or Data Harvesting
        </h3>
        <p className="mb-4">
          You may not access, acquire, copy, or monitor any portion of the
          Services or any Site Elements through <strong>automated means</strong>{" "}
          or for <strong>automated extraction</strong> purposes. This
          prohibition includes, without limitation, the use of{" "}
          <strong>
            robots, spiders, crawlers, scrapers, harvesters, data-mining tools,
            scripts, bots, automated browsers, indexing agents, or similar
            technologies
          </strong>
          , whether operated by you or on your behalf.
        </p>
        <p className="mb-4">
          Except as expressly permitted by these Terms or with our{" "}
          <strong>prior written authorization</strong>, you may not:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            scrape, crawl, spider, harvest, data mine, capture, copy, extract,
            or collect Site Elements or data from the Services;
          </li>
          <li>
            bypass or circumvent any limits on use, access controls, paywalls,
            geo-restrictions, or other protections; or
          </li>
          <li>
            use the Services in a manner that imposes an unreasonable load on
            our infrastructure or interferes with the Services' operation.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          5.2 Prohibition on AI Training and Model Development
        </h3>
        <p className="mb-4">
          <strong>
            You may not use any Site Elements (in whole or in part) for the
            purpose of directly or indirectly training, developing, testing,
            validating, fine-tuning, prompting, improving, or enriching
          </strong>{" "}
          any artificial intelligence or machine learning model, system,
          platform, tool, algorithm, or service, including any large language
          model (LLM), generative AI system, embedding model, ranking model, or
          similar technology,
          <strong>whether commercial or non-commercial</strong> without our{" "}
          <strong>express prior written permission</strong>.
        </p>
        <p className="mb-4">
          This restriction applies regardless of how the Site Elements are
          obtained and includes using Site Elements to create or improve:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            training datasets, evaluation datasets, benchmarks, or model
            outputs;
          </li>
          <li>
            retrieval indexes, embeddings, vector databases, or "knowledge
            bases" used to power AI tools; and
          </li>
          <li>
            summarization, rewriting, translation, or aggregation systems
            intended for publication or redistribution.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          5.3 Written Authorization Required
        </h3>
        <p className="mb-4">
          Any{" "}
          <strong>
            data harvesting, data mining, scraping, crawling, extraction,
            collection, or bulk use
          </strong>{" "}
          of Site Elements, whether for AI-related purposes or otherwise, requires
          our <strong>prior, explicit, written authorization</strong> (for
          example, via a signed licensing agreement or written permission from{" "}
          <a
            href={`mailto:${contact.permissionsEmail}`}
            className="text-blue-600 hover:underline"
          >
            {contact.permissionsEmail}
          </a>
          ). Absent such authorization, all such activity is{" "}
          <strong>strictly prohibited</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          5.4 No Bypassing Mechanical Restrictions
        </h3>
        <p className="mb-4">
          The Services may use technical and security measures designed to
          prevent unauthorized access and automated activity, including rate
          limiting, bot detection, CAPTCHA challenges, traffic filtering,
          paywalls, geo-filtering, IP blocking, token-based controls, and "under
          attack" or bot-challenging technologies (including third-party
          protections).{" "}
          <strong>
            You agree not to circumvent, bypass, disable, tamper with, reverse
            engineer, or otherwise defeat
          </strong>{" "}
          any such measures, and not to assist or enable others to do so.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          5.5 Enforcement and Remedies
        </h3>
        <p className="mb-4">
          We may, at any time and in our sole discretion, block, throttle, or
          restrict access (including by IP range), suspend or terminate
          accounts, and take technical and legal measures to enforce this
          Section. Unauthorized automated access, scraping, or AI-related use of
          Site Elements may constitute a material breach of these Terms and may
          expose you to civil and/or criminal liability under applicable law.
        </p>
      </section>

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
