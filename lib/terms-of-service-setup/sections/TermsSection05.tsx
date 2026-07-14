/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection05() {
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
          of Site Elements, whether for AI-related purposes or otherwise,
          requires our <strong>prior, explicit, written authorization</strong>{" "}
          (for example, via a signed licensing agreement or written permission
          from{" "}
          <a
            href={`mailto:${contact.permissionsEmail}`}
            className="text-news-primary hover:underline"
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
    </>
  );
}
