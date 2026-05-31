/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection03() { return (<>
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

</>); }
