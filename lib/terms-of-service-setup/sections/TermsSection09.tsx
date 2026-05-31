/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection09() {
  return (
    <>
      {/* Section 9: Liability Disclaimers */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          9. Liability Disclaimers and "As Is" / "As Available" Mandate
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          9.1 Services Provided "As Is" and "As Available"
        </h3>
        <p className="mb-4 font-semibold uppercase">
          THE SERVICES (INCLUDING ALL SITE ELEMENTS, THIRD-PARTY CONTENT,
          USER-GENERATED CONTENT, FEATURES, AND ANY LINKS OR INTEGRATIONS) ARE
          PROVIDED ON AN <strong>"AS IS"</strong> AND{" "}
          <strong>"AS AVAILABLE"</strong> BASIS. YOUR USE OF THE SERVICES IS AT
          YOUR SOLE RISK.
        </p>
        <p className="mb-4 font-semibold uppercase">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,{" "}
          <strong>{config.company.legalName}</strong>,{" "}
          <strong>{config.company.brandName}</strong>, AND OUR AFFILIATES,
          LICENSORS, AND SERVICE PROVIDERS{" "}
          <strong>DISCLAIM ALL WARRANTIES AND CONDITIONS OF ANY KIND</strong>,
          WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, WITHOUT LIMITATION,{" "}
          <strong>
            ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, TITLE, AND NON-INFRINGEMENT
          </strong>
          , AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING, COURSE OF
          PERFORMANCE, OR USAGE OF TRADE.
        </p>
        <p className="mb-4 font-semibold uppercase">
          WITHOUT LIMITING THE FOREGOING, WE DO NOT WARRANT OR GUARANTEE THAT:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6 uppercase">
          <li>
            the Services will be{" "}
            <strong>uninterrupted, timely, secure, or error-free</strong>;
          </li>
          <li>defects will be corrected;</li>
          <li>
            the Services or servers are{" "}
            <strong>
              free of viruses, malware, or other harmful components
            </strong>
            ;
          </li>
          <li>
            any content (including news, headlines, breaking updates, analysis,
            or third-party content) will be{" "}
            <strong>accurate, complete, reliable, current, or available</strong>
            ; or
          </li>
          <li>
            the Services will meet your requirements or expectations or achieve
            any particular results.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          9.3 Editorial and Information Disclaimer
        </h3>
        <p className="mb-4">
          News and information can change rapidly. Content on the Services may
          include errors, omissions, or outdated information. The Services may
          include commentary, analysis, and opinion pieces that reflect the
          views of their authors, not necessarily{" "}
          <strong>{config.company.brandName}</strong>. Nothing on the Services
          constitutes professional advice (including legal, medical, financial,
          or investment advice). You should consult a qualified professional
          before acting on information obtained through the Services.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          9.4 Third-Party Sites and Services
        </h3>
        <p className="mb-4">
          We do not endorse and are not responsible for the availability,
          content, products, or services of third-party websites, platforms,
          advertisers, or services linked to or integrated with the Services.
          Any interactions you have with third parties are solely between you
          and the third party.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          9.5 Jurisdictional Limitations
        </h3>
        <p className="mb-4">
          Some jurisdictions do not allow the exclusion of certain warranties,
          so some of the above disclaimers may not apply to you. In such cases,
          our warranties are limited to the maximum extent permitted by
          applicable law.
        </p>
      </section>
    </>
  );
}
