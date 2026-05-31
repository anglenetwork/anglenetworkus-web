/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection01() { return (<>
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

</>); }
