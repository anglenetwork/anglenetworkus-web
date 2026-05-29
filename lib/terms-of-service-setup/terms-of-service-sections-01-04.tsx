/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "./terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsOfServiceSections01To04() {
  return (
    <>
      {/* Section 1: Acceptance of Terms */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          1. Acceptance of Terms and Eligibility
        </h2>
        <p className="mb-4">
          These Terms of Service ("Terms") are a legally binding agreement
          between you and <strong>{config.company.legalName}</strong> ("
          <strong>{config.company.brandName}</strong>," "we," "us," or "our").{" "}
          <strong>
            By accessing, browsing, or using any part of the Services, you
            unconditionally agree to be bound by these Terms, just as if you had
            signed them.
          </strong>{" "}
          If you do not agree to these Terms, you may not access or use the
          Services.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          1.1 The "Services"
        </h3>
        <p className="mb-4">
          For purposes of these Terms, the "<strong>Services</strong>" include{" "}
          <strong>{config.company.websiteDomain}</strong>, any related websites,
          mobile applications, newsletters, email or SMS features, RSS feeds,
          embeddable players/widgets, accounts and subscription features,
          comment/community features, and any other products, tools, or services
          we provide now or in the future that link to or reference these Terms.
          The Services also include{" "}
          <strong>{config.company.brandName}-managed spaces</strong> on
          third-party platforms (for example, pages, profiles, channels, or
          communities on social networks or app platforms), to the extent we
          control those spaces and make them available to users.
        </p>
        <p className="mb-4">
          Certain parts of the Services may be subject to additional terms,
          rules, or guidelines (for example, subscription terms, community
          rules, promotions, or platform-specific terms). Those additional terms
          are incorporated into these Terms by reference, and if there is a
          conflict, the additional terms will control for that specific feature
          or offering.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          1.2 Updates to These Terms
        </h3>
        <p className="mb-4">
          We may change these Terms from time to time. We will post the updated
          Terms with a new "Effective Date" at the top (and may provide
          additional notice for material changes).{" "}
          <strong>
            Your continued access to or use of the Services after changes become
            effective means you accept the updated Terms.
          </strong>{" "}
          If you do not agree to the updated Terms, you must stop using the
          Services.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          1.3 Eligibility; Age Requirements
        </h3>
        <p className="mb-4">
          You may use the Services only if you can legally enter into a binding
          contract with us and are not prohibited from using the Services under
          applicable law.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Minimum age:</strong> The Services are{" "}
            <strong>not intended for children under 13</strong>, and children
            under 13 may not use the Services.
          </li>
          <li>
            <strong>Minors (13–17):</strong> If you are{" "}
            <strong>
              13 to 17 years old (or otherwise under the age of majority where
              you live)
            </strong>
            , you may use the Services{" "}
            <strong>
              only with the involvement and consent of a parent or legal
              guardian
            </strong>
            . Your parent or legal guardian is responsible for your use of the
            Services and for ensuring your compliance with these Terms.
          </li>
          <li>
            <strong>Accounts, purchases, and subscriptions:</strong> To create
            an account, submit content (including comments), or purchase a
            subscription or other paid product, you must be{" "}
            <strong>18 or older (or the age of majority where you live)</strong>
            , <strong>or</strong> your parent/legal guardian must do so on your
            behalf and agree to these Terms.
          </li>
        </ul>
        <p className="mb-4">
          If a parent or legal guardian permits a minor to use the Services, the
          parent/legal guardian represents and warrants that they have the
          authority to do so and{" "}
          <strong>agree to these Terms on behalf of the minor</strong>, and they
          accept responsibility for the minor's activity on the Services.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          1.4 Location and Availability
        </h3>
        <p className="mb-4">
          The Services are controlled and operated from{" "}
          <strong>{config.legal.country}</strong>. We make no representation
          that the Services are appropriate or available in every location.{" "}
          <strong>
            You access the Services at your own initiative and are responsible
            for compliance with local laws.
          </strong>{" "}
          We may limit, suspend, or refuse access to the Services in any
          jurisdiction at any time.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          1.5 Third-Party Platforms and App Stores
        </h3>
        <p className="mb-4">
          If you access the Services through a third-party platform (such as an
          app store or social media service), you may also be subject to that
          platform's terms and policies. Where those terms impose additional
          requirements, you agree to comply with them.{" "}
          <strong>
            As between you and us, these Terms govern your use of the Services
            unless we expressly state otherwise for a specific offering.
          </strong>
        </p>
      </section>

      {/* Section 2: Intellectual Property */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          2. Intellectual Property and "Site Elements"
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.1 Ownership
        </h3>
        <p className="mb-4">
          The Services and all materials and content made available through the
          Services are owned or licensed by{" "}
          <strong>{config.company.legalName}</strong> and/or our licensors and
          content providers, and are protected by applicable intellectual
          property laws, including copyright, trademark, trade dress, and other
          laws in the{" "}
          <strong>{config.legal.country} and internationally</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.2 Definition of "Site Elements"
        </h3>
        <p className="mb-4">
          For purposes of these Terms, "<strong>Site Elements</strong>" means{" "}
          <strong>all</strong> content, materials, and features displayed,
          performed, published, provided, or otherwise made available through
          the Services, including, without limitation:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Editorial and informational content:</strong> articles,
            headlines, summaries, text, interviews, captions, metadata, tags,
            categories, directories, compilations, and databases;
          </li>
          <li>
            <strong>Visual assets:</strong> photographs, illustrations,
            graphics, charts, infographics, images, icons, animations, and
            design elements;
          </li>
          <li>
            <strong>Audio/visual content:</strong> videos, livestreams, audio
            clips, podcasts, music, and other audio-visual files;
          </li>
          <li>
            <strong>Brand and identity materials:</strong> names, trademarks,
            service marks, logos, trade names, domain names, and other brand
            features;
          </li>
          <li>
            <strong>Software and technology:</strong> the Services' software,
            applications, tools, widgets, APIs (if any), source and object code,
            scripts, and any other underlying technology;
          </li>
          <li>
            <strong>Interface and code:</strong> user interface elements,
            layout, page templates, navigation, and the underlying or associated
            code and structures, including{" "}
            <strong>
              HTML, CSS, JavaScript, XML, JSON, and other markup or data formats
            </strong>
            ;
          </li>
          <li>
            <strong>Downloads and digital files:</strong> newsletters, PDFs,
            digital downloads, and other files or materials; and
          </li>
          <li>
            <strong>Other features and materials:</strong> interactive features,
            comment/community features (excluding User Content as defined
            elsewhere), and any products or services offered through the
            Services.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.3 "Look and Feel" and Compilation
        </h3>
        <p className="mb-4">
          The Services'{" "}
          <strong>overall appearance, design, and presentation</strong>,
          including the <strong>"look and feel,"</strong> selection,
          coordination, arrangement, and organization of Site Elements
          (including the ordering and display of stories, modules, and
          navigational structure), constitute{" "}
          <strong>original works of authorship</strong> and are protected by
          intellectual property and trade dress laws. You may not copy, imitate,
          or replicate any portion of the Services' look and feel or compilation
          without our prior written permission.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.4 No Transfer of Rights
        </h3>
        <p className="mb-4">
          Except as expressly stated in these Terms,{" "}
          <strong>no right, title, or interest</strong> in or to the Services or
          any Site Elements is transferred to you. Any access to or use of the
          Services does not grant you ownership of any intellectual property
          rights in Site Elements. All rights not expressly granted are reserved
          by <strong>{config.company.brandName}</strong> and our licensors.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.5 Limited License to Use the Services
        </h3>
        <p className="mb-4">
          Subject to your compliance with these Terms, we grant you a{" "}
          <strong>
            limited, revocable, non-exclusive, non-transferable, and
            non-sublicensable
          </strong>{" "}
          license to access and use the Services and Site Elements{" "}
          <strong>for your personal, non-commercial use</strong> only. This
          license does not permit you to (and you may not) reproduce,
          distribute, publicly display, publicly perform, publish, transmit,
          create derivative works from, sell, license, exploit, or otherwise use
          any Site Elements except as expressly allowed by these Terms or with
          our prior written consent.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.6 Third-Party Rights
        </h3>
        <p className="mb-4">
          Some Site Elements may be owned by or licensed from third parties. All
          third-party trademarks, logos, and content remain the property of
          their respective owners, and your use of those materials may be
          subject to additional restrictions imposed by the applicable owners or
          licensors.
        </p>
      </section>

      {/* Section 3: Limited License for Personal Use */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          3. Limited License for Personal Use
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          3.1 Limited License (Personal, Non-Commercial)
        </h3>
        <p className="mb-4">
          Subject to your ongoing compliance with these Terms,{" "}
          <strong>{config.company.brandName}</strong> grants you a{" "}
          <strong>
            limited, revocable, non-exclusive, non-transferable, and
            non-sublicensable
          </strong>{" "}
          license to access and use the Services and Site Elements{" "}
          <strong>solely for your personal, non-commercial use</strong>. This
          includes viewing content through normal browser/app functionality and,
          where a feature is provided by us, making{" "}
          <strong>a single copy</strong> (e.g., downloading or printing){" "}
          <strong>
            for your personal, non-commercial, and educational use
          </strong>
          .
        </p>
        <p className="mb-4">
          <strong>
            Access to the Services and Site Elements is licensed, not sold.
          </strong>{" "}
          You do not obtain any ownership interest or intellectual property
          rights in any Site Elements by accessing or using the Services.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          3.2 Prohibited Uses (No Archiving, Redistribution, or Derivatives)
        </h3>
        <p className="mb-4">
          Except as expressly permitted by these Terms or with our{" "}
          <strong>prior written consent</strong>, you may not, and may not allow
          any third party to:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>
              Copy, reproduce, republish, upload, post, transmit, broadcast, or
              distribute
            </strong>{" "}
            any Site Elements (in whole or in part) in any form or by any means;
          </li>
          <li>
            <strong>Archive, store, cache, or build a library</strong> of Site
            Elements (including by systematic downloading, saving, or indexing),
            other than temporary caching incident to ordinary web browsing;
          </li>
          <li>
            <strong>
              Scrape, crawl, spider, harvest, or use automated means
            </strong>{" "}
            to access, extract, or collect Site Elements or data from the
            Services (including for training, summarization, aggregation, or
            republishing);
          </li>
          <li>
            <strong>Create derivative works</strong> from Site Elements,
            including edits, translations, adaptations, summaries, annotations,
            remixes, or compilations intended for publication, distribution, or
            commercial use;
          </li>
          <li>
            <strong>Redistribute, syndicate, frame, mirror, or display</strong>{" "}
            Site Elements on another website, app, platform, service, or network
            (including "news aggregator" sites or feeds), or otherwise republish
            our reporting to drive traffic elsewhere;
          </li>
          <li>
            <strong>
              Sell, rent, lease, license, sublicense, or commercially exploit
            </strong>{" "}
            any Site Elements or access to the Services; or
          </li>
          <li>
            <strong>Remove, alter, or obscure</strong> any copyright, trademark,
            attribution, or proprietary notices included in or accompanying Site
            Elements.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          3.3 Security and Access Controls
        </h3>
        <p className="mb-4">
          You agree not to{" "}
          <strong>circumvent, disable, degrade, or interfere with</strong> any
          security features, access controls, paywalls, geo-restrictions,
          digital rights management, or other protections used by the Services.
          You also agree not to interfere with the operation of the Services or
          other users' access to the Services, including through hacking,
          introducing malware, or attempting to gain unauthorized access to
          systems or accounts.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          3.4 Permission Requests
        </h3>
        <p className="mb-4">
          If you want to use Site Elements in a way not expressly permitted by
          these Terms (including republication, redistribution, commercial use,
          or use in products/services), you must obtain our{" "}
          <strong>prior written permission</strong> from{" "}
          <a
            href={`mailto:${contact.permissionsEmail}`}
            className="text-blue-600 hover:underline"
          >
            {contact.permissionsEmail}
          </a>{" "}
          (or the contact method we specify on the Services).
        </p>
      </section>

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
            className="text-blue-600 hover:underline"
          >
            {contact.legalEmail}
          </a>{" "}
          or use the reporting tools provided on the Services (if available).
        </p>
      </section>

    </>
  );
}
