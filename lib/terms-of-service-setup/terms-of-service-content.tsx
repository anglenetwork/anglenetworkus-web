/**
 * Terms of Service Content
 * 
 * This file contains the complete terms of service content with variable placeholders.
 * The content is structured as React components for easy rendering and modification.
 * 
 * HOW TO MODIFY THE CONTENT:
 * 
 * 1. For simple text changes: Edit the JSX content directly in this file
 * 2. For variable values: Update terms-of-service-config.ts instead
 * 3. To add/remove sections: Modify the JSX structure in this component
 * 
 * All placeholders like {config.company.legalName} are automatically replaced with values
 * from terms-of-service-config.ts. To change a value, update the config file, not this file.
 */

import Link from "next/link";
import { termsOfServiceConfig, getCompanyAddress, getContactInfo } from "./terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsOfServiceContent() {
  return (
    <div className="space-y-8">
      {/* Section 1: Acceptance of Terms */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          1. Acceptance of Terms and Eligibility
        </h2>
        <p className="mb-4">
          These Terms of Service ("Terms") are a legally binding agreement between you and{" "}
          <strong>{config.company.legalName}</strong> ("<strong>{config.company.brandName}</strong>,"
          "we," "us," or "our").{" "}
          <strong>
            By accessing, browsing, or using any part of the Services, you unconditionally agree to
            be bound by these Terms, just as if you had signed them.
          </strong>{" "}
          If you do not agree to these Terms, you may not access or use the Services.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">1.1 The "Services"</h3>
        <p className="mb-4">
          For purposes of these Terms, the "<strong>Services</strong>" include{" "}
          <strong>{config.company.websiteDomain}</strong>, any related websites, mobile
          applications, newsletters, email or SMS features, RSS feeds, embeddable players/widgets,
          accounts and subscription features, comment/community features, and any other products,
          tools, or services we provide now or in the future that link to or reference these Terms.
          The Services also include <strong>{config.company.brandName}-managed spaces</strong> on
          third-party platforms (for example, pages, profiles, channels, or communities on social
          networks or app platforms), to the extent we control those spaces and make them available
          to users.
        </p>
        <p className="mb-4">
          Certain parts of the Services may be subject to additional terms, rules, or guidelines (for
          example, subscription terms, community rules, promotions, or platform-specific terms).
          Those additional terms are incorporated into these Terms by reference, and if there is a
          conflict, the additional terms will control for that specific feature or offering.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">1.2 Updates to These Terms</h3>
        <p className="mb-4">
          We may change these Terms from time to time. We will post the updated Terms with a new
          "Effective Date" at the top (and may provide additional notice for material changes).{" "}
          <strong>
            Your continued access to or use of the Services after changes become effective means
            you accept the updated Terms.
          </strong>{" "}
          If you do not agree to the updated Terms, you must stop using the Services.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">
          1.3 Eligibility; Age Requirements
        </h3>
        <p className="mb-4">
          You may use the Services only if you can legally enter into a binding contract with us and
          are not prohibited from using the Services under applicable law.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Minimum age:</strong> The Services are <strong>not intended for children under 13</strong>,
            and children under 13 may not use the Services.
          </li>
          <li>
            <strong>Minors (13–17):</strong> If you are{" "}
            <strong>13 to 17 years old (or otherwise under the age of majority where you live)</strong>,
            you may use the Services <strong>only with the involvement and consent of a parent or legal guardian</strong>.
            Your parent or legal guardian is responsible for your use of the Services and for ensuring
            your compliance with these Terms.
          </li>
          <li>
            <strong>Accounts, purchases, and subscriptions:</strong> To create an account, submit
            content (including comments), or purchase a subscription or other paid product, you must
            be <strong>18 or older (or the age of majority where you live)</strong>, <strong>or</strong>{" "}
            your parent/legal guardian must do so on your behalf and agree to these Terms.
          </li>
        </ul>
        <p className="mb-4">
          If a parent or legal guardian permits a minor to use the Services, the parent/legal
          guardian represents and warrants that they have the authority to do so and{" "}
          <strong>agree to these Terms on behalf of the minor</strong>, and they accept responsibility
          for the minor's activity on the Services.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">1.4 Location and Availability</h3>
        <p className="mb-4">
          The Services are controlled and operated from <strong>{config.legal.country}</strong>. We
          make no representation that the Services are appropriate or available in every location.{" "}
          <strong>
            You access the Services at your own initiative and are responsible for compliance with
            local laws.
          </strong>{" "}
          We may limit, suspend, or refuse access to the Services in any jurisdiction at any time.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">
          1.5 Third-Party Platforms and App Stores
        </h3>
        <p className="mb-4">
          If you access the Services through a third-party platform (such as an app store or social
          media service), you may also be subject to that platform's terms and policies. Where those
          terms impose additional requirements, you agree to comply with them.{" "}
          <strong>
            As between you and us, these Terms govern your use of the Services unless we expressly
            state otherwise for a specific offering.
          </strong>
        </p>
      </section>

      {/* Section 2: Intellectual Property */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          2. Intellectual Property and "Site Elements"
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">2.1 Ownership</h3>
        <p className="mb-4">
          The Services and all materials and content made available through the Services are owned or
          licensed by <strong>{config.company.legalName}</strong> and/or our licensors and content
          providers, and are protected by applicable intellectual property laws, including copyright,
          trademark, trade dress, and other laws in the <strong>{config.legal.country} and internationally</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">2.2 Definition of "Site Elements"</h3>
        <p className="mb-4">
          For purposes of these Terms, "<strong>Site Elements</strong>" means <strong>all</strong>{" "}
          content, materials, and features displayed, performed, published, provided, or otherwise
          made available through the Services, including, without limitation:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Editorial and informational content:</strong> articles, headlines, summaries,
            text, interviews, captions, metadata, tags, categories, directories, compilations, and
            databases;
          </li>
          <li>
            <strong>Visual assets:</strong> photographs, illustrations, graphics, charts,
            infographics, images, icons, animations, and design elements;
          </li>
          <li>
            <strong>Audio/visual content:</strong> videos, livestreams, audio clips, podcasts, music,
            and other audio-visual files;
          </li>
          <li>
            <strong>Brand and identity materials:</strong> names, trademarks, service marks, logos,
            trade names, domain names, and other brand features;
          </li>
          <li>
            <strong>Software and technology:</strong> the Services' software, applications, tools,
            widgets, APIs (if any), source and object code, scripts, and any other underlying
            technology;
          </li>
          <li>
            <strong>Interface and code:</strong> user interface elements, layout, page templates,
            navigation, and the underlying or associated code and structures, including{" "}
            <strong>
              HTML, CSS, JavaScript, XML, JSON, and other markup or data formats
            </strong>;
          </li>
          <li>
            <strong>Downloads and digital files:</strong> newsletters, PDFs, digital downloads, and
            other files or materials; and
          </li>
          <li>
            <strong>Other features and materials:</strong> interactive features, comment/community
            features (excluding User Content as defined elsewhere), and any products or services
            offered through the Services.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">2.3 "Look and Feel" and Compilation</h3>
        <p className="mb-4">
          The Services' <strong>overall appearance, design, and presentation</strong>, including the{" "}
          <strong>"look and feel,"</strong> selection, coordination, arrangement, and organization of
          Site Elements (including the ordering and display of stories, modules, and navigational
          structure), constitute <strong>original works of authorship</strong> and are protected by
          intellectual property and trade dress laws. You may not copy, imitate, or replicate any
          portion of the Services' look and feel or compilation without our prior written permission.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">2.4 No Transfer of Rights</h3>
        <p className="mb-4">
          Except as expressly stated in these Terms, <strong>no right, title, or interest</strong> in
          or to the Services or any Site Elements is transferred to you. Any access to or use of the
          Services does not grant you ownership of any intellectual property rights in Site Elements.
          All rights not expressly granted are reserved by <strong>{config.company.brandName}</strong>{" "}
          and our licensors.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">2.5 Limited License to Use the Services</h3>
        <p className="mb-4">
          Subject to your compliance with these Terms, we grant you a{" "}
          <strong>
            limited, revocable, non-exclusive, non-transferable, and non-sublicensable
          </strong>{" "}
          license to access and use the Services and Site Elements{" "}
          <strong>for your personal, non-commercial use</strong> only. This license does not permit
          you to (and you may not) reproduce, distribute, publicly display, publicly perform,
          publish, transmit, create derivative works from, sell, license, exploit, or otherwise use
          any Site Elements except as expressly allowed by these Terms or with our prior written
          consent.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">2.6 Third-Party Rights</h3>
        <p className="mb-4">
          Some Site Elements may be owned by or licensed from third parties. All third-party
          trademarks, logos, and content remain the property of their respective owners, and your use
          of those materials may be subject to additional restrictions imposed by the applicable
          owners or licensors.
        </p>
      </section>

      {/* Section 3: Limited License for Personal Use */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          3. Limited License for Personal Use
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">3.1 Limited License (Personal, Non-Commercial)</h3>
        <p className="mb-4">
          Subject to your ongoing compliance with these Terms, <strong>{config.company.brandName}</strong>{" "}
          grants you a <strong>
            limited, revocable, non-exclusive, non-transferable, and non-sublicensable
          </strong>{" "}
          license to access and use the Services and Site Elements{" "}
          <strong>solely for your personal, non-commercial use</strong>. This includes viewing
          content through normal browser/app functionality and, where a feature is provided by us,
          making <strong>a single copy</strong> (e.g., downloading or printing){" "}
          <strong>for your personal, non-commercial, and educational use</strong>.
        </p>
        <p className="mb-4">
          <strong>Access to the Services and Site Elements is licensed, not sold.</strong> You do
          not obtain any ownership interest or intellectual property rights in any Site Elements by
          accessing or using the Services.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">
          3.2 Prohibited Uses (No Archiving, Redistribution, or Derivatives)
        </h3>
        <p className="mb-4">
          Except as expressly permitted by these Terms or with our <strong>prior written consent</strong>,
          you may not, and may not allow any third party to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Copy, reproduce, republish, upload, post, transmit, broadcast, or distribute</strong>{" "}
            any Site Elements (in whole or in part) in any form or by any means;
          </li>
          <li>
            <strong>Archive, store, cache, or build a library</strong> of Site Elements (including by
            systematic downloading, saving, or indexing), other than temporary caching incident to
            ordinary web browsing;
          </li>
          <li>
            <strong>Scrape, crawl, spider, harvest, or use automated means</strong> to access,
            extract, or collect Site Elements or data from the Services (including for training,
            summarization, aggregation, or republishing);
          </li>
          <li>
            <strong>Create derivative works</strong> from Site Elements, including edits,
            translations, adaptations, summaries, annotations, remixes, or compilations intended for
            publication, distribution, or commercial use;
          </li>
          <li>
            <strong>Redistribute, syndicate, frame, mirror, or display</strong> Site Elements on
            another website, app, platform, service, or network (including "news aggregator" sites or
            feeds), or otherwise republish our reporting to drive traffic elsewhere;
          </li>
          <li>
            <strong>Sell, rent, lease, license, sublicense, or commercially exploit</strong> any Site
            Elements or access to the Services; or
          </li>
          <li>
            <strong>Remove, alter, or obscure</strong> any copyright, trademark, attribution, or
            proprietary notices included in or accompanying Site Elements.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">3.3 Security and Access Controls</h3>
        <p className="mb-4">
          You agree not to <strong>circumvent, disable, degrade, or interfere with</strong> any
          security features, access controls, paywalls, geo-restrictions, digital rights management,
          or other protections used by the Services. You also agree not to interfere with the
          operation of the Services or other users' access to the Services, including through
          hacking, introducing malware, or attempting to gain unauthorized access to systems or
          accounts.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">3.4 Permission Requests</h3>
        <p className="mb-4">
          If you want to use Site Elements in a way not expressly permitted by these Terms (including
          republication, redistribution, commercial use, or use in products/services), you must
          obtain our <strong>prior written permission</strong> from{" "}
          <a href={`mailto:${contact.permissionsEmail}`} className="text-blue-600 hover:underline">
            {contact.permissionsEmail}
          </a>{" "}
          (or the contact method we specify on the Services).
        </p>
      </section>

      {/* Section 4: User-Generated Content */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          4. User-Generated Content (UGC) and Licensing
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.1 User-Generated Content</h3>
        <p className="mb-4">
          Certain features of the Services may allow you or other users to submit, post, upload,
          transmit, or otherwise make content available, including comments, messages, images,
          videos, audio, usernames, profile information, "tips," or other materials (collectively,
          "<strong>User-Generated Content</strong>" or "<strong>UGC</strong>").
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.2 Public, Non-Confidential Submission</h3>
        <p className="mb-4">
          <strong>Any UGC you submit is provided voluntarily and is considered non-confidential and non-proprietary.</strong>{" "}
          You understand and agree that: (a) <strong>no confidential, fiduciary, or special relationship</strong>{" "}
          is created by your submission of UGC; (b) we have <strong>no obligation</strong> to treat
          any UGC as confidential; and (c) we may use UGC consistent with these Terms without
          notice to you.
        </p>
        <p className="mb-4">
          UGC may be visible to the public and may be shared or reposted by others.{" "}
          <strong>You should not submit UGC you do not want made public</strong> or that you do not
          have the right to share.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.3 License Grant to {config.company.brandName}</h3>
        <p className="mb-4">
          By submitting, posting, or uploading UGC on or through the Services, you <strong>grant</strong>{" "}
          <strong>{config.company.legalName}</strong>, <strong>{config.company.brandName}</strong>,
          and our affiliates, licensees, successors, and assigns a{" "}
          <strong>
            worldwide, royalty-free, fully paid-up, perpetual, irrevocable, transferable, and fully
            sub-licensable (through multiple tiers)
          </strong>, non-exclusive right and license to:
        </p>
        <p className="mb-4">
          <strong>
            use, host, store, cache, reproduce, copy, modify, adapt, edit, translate, publish,
            publicly perform, publicly display, distribute, transmit, broadcast, create derivative
            works from, and otherwise exploit
          </strong>{" "}
          your UGC (in whole or in part), in any manner and in{" "}
          <strong>any media or technology now known or later developed</strong>, including for
          editorial, news reporting, promotional, marketing, advertising, analytics, product
          development, and distribution purposes, <strong>
            without further notice to you and without compensation
          </strong>.
        </p>
        <p className="mb-4">
          This license includes the right to use your <strong>name, username, likeness, and voice</strong>{" "}
          as they appear in your UGC, to the extent included in the UGC you submit.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.4 Moral Rights Waiver</h3>
        <p className="mb-4">
          To the extent permitted by applicable law, you <strong>waive and agree not to assert</strong>{" "}
          any "moral rights," rights of attribution, integrity, disclosure, or similar rights you
          may have in your UGC, including any right to object to modifications, edits, or deletions
          (for example, edits for length, clarity, formatting, or to comply with our policies).
          Where a waiver is not permitted, you agree not to exercise such rights in a manner that
          interferes with our rights under these Terms.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.5 You Retain Ownership; Our Rights Are Broad</h3>
        <p className="mb-4">
          You retain whatever ownership rights you have in your UGC, subject to the license granted
          above. We are not required to use or display any UGC, and we may remove, edit, or refuse
          to publish UGC at any time for any reason, in our sole discretion (subject to applicable
          law).
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.6 Your Representations and Warranties</h3>
        <p className="mb-4">You represent and warrant that:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            (a) you <strong>own</strong> your UGC or have all necessary rights, permissions, and
            consents to submit it and to grant the rights described in these Terms;
          </li>
          <li>
            (b) your UGC does not infringe, violate, or misappropriate any third-party rights
            (including copyright, trademark, privacy, publicity, or other proprietary rights); and
          </li>
          <li>
            (c) your UGC complies with these Terms and all applicable laws and regulations.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.7 No Payment; No Obligation to Credit</h3>
        <p className="mb-4">
          You acknowledge and agree that: (a) you will <strong>not receive compensation</strong> for
          any UGC you submit or for any use of UGC by us or others acting under the rights granted
          in these Terms; and (b) while we may choose to credit you, <strong>we are not required to do so</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">4.8 Responsibility for UGC</h3>
        <p className="mb-4">
          UGC is the sole responsibility of the person who submitted it. UGC may not reflect our
          views, and we do not endorse any UGC. We have no obligation to monitor, review, or verify
          UGC, but we may do so at any time. If you believe UGC violates your rights (including
          defamation or infringement), please contact us at{" "}
          <a href={`mailto:${contact.legalEmail}`} className="text-blue-600 hover:underline">
            {contact.legalEmail}
          </a>{" "}
          or use the reporting tools provided on the Services (if available).
        </p>
      </section>

      {/* Section 5: AI and Scraping Restrictions */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          5. Artificial Intelligence and Scraping Restrictions
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">5.1 No Automated Access; No Scraping or Data Harvesting</h3>
        <p className="mb-4">
          You may not access, acquire, copy, or monitor any portion of the Services or any Site
          Elements through <strong>automated means</strong> or for <strong>automated extraction</strong>{" "}
          purposes. This prohibition includes, without limitation, the use of{" "}
          <strong>
            robots, spiders, crawlers, scrapers, harvesters, data-mining tools, scripts, bots,
            automated browsers, indexing agents, or similar technologies
          </strong>, whether operated by you or on your behalf.
        </p>
        <p className="mb-4">
          Except as expressly permitted by these Terms or with our <strong>prior written authorization</strong>,
          you may not:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            scrape, crawl, spider, harvest, data mine, capture, copy, extract, or collect Site
            Elements or data from the Services;
          </li>
          <li>
            bypass or circumvent any limits on use, access controls, paywalls, geo-restrictions, or
            other protections; or
          </li>
          <li>
            use the Services in a manner that imposes an unreasonable load on our infrastructure or
            interferes with the Services' operation.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">5.2 Prohibition on AI Training and Model Development</h3>
        <p className="mb-4">
          <strong>
            You may not use any Site Elements (in whole or in part) for the purpose of directly or
            indirectly training, developing, testing, validating, fine-tuning, prompting, improving,
            or enriching
          </strong>{" "}
          any artificial intelligence or machine learning model, system, platform, tool, algorithm,
          or service, including any large language model (LLM), generative AI system, embedding
          model, ranking model, or similar technology—<strong>whether commercial or non-commercial</strong>—without
          our <strong>express prior written permission</strong>.
        </p>
        <p className="mb-4">This restriction applies regardless of how the Site Elements are obtained and includes using Site Elements to create or improve:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            training datasets, evaluation datasets, benchmarks, or model outputs;
          </li>
          <li>
            retrieval indexes, embeddings, vector databases, or "knowledge bases" used to power AI
            tools; and
          </li>
          <li>
            summarization, rewriting, translation, or aggregation systems intended for publication
            or redistribution.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">5.3 Written Authorization Required</h3>
        <p className="mb-4">
          Any <strong>
            data harvesting, data mining, scraping, crawling, extraction, collection, or bulk use
          </strong>{" "}
          of Site Elements—whether for AI-related purposes or otherwise—requires our{" "}
          <strong>prior, explicit, written authorization</strong> (for example, via a signed licensing
          agreement or written permission from{" "}
          <a href={`mailto:${contact.permissionsEmail}`} className="text-blue-600 hover:underline">
            {contact.permissionsEmail}
          </a>
          ). Absent such authorization, all such activity is <strong>strictly prohibited</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">5.4 No Bypassing Mechanical Restrictions</h3>
        <p className="mb-4">
          The Services may use technical and security measures designed to prevent unauthorized
          access and automated activity, including rate limiting, bot detection, CAPTCHA challenges,
          traffic filtering, paywalls, geo-filtering, IP blocking, token-based controls, and "under
          attack" or bot-challenging technologies (including third-party protections).{" "}
          <strong>
            You agree not to circumvent, bypass, disable, tamper with, reverse engineer, or otherwise
            defeat
          </strong>{" "}
          any such measures, and not to assist or enable others to do so.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">5.5 Enforcement and Remedies</h3>
        <p className="mb-4">
          We may, at any time and in our sole discretion, block, throttle, or restrict access
          (including by IP range), suspend or terminate accounts, and take technical and legal
          measures to enforce this Section. Unauthorized automated access, scraping, or AI-related
          use of Site Elements may constitute a material breach of these Terms and may expose you
          to civil and/or criminal liability under applicable law.
        </p>
      </section>

      {/* Section 6: Section 230 */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          6. Section 230 "Good Samaritan" Protections (Third-Party Content)
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">6.1 Third-Party Content; Not the Publisher or Speaker</h3>
        <p className="mb-4">
          The Services may include User-Generated Content and other third-party content (including
          comments, posts, links, embeds, and materials submitted by users or other third parties)
          ("<strong>Third-Party Content</strong>").{" "}
          <strong>
            To the fullest extent permitted by law, we are not responsible for Third-Party Content
            and we do not endorse it.
          </strong>
        </p>
        <p className="mb-4">
          For users in the United States, and as applicable under <strong>47 U.S.C. § 230</strong>,{" "}
          <strong>
            we will not be treated as the "publisher or speaker" of information provided by another
            information content provider.
          </strong>{" "}
          You understand and agree that any opinions, advice, statements, offers, or other
          information in Third-Party Content are those of the respective author(s) and not of{" "}
          <strong>{config.company.brandName}</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">6.2 Good Samaritan Moderation Rights</h3>
        <p className="mb-4">
          We reserve the right (but do not assume the obligation) to{" "}
          <strong>
            remove, edit, block, restrict, disable access to, or otherwise moderate
          </strong>{" "}
          any Third-Party Content or user access to the Services <strong>at any time</strong>, in
          our sole discretion, including if we believe the content is{" "}
          <strong>
            obscene, lewd, lascivious, filthy, excessively violent, harassing, hateful, defamatory,
            infringing, unlawful, misleading, spammy, or otherwise objectionable
          </strong>, <strong>whether or not such material is constitutionally protected</strong>.
        </p>
        <p className="mb-4">
          We may take these actions <strong>in good faith</strong> to protect users, comply with law,
          enforce these Terms, or maintain the integrity and safety of the Services.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">6.3 No Monitoring Obligation</h3>
        <p className="mb-4">
          <strong>
            We do not have any obligation to monitor, screen, review, or remove Third-Party Content
          </strong>, and we do not guarantee that Third-Party Content will be accurate, complete,
          lawful, or suitable. Moderation may be performed manually, automatically, or not at all.{" "}
          <strong>
            Our decision to moderate (or not moderate) content does not create any duty or liability
          </strong>{" "}
          to you or any third party.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">6.4 Reporting</h3>
        <p className="mb-4">
          If you believe Third-Party Content violates these Terms, your rights, or applicable law,
          you may report it through any reporting tools available on the Services or contact us at{" "}
          <a href={`mailto:${contact.legalEmail}`} className="text-blue-600 hover:underline">
            {contact.legalEmail}
          </a>
          . We may (but are not required to) review and take action in our discretion.
        </p>
      </section>

      {/* Section 7: User Conduct */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          7. User Conduct and Community Guidelines
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">7.1 Community Standards</h3>
        <p className="mb-4">
          We want the Services to be a useful, safe place for readers to engage with news and one
          another. When you use the Services (including any comment or community features), you agree
          to follow these Terms and any additional community rules or "House Rules" we publish
          (collectively, the "<strong>Community Guidelines</strong>"). You are responsible for your
          conduct and for all activity that occurs under your account.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">7.2 Prohibited Conduct</h3>
        <p className="mb-4">You may not use the Services to do (or attempt to do) any of the following:</p>
        <p className="mb-2 font-semibold">Illegal or harmful activity</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Violate any applicable law or regulation, or encourage or facilitate illegal activity.</li>
          <li>
            Threaten, harass, stalk, abuse, intimidate, or harm any person, or incite violence.
          </li>
          <li>
            Post or transmit content that is defamatory, obscene, hateful, discriminatory, or
            otherwise unlawful or objectively abusive.
          </li>
          <li>
            Engage in doxxing, or post or solicit another person's sensitive personal information
            (e.g., addresses, phone numbers, government IDs, financial or medical information)
            without authorization.
          </li>
        </ul>
        <p className="mb-2 font-semibold">Impersonation and deception</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            Impersonate any person or entity, including{" "}
            <strong>
              our journalists, editors, staff, moderators, contractors, sources, public officials, or
              law enforcement
            </strong>, or falsely state or misrepresent your affiliation with any person or
            organization.
          </li>
          <li>
            Misrepresent the source of content, including by{" "}
            <strong>
              manipulating headers, identifiers, metadata, routing information, or other technical
              data
            </strong>{" "}
            to disguise the origin of messages, posts, emails, or submissions.
          </li>
          <li>
            Coordinate disinformation campaigns, inauthentic engagement, or deceptive amplification
            (including use of fake accounts, purchased engagement, or coordinated brigading).
          </li>
        </ul>
        <p className="mb-2 font-semibold">Security, interference, and misuse of the Services</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            Upload, transmit, or distribute any viruses, malware, spyware, ransomware, "time bombs,"
            or other harmful code.
          </li>
          <li>
            Attempt to probe, scan, test, bypass, or compromise the security of the Services or any
            related systems or networks.
          </li>
          <li>
            Interfere with or disrupt the Services or servers/networks connected to the Services,
            including by flooding, spamming, or overloading.
          </li>
          <li>
            Attempt to access accounts, data, or systems you are not authorized to access, or
            attempt to circumvent technical restrictions (including rate limits, paywalls,
            geo-restrictions, or bot protections).
          </li>
          <li>
            Use automated means to post, create accounts, or generate engagement (including bots)
            without our express permission.
          </li>
        </ul>
        <p className="mb-2 font-semibold">Content and rights violations</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            Post or submit content that infringes or violates any third-party rights (including
            copyright, trademark, privacy, or publicity rights).
          </li>
          <li>
            Remove, obscure, or alter proprietary notices, labels, or attributions on content.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">7.3 Real Name Policy for Commenting (Robust)</h3>
        <p className="mb-4">
          To promote accountability and reduce abuse, <strong>
            we may require that comments and certain community features be used under a real name or
            a name that reasonably identifies you
          </strong>, as determined by us in our sole discretion.{" "}
          <strong>
            Unique, fictitious, misleading, or impersonating names may be disallowed
          </strong>, except where we explicitly permit pseudonyms (for example, in designated areas
          or where safety considerations justify it). We may require additional verification,
          suspend, or remove accounts that do not comply with this policy.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">7.4 Moderation, Enforcement, and Disclosure</h3>
        <p className="mb-4">
          We may (but are not obligated to) monitor, review, moderate, or remove content and restrict
          access to the Services at any time, for any reason, including for violations of these
          Terms or the Community Guidelines. We may also suspend or terminate accounts, remove
          content, and take other appropriate action.
        </p>
        <p className="mb-4">
          To the extent permitted by law, we may <strong>preserve and disclose information</strong>{" "}
          (including account information, UGC, IP addresses, and related records) if we believe in
          good faith that such preservation or disclosure is reasonably necessary to: (a) comply with
          legal process or government requests; (b) enforce these Terms; (c) respond to claims that
          content violates the rights of third parties; or (d) protect the rights, property, or
          safety of <strong>{config.company.brandName}</strong>, our users, or the public.
        </p>
      </section>

      {/* Section 8: DMCA */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          8. DMCA Compliance (Notice and Takedown)
        </h2>
        <p className="mb-4">
          <strong>{config.company.brandName}</strong> respects the intellectual property rights of
          others and expects users of the Services to do the same. It is our policy, in appropriate
          circumstances and at our discretion, to remove or disable access to material that we
          believe infringes the copyrights of others and to terminate the accounts of users who are
          repeat infringers.
        </p>
        <p className="mb-4">
          This Section is intended to comply with the notice-and-takedown provisions of the{" "}
          <strong>Digital Millennium Copyright Act ("DMCA"), 17 U.S.C. § 512</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">8.1 Designated DMCA Agent</h3>
        <p className="mb-4">If you believe that content on the Services infringes your copyright, please send a written notice to our Designated Agent at:</p>
        <div className="mb-4 pl-4 border-l-4 border-gray-300">
          <p>
            <strong>Designated Agent:</strong>{" "}
            {config.dmca.agentName || "[Full Name / Title]"}
            {config.dmca.agentTitle && ` / ${config.dmca.agentTitle}`}
          </p>
          <p>
            <strong>{config.company.legalName}</strong>
          </p>
          <p>
            <strong>Address:</strong> {getCompanyAddress() || "[Street Address]"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${contact.dmcaEmail}`} className="text-blue-600 hover:underline">
              {contact.dmcaEmail}
            </a>
          </p>
          {config.dmca.phone && (
            <p>
              <strong>Phone (optional):</strong> {config.dmca.phone}
            </p>
          )}
        </div>
        <p className="mb-4 text-sm text-gray-600 italic">
          Note: Only DMCA notices should be sent to the Designated Agent. Other inquiries may not
          receive a response.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">8.2 DMCA Takedown Notice Requirements</h3>
        <p className="mb-4">
          To be effective, your DMCA notice must be <strong>in writing</strong> and must include the
          following information (as required by <strong>17 U.S.C. § 512(c)(3)</strong>):
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>
            <strong>Your physical or electronic signature</strong> (or the signature of a person
            authorized to act on behalf of the copyright owner).
          </li>
          <li>
            <strong>Identification of the copyrighted work</strong> claimed to have been infringed
            (or, if multiple works are covered by a single notice, a representative list).
          </li>
          <li>
            <strong>Identification of the allegedly infringing material</strong> and information
            reasonably sufficient to permit us to locate it on the Services (for example, the exact
            URL(s) and a description of where the material appears).
          </li>
          <li>
            <strong>Your contact information</strong>, including your name, mailing address,
            telephone number, and email address.
          </li>
          <li>
            A statement that you have a <strong>good-faith belief</strong> that the use of the
            material in the manner complained of is <strong>not authorized</strong> by the
            copyright owner, its agent, or the law.
          </li>
          <li>
            A statement that the information in the notice is <strong>accurate</strong>, and{" "}
            <strong>under penalty of perjury</strong>, that you are the copyright owner or are
            authorized to act on behalf of the copyright owner.
          </li>
        </ol>
        <p className="mb-4">
          Upon receipt of a notice that substantially complies with the DMCA, we may remove or
          disable access to the material and may notify the user who posted it.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">8.3 DMCA Counter-Notification</h3>
        <p className="mb-4">
          If you believe that material you posted was removed or disabled by mistake or
          misidentification, you may submit a <strong>counter-notification</strong> to our
          Designated Agent. Your counter-notice must be <strong>in writing</strong> and include:
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>
            <strong>Your physical or electronic signature.</strong>
          </li>
          <li>
            Identification of the material that has been removed or disabled and the location where
            it appeared before it was removed or disabled (e.g., URL).
          </li>
          <li>
            A statement <strong>under penalty of perjury</strong> that you have a good-faith belief
            that the material was removed or disabled as a result of mistake or misidentification.
          </li>
          <li>
            <strong>Your name, address, and telephone number</strong>, and a statement that you{" "}
            <strong>consent to the jurisdiction</strong> of the Federal District Court for the
            judicial district in which your address is located (or, if outside the United States,
            for any judicial district in which we may be found), and that you will accept service of
            process from the person who submitted the original DMCA notice or that person's agent.
          </li>
        </ol>
        <p className="mb-4">
          If we receive a valid counter-notification, we may forward it to the original complaining
          party and, as permitted by the DMCA, may restore the material unless the complaining party
          files a court action seeking an order to restrain the allegedly infringing activity.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">8.4 Repeat Infringer Policy</h3>
        <p className="mb-4">
          In accordance with the DMCA and other applicable law,{" "}
          <strong>
            we maintain a policy to terminate, in appropriate circumstances, the accounts of users
            who are deemed to be repeat infringers.
          </strong>{" "}
          We may also, in our discretion, limit access to the Services, remove content, or take
          other appropriate action against users who repeatedly submit or post content that is
          alleged to infringe copyrights.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">8.5 Warning Against Misrepresentations (DMCA § 512(f))</h3>
        <p className="mb-4">
          <strong>Any person who knowingly materially misrepresents</strong> that material or
          activity is infringing (or that material was removed or disabled by mistake or
          misidentification) may be subject to liability under <strong>17 U.S.C. § 512(f)</strong>,
          including damages, costs, and attorneys' fees. We reserve the right to seek remedies
          against abusive or bad-faith DMCA notices and counter-notices.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">8.6 Other Claims</h3>
        <p className="mb-4">
          If your complaint involves something other than copyright (for example, trademark,
          defamation, privacy, or harassment), please contact us at{" "}
          <a href={`mailto:${contact.legalEmail}`} className="text-blue-600 hover:underline">
            {contact.legalEmail}
          </a>{" "}
          so we can route your request appropriately.
        </p>
      </section>

      {/* Section 9: Liability Disclaimers */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          9. Liability Disclaimers and "As Is" / "As Available" Mandate
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">9.1 Services Provided "As Is" and "As Available"</h3>
        <p className="mb-4 font-semibold uppercase">
          THE SERVICES (INCLUDING ALL SITE ELEMENTS, THIRD-PARTY CONTENT, USER-GENERATED CONTENT,
          FEATURES, AND ANY LINKS OR INTEGRATIONS) ARE PROVIDED ON AN <strong>"AS IS"</strong> AND{" "}
          <strong>"AS AVAILABLE"</strong> BASIS. YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK.
        </p>
        <p className="mb-4 font-semibold uppercase">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, <strong>{config.company.legalName}</strong>,{" "}
          <strong>{config.company.brandName}</strong>, AND OUR AFFILIATES, LICENSORS, AND SERVICE
          PROVIDERS <strong>DISCLAIM ALL WARRANTIES AND CONDITIONS OF ANY KIND</strong>, WHETHER
          EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, WITHOUT LIMITATION,{" "}
          <strong>
            ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
            NON-INFRINGEMENT
          </strong>, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING, COURSE OF PERFORMANCE, OR
          USAGE OF TRADE.
        </p>
        <p className="mb-4 font-semibold uppercase">WITHOUT LIMITING THE FOREGOING, WE DO NOT WARRANT OR GUARANTEE THAT:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 uppercase">
          <li>
            the Services will be <strong>uninterrupted, timely, secure, or error-free</strong>;
          </li>
          <li>defects will be corrected;</li>
          <li>
            the Services or servers are <strong>free of viruses, malware, or other harmful components</strong>;
          </li>
          <li>
            any content (including news, headlines, breaking updates, analysis, or third-party
            content) will be <strong>accurate, complete, reliable, current, or available</strong>; or
          </li>
          <li>
            the Services will meet your requirements or expectations or achieve any particular
            results.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">9.3 Editorial and Information Disclaimer</h3>
        <p className="mb-4">
          News and information can change rapidly. Content on the Services may include errors,
          omissions, or outdated information. The Services may include commentary, analysis, and
          opinion pieces that reflect the views of their authors, not necessarily{" "}
          <strong>{config.company.brandName}</strong>. Nothing on the Services constitutes
          professional advice (including legal, medical, financial, or investment advice). You
          should consult a qualified professional before acting on information obtained through the
          Services.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">9.4 Third-Party Sites and Services</h3>
        <p className="mb-4">
          We do not endorse and are not responsible for the availability, content, products, or
          services of third-party websites, platforms, advertisers, or services linked to or
          integrated with the Services. Any interactions you have with third parties are solely
          between you and the third party.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">9.5 Jurisdictional Limitations</h3>
        <p className="mb-4">
          Some jurisdictions do not allow the exclusion of certain warranties, so some of the above
          disclaimers may not apply to you. In such cases, our warranties are limited to the maximum
          extent permitted by applicable law.
        </p>
      </section>

      {/* Section 10: Limitation of Damages */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">10. Limitation of Damages</h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">10.1 Exclusion of Certain Damages</h3>
        <p className="mb-4 font-semibold uppercase">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, <strong>{config.company.legalName}</strong>,{" "}
          <strong>{config.company.brandName}</strong>, AND OUR AFFILIATES, LICENSORS, AND SERVICE
          PROVIDERS, AND EACH OF THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS,
          AGENTS, AND REPRESENTATIVES (COLLECTIVELY, THE "<strong>{config.company.brandName.toUpperCase()} PARTIES</strong>"){" "}
          <strong>WILL NOT BE LIABLE</strong> TO YOU OR ANY THIRD PARTY FOR{" "}
          <strong>
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES
          </strong>, OR FOR ANY{" "}
          <strong>
            LOSS OF PROFITS, REVENUE, GOODWILL, BUSINESS INTERRUPTION, LOSS OF DATA, OR OTHER
            INTANGIBLE LOSSES
          </strong>, ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS, <strong>EVEN IF</strong>{" "}
          ANY <strong>{config.company.brandName.toUpperCase()} PARTY</strong> HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">10.2 Monetary Cap on Liability</h3>
        <p className="mb-4 font-semibold uppercase">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE <strong>AGGREGATE LIABILITY</strong>{" "}
          OF THE <strong>{config.company.brandName.toUpperCase()} PARTIES</strong> TO YOU FOR{" "}
          <strong>ANY AND ALL CLAIMS</strong> ARISING OUT OF OR RELATING TO THE SERVICES OR THESE
          TERMS (REGARDLESS OF THE FORM OF ACTION, WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR
          OTHERWISE) <strong>WILL NOT EXCEED</strong> THE <strong>LESSER OF</strong>:
        </p>
        <p className="mb-4 uppercase">
          (a) THE AMOUNT (IF ANY) PAID BY YOU TO <strong>{config.company.brandName.toUpperCase()}</strong> FOR THE SERVICES IN THE{" "}
          <strong>SIX (6) MONTHS</strong> IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM; OR
        </p>
        <p className="mb-4 uppercase">
          (b) <strong>ONE HUNDRED U.S. DOLLARS (US $100).</strong>
        </p>
        <p className="mb-4 uppercase">
          IF YOU HAVE NOT PAID <strong>{config.company.brandName.toUpperCase()}</strong> ANY AMOUNTS IN THAT SIX-MONTH PERIOD, YOUR RECOVERY IS LIMITED TO{" "}
          <strong>US $100</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">10.3 Basis of the Bargain</h3>
        <p className="mb-4 font-semibold uppercase">
          YOU ACKNOWLEDGE THAT THE DISCLAIMERS OF WARRANTIES AND THE LIMITATIONS OF LIABILITY SET
          FORTH IN THESE TERMS ARE <strong>ESSENTIAL ELEMENTS OF THE BASIS OF THE BARGAIN</strong>{" "}
          BETWEEN YOU AND <strong>{config.company.brandName.toUpperCase()}</strong>, AND THAT{" "}
          <strong>{config.company.brandName.toUpperCase()}</strong> WOULD NOT BE ABLE TO PROVIDE THE SERVICES WITHOUT THESE LIMITATIONS.
        </p>
        <p className="mb-4 uppercase">
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES OR
          LIABILITY. TO THE EXTENT SUCH LIMITATIONS ARE NOT PERMITTED,{" "}
          <strong>THE LIABILITY OF THE {config.company.brandName.toUpperCase()} PARTIES WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW</strong>.
        </p>
      </section>

      {/* Section 11: Dispute Resolution */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          11. Dispute Resolution: Arbitration and Class Action Waivers
        </h2>
        <p className="mb-4 font-semibold">
          <strong>PLEASE READ THIS SECTION CAREFULLY.</strong> It affects your legal rights. It
          requires most disputes to be resolved through <strong>binding, individual arbitration</strong>{" "}
          and includes a <strong>stand-alone class action waiver</strong> and a{" "}
          <strong>mass filing (bellwether) protocol</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.1 Definitions</h3>
        <p className="mb-4">For purposes of this Section 11:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            "<strong>Dispute</strong>" means any dispute, claim, or controversy between you and{" "}
            <strong>{config.company.legalName}</strong> / <strong>{config.company.brandName}</strong>{" "}
            (and our affiliates, officers, directors, employees, agents, licensors, and service
            providers) arising out of or relating to the Services or these Terms, including their
            formation, interpretation, breach, termination, enforcement, or validity, and including
            claims based in contract, tort, statute, fraud, misrepresentation, or any other legal
            theory.
          </li>
          <li>
            "<strong>Arbitration Provider</strong>" means <strong>{config.legal.arbitrationProvider}</strong>{" "}
            and its applicable rules, as modified by these Terms.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.2 Informal Dispute Resolution (Required First)</h3>
        <p className="mb-4">
          Before initiating arbitration or a court proceeding, you and <strong>{config.company.brandName}</strong>{" "}
          agree to try to resolve any Dispute informally.
        </p>
        <p className="mb-4">
          <strong>Notice of Dispute.</strong> The party initiating a Dispute must send a written
          notice ("<strong>Notice</strong>") that includes: (a) the party's name and contact
          information; (b) a description of the Dispute and the legal basis for it; (c) the relief
          sought; and (d) sufficient information to identify any relevant account or use of the
          Services.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            Notices to <strong>{config.company.brandName}</strong> must be sent to:{" "}
            <strong>{getCompanyAddress()}</strong>, Attn: Legal Department, and also email a copy
            to{" "}
            <a href={`mailto:${contact.legalEmail}`} className="text-blue-600 hover:underline">
              {contact.legalEmail}
            </a>
            .
          </li>
          <li>
            We will send Notices to you using the contact information associated with your account
            or any other reasonable means.
          </li>
        </ul>
        <p className="mb-4">
          <strong>Informal resolution period.</strong> You and we will engage in good-faith efforts
          to resolve the Dispute for <strong>60 days</strong> after receipt of a Notice (unless we
          mutually agree to extend). Either party may request an individual settlement conference by
          phone or video during this period.
        </p>
        <p className="mb-4">
          <strong>Tolling.</strong> Any applicable statute of limitations will be <strong>tolled</strong>{" "}
          during the informal dispute resolution period.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.3 Agreement to Arbitrate (Binding Individual Arbitration)</h3>
        <p className="mb-4">
          If the Dispute is not resolved within the informal dispute resolution period, you and{" "}
          <strong>{config.company.brandName}</strong> agree that, to the fullest extent permitted by
          law, the Dispute will be resolved by <strong>binding, confidential, individual arbitration</strong>{" "}
          and <strong>not in court</strong>, except as expressly provided below.
        </p>
        <p className="mb-4 font-semibold uppercase">
          <strong>YOU AND {config.company.brandName.toUpperCase()} ARE EACH WAIVING THE RIGHT TO SUE IN COURT AND THE RIGHT TO A TRIAL BY JURY.</strong>
        </p>
        <p className="mb-4">
          This arbitration agreement is governed by the <strong>Federal Arbitration Act</strong> (to
          the extent applicable).
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.4 Exceptions</h3>
        <p className="mb-4">The following exceptions apply to the arbitration requirement:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            bring an individual claim in <strong>small claims court</strong> if it qualifies and
            remains an individual case; and/or
          </li>
          <li>
            seek <strong>injunctive or equitable relief</strong> in court to prevent actual or
            threatened infringement, misappropriation, or violation of intellectual property rights
            or to protect the security or integrity of the Services (to the extent allowed by law).
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.5 Arbitration Procedure, Rules, and Location</h3>
        <p className="mb-4">
          <strong>Provider and Rules.</strong> The arbitration will be administered by{" "}
          <strong>{config.legal.arbitrationProvider}</strong> under its applicable rules then in
          effect (the "<strong>Rules</strong>"), except as modified by these Terms. If the Rules
          conflict with these Terms, these Terms will control.
        </p>
        <p className="mb-4">
          <strong>Filing.</strong> To start arbitration, a party must submit a demand in accordance
          with the Rules and serve a copy on the other party.
        </p>
        <p className="mb-4">
          <strong>Hearing format.</strong> The arbitrator may decide the Dispute based on written
          submissions, a telephonic/video hearing, or an in-person hearing, unless the Rules require
          otherwise.
        </p>
        <p className="mb-4">
          <strong>Location.</strong> Unless you and we agree otherwise, any in-person hearing will
          take place in <strong>{config.legal.jurisdiction}</strong> or, if you prefer, in the U.S.
          county (or equivalent) where you reside, subject to the arbitrator's discretion and the
          Rules.
        </p>
        <p className="mb-4">
          <strong>Authority.</strong> The arbitrator will have exclusive authority to resolve any
          dispute about the interpretation, applicability, enforceability, or formation of this
          arbitration agreement, except that a court of competent jurisdiction will decide the
          enforceability of the class action waiver in Section 11.7 (and any portion expressly
          reserved to courts).
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.6 Costs and Fees</h3>
        <p className="mb-4">
          Payment of arbitration fees will be governed by the Rules and applicable law. If you can
          demonstrate that arbitration costs would be prohibitive compared to court, we will consider
          reasonable requests for fee adjustments to facilitate arbitration, to the extent permitted
          by the Rules and applicable law. Each party will bear its own attorneys' fees and costs
          unless the arbitrator awards otherwise under applicable law.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.7 Stand-Alone Class Action Waiver</h3>
        <p className="mb-4">To the fullest extent permitted by law:</p>
        <p className="mb-4 font-semibold uppercase">
          <strong>
            YOU AND {config.company.brandName.toUpperCase()} AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL
            CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE,
            PRIVATE ATTORNEY GENERAL, OR REPRESENTATIVE PROCEEDING.
          </strong>
        </p>
        <p className="mb-4">
          The arbitrator <strong>may not</strong> consolidate more than one person's claims and{" "}
          <strong>may not</strong> award relief on a class-wide, collective, or representative basis.
        </p>
        <p className="mb-4">
          If a court determines that this class action waiver is unenforceable for a particular
          claim or request for relief, then that claim or request for relief (and only that claim or
          request) will proceed in court, subject to the remainder of these Terms.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.8 Mass Filing Protocol (Bellwether "Initial Arbitrations")</h3>
        <p className="mb-4">
          To reduce burdens and promote efficient resolution, additional procedures apply to "Mass
          Filings."
        </p>
        <p className="mb-4">
          <strong>Mass Filing Definition.</strong> A "<strong>Mass Filing</strong>" occurs when{" "}
          <strong>25 or more</strong> similar arbitration demands are submitted against{" "}
          <strong>{config.company.brandName}</strong> (or by <strong>{config.company.brandName}</strong>){" "}
          and: (a) the demands raise substantially similar issues of law or fact; and (b) the
          claimants are represented by the same counsel or coordinated counsel; and (c) the demands
          are submitted within a <strong>90-day</strong> period (or otherwise close in proximity).
        </p>
        <p className="mb-4">
          <strong>Initial Arbitrations (Bellwethers).</strong> If a Mass Filing occurs, the parties
          agree that:
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>
            Only a limited number of cases will proceed first as "<strong>Initial Arbitrations</strong>."
          </li>
          <li>
            The Initial Arbitrations will consist of <strong>10 cases total</strong> (unless the
            parties agree otherwise): <strong>5 selected by claimants' counsel and 5 selected by {config.company.brandName}</strong>{" "}
            from the pool of filed demands.
          </li>
          <li>
            The remaining demands will be <strong>administratively stayed</strong> (not
            filed/processed, or paused if already filed) and no arbitration fees for the stayed
            demands will be due until the Initial Arbitrations and the process below are completed.
          </li>
        </ol>
        <p className="mb-4">
          <strong>Bellwether Process and Global Mediation.</strong>
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>The Initial Arbitrations will proceed to merits decisions (or earlier resolution).</li>
          <li>
            After the Initial Arbitrations conclude, the parties will participate in{" "}
            <strong>good-faith global mediation</strong> for at least <strong>30 days</strong>{" "}
            (unless resolved sooner).
          </li>
          <li>
            If the Disputes are not resolved in mediation, the parties will then confer on a fair
            process for resolving the remaining demands, which may include proceeding in staged
            batches, additional bellwethers, or other efficient mechanisms consistent with the Rules
            and these Terms.
          </li>
        </ol>
        <p className="mb-4">
          <strong>If Not Enforceable.</strong> If a court determines that this Mass Filing protocol
          is unenforceable as to a particular claimant's Dispute, then that Dispute must proceed{" "}
          <strong>individually</strong> in court (not as part of a class, collective, or
          representative action), consistent with the class action waiver and other terms in this
          Section 11, to the extent permitted by law.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.9 Time Limit to Bring Claims</h3>
        <p className="mb-4">
          To the fullest extent permitted by law, any Dispute must be filed within{" "}
          <strong>one (1) year</strong> after the claim arose, unless a longer period is required by
          applicable law. (This limitation period is tolled during the informal dispute resolution
          period described in Section 11.2.)
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">11.10 Severability and Survival</h3>
        <p className="mb-4">
          If any portion of this Section 11 is found to be unenforceable, the remainder will remain
          in effect to the fullest extent permitted by law. This Section 11 survives termination of
          your account and/or your use of the Services.
        </p>
      </section>

      {/* Section 12: Amendments and Termination */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          12. Amendments and Termination Rights
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">12.1 Amendments to These Terms</h3>
        <p className="mb-4">
          We may update, modify, or replace these Terms <strong>at any time</strong>, in our{" "}
          <strong>sole discretion</strong>, for any reason, including to reflect changes to the
          Services, features, business practices, technology, or applicable law.
        </p>
        <p className="mb-4">
          We will post the most current version of the Terms on the Services and update the
          "Effective Date" (or similar label). <strong>Changes are effective when posted</strong>{" "}
          unless we specify a later effective date or applicable law requires otherwise.
        </p>
        <p className="mb-4">
          <strong>
            Your continued access to or use of the Services after updated Terms are posted
            constitutes your acceptance of the revised Terms.
          </strong>{" "}
          If you do not agree to the revised Terms, you must stop using the Services.
        </p>
        <p className="mb-4">
          If we make a material change, we may (but are not required to) provide additional notice
          (for example, via email to the address associated with your account, an in-product notice,
          or a banner). It is your responsibility to keep your account contact information current
          and to review the Terms periodically.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">12.2 Changes to the Services</h3>
        <p className="mb-4">
          We reserve the right, at any time and in our sole discretion, to{" "}
          <strong>
            modify, suspend, discontinue, restrict, or terminate
          </strong>{" "}
          all or any part of the Services (including any feature, content, subscription offering,
          community tools, or availability of archives), temporarily or permanently,{" "}
          <strong>with or without notice</strong>. We will not be liable to you or any third party
          for any modification, suspension, or discontinuation of the Services, to the fullest
          extent permitted by law.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">12.3 Termination and Suspension by Us</h3>
        <p className="mb-4">
          We may, in our sole discretion, <strong>suspend, restrict, or terminate</strong> your
          access to the Services and/or your account (if any), and may remove or disable access to
          any UGC or other information associated with you, <strong>at any time, for any reason or no reason, with or without notice</strong>.
          This includes, without limitation, if we believe that you have violated these Terms, the
          Community Guidelines, applicable law, or if your conduct creates risk or potential legal
          exposure for us, other users, or third parties.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">12.4 Termination by You</h3>
        <p className="mb-4">
          You may stop using the Services at any time. If you have an account, you may request
          account deletion or closure through the methods provided on the Services (if available).
          Please note that certain information may be retained as described in our Privacy Policy
          and as required or permitted by law.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">12.5 Effect of Termination</h3>
        <p className="mb-4">
          Upon any termination or suspension, <strong>the license and all rights granted to you</strong>{" "}
          under these Terms will immediately cease. Sections that by their nature should survive
          termination (including, without limitation, intellectual property provisions, UGC
          licenses, disclaimers, limitations of liability, dispute resolution, and any other
          provisions intended to survive) <strong>will survive</strong> termination to the fullest
          extent permitted by law.
        </p>
      </section>

      {/* Section 13: Miscellaneous */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-4 font-sans">
          13. Miscellaneous / General Legal Terms
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.1 Governing Law and Venue (Non-Arbitration Matters)</h3>
        <p className="mb-4">
          These Terms are governed by the laws of the <strong>{config.legal.governingLaw}</strong>,
          without regard to conflict of law principles. To the extent any dispute is permitted to
          proceed in court (rather than arbitration), you and <strong>{config.company.brandName}</strong>{" "}
          consent to the exclusive jurisdiction and venue of the state and federal courts located in{" "}
          <strong>{config.legal.jurisdiction}</strong>, and waive any objection to such venue.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.2 Severability</h3>
        <p className="mb-4">
          If any provision of these Terms is held unlawful, void, or unenforceable, that provision
          will be deemed severed and limited or eliminated to the minimum extent necessary, and the
          remaining provisions will remain in full force and effect.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.3 Entire Agreement</h3>
        <p className="mb-4">
          These Terms (together with any policies or additional terms expressly incorporated by
          reference, including our Privacy Policy and Community Guidelines) constitute the{" "}
          <strong>entire agreement</strong> between you and <strong>{config.company.brandName}</strong>{" "}
          regarding your use of the Services and supersede all prior or contemporaneous agreements,
          communications, or understandings.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.4 No Waiver</h3>
        <p className="mb-4">
          Our failure to enforce any right or provision of these Terms will not operate as a waiver
          of such right or provision. Any waiver must be in writing and signed by an authorized
          representative of <strong>{config.company.brandName}</strong>.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.5 Assignment</h3>
        <p className="mb-4">
          You may not assign, transfer, or sublicense any of your rights or obligations under these
          Terms without our prior written consent. We may assign or transfer these Terms (in whole
          or in part) without restriction, including to an affiliate or in connection with a merger,
          acquisition, reorganization, or sale of assets.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.6 Relationship of the Parties</h3>
        <p className="mb-4">
          Nothing in these Terms creates any partnership, joint venture, employment, fiduciary, or
          agency relationship between you and <strong>{config.company.brandName}</strong>. You have
          no authority to bind us in any way.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.7 Headings</h3>
        <p className="mb-4">
          Headings are for convenience only and do not affect the interpretation of these Terms.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.8 Notices and Contact Information</h3>
        <p className="mb-4">
          Questions about these Terms may be sent to:{" "}
          <a href={`mailto:${contact.legalEmail}`} className="text-blue-600 hover:underline">
            {contact.legalEmail}
          </a>
          .
        </p>
        <p className="mb-4">
          If you need to send a legal notice to <strong>{config.company.brandName}</strong>, you
          must send it to: <strong>{getCompanyAddress()}</strong>, Attn: Legal Department, and also
          email a copy to{" "}
          <a href={`mailto:${contact.legalEmail}`} className="text-blue-600 hover:underline">
            {contact.legalEmail}
          </a>
          . We may provide notices to you via the Services, email, or other reasonable means.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 font-sans">13.9 Current Version</h3>
        <p className="mb-4">
          The most current version of these Terms will be posted on the Services. If a hyperlink is
          not functional in a particular view, please visit{" "}
          <Link href={config.links.termsOfServiceUrl} className="text-blue-600 hover:underline">
            {config.links.termsOfServiceUrl}
          </Link>{" "}
          directly.
        </p>
      </section>
    </div>
  );
}
