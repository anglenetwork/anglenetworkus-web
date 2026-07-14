/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "./privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacyPolicySections01To05() {
  return (
    <>
      {/* Section 1: Who We Are */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          1) Who We Are (Data Controller) + Contact
        </h2>
        <div className="space-y-2">
          <p>
            <strong>Data Controller:</strong>{" "}
            <strong>{config.company.legalName}</strong>
          </p>
          <p>
            <strong>Address:</strong> {getCompanyAddress()}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-news-primary hover:underline"
            >
              {contact.email}
            </a>
          </p>
          {config.company.phone && (
            <p>
              <strong>Other Contact:</strong> {config.company.phone}
            </p>
          )}
          {config.dpo.enabled && (
            <div className="mt-4">
              <p>
                <strong>Data Protection Officer (if applicable):</strong>
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Name/Title: {config.dpo.name}/{config.dpo.title}
                </li>
                <li>
                  Contact:{" "}
                  {config.dpo.contactForm ? (
                    <Link
                      href={config.dpo.contactForm}
                      className="text-news-primary hover:underline"
                    >
                      {config.dpo.email}
                    </Link>
                  ) : (
                    <a
                      href={`mailto:${config.dpo.email}`}
                      className="text-news-primary hover:underline"
                    >
                      {config.dpo.email}
                    </a>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Scope */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          2) Scope of This Policy
        </h2>
        <p className="mb-4">
          This Privacy Policy explains how{" "}
          <strong>{config.company.websiteName}</strong> ("we," "us," "our")
          collects, uses, shares, and protects information when you:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Visit our website or apps,</li>
          <li>Create an account,</li>
          <li>Subscribe to newsletters or alerts,</li>
          <li>Interact with our content (e.g., comments, likes, bookmarks),</li>
          <li>Engage with ads or marketing,</li>
          <li>Contact us or participate in surveys/contests.</li>
        </ul>
        <p>
          <strong>Not covered:</strong> Third-party sites/services you access
          via links on our site (they have their own policies).
        </p>
      </section>

      {/* Section 3: Definitions */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          3) Definitions
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>"Personal Information"</strong>: Information that
            identifies, relates to, describes, or could reasonably be linked to
            you or your device.
          </li>
          <li>
            <strong>"Sensitive Personal Information"</strong> (where defined by
            law): Government IDs, precise geolocation, certain login
            credentials, health data, etc.
          </li>
          <li>
            <strong>"Processing"</strong>: Any operation performed on
            information (collection, storage, sharing, deletion, etc.).
          </li>
        </ul>
      </section>

      {/* Section 4: Information We Collect */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          4) Information We Collect
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) Information You Provide to Us
        </h3>
        <p className="mb-4">We may collect:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Contact info</strong>: name, email, phone (optional)
          </li>
          <li>
            <strong>Account info</strong>: username, password (or hashed
            password), authentication tokens
          </li>
          <li>
            <strong>Profile info</strong>: display name, preferences, location
            (approximate, if you provide it), interests
          </li>
          <li>
            <strong>Newsletter & alerts</strong>: subscription choices,
            frequency, topic preferences
          </li>
          {config.features.comments && (
            <li>
              <strong>User content</strong>: comments, feedback, messages,
              submissions (if enabled)
            </li>
          )}
          <li>
            <strong>Support requests</strong>: messages you send us, and
            associated metadata
          </li>
          {(config.features.subscriptions || config.features.donations) && (
            <li>
              <strong>Payment info</strong> (if subscriptions/donations are
              offered): billing address and payment status.
              <br />
              <em className="text-news-muted">
                Note: Payment card details are typically handled by our payment
                processor, not stored by us (depending on your setup).
              </em>
            </li>
          )}
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          B) Information Collected Automatically
        </h3>
        <p className="mb-4">When you use the site, we may collect:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Device and network data</strong>: IP address, device type,
            OS, browser, language, time zone, approximate location derived from
            IP
          </li>
          <li>
            <strong>Usage data</strong>: pages viewed, time spent, clicks,
            scrolling, referrer URLs, search queries on our site, interactions
            with features
          </li>
          {config.features.targetedAdvertising && (
            <li>
              <strong>Advertising & measurement data</strong> (if enabled): ad
              impressions, engagement, frequency capping identifiers, aggregated
              audience metrics
            </li>
          )}
          <li>
            <strong>Log and security data</strong>: timestamps, error logs,
            fraud signals, rate limiting events
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          C) Information From Third Parties
        </h3>
        <p className="mb-4">We may receive:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          {config.features.socialSignIn && (
            <li>
              <strong>Social sign-in data</strong> (if you connect accounts):
              basic profile info (per your provider settings)
            </li>
          )}
          {config.features.targetedAdvertising && (
            <li>
              <strong>Advertising/analytics partners</strong>: campaign
              performance data, aggregated audience insights
            </li>
          )}
          <li>
            <strong>Content platforms</strong>: information when you engage with
            embedded content (e.g., video players, social embeds), which may
            place cookies under their policies
          </li>
        </ul>
      </section>

      {/* Section 5: How We Use Information */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          5) How We Use Information (Purposes)
        </h2>
        <p className="mb-4">We use Personal Information to:</p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) Provide and Operate the Services
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Create and manage accounts</li>
          <li>Deliver newsletters and notifications you request</li>
          <li>
            Provide core site features (bookmarks, comments, saved topics, etc.)
          </li>
          {(config.features.subscriptions || config.features.donations) && (
            <li>Process subscriptions/donations (if applicable)</li>
          )}
          <li>Provide customer support and respond to inquiries</li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          B) Personalize and Improve the Experience
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          {config.features.personalizedContent && (
            <li>Recommend content or topics you may like</li>
          )}
          <li>Remember preferences (e.g., region, display settings)</li>
          <li>Diagnose bugs, improve performance, and develop new features</li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          C) Analytics, Research, and Measurement
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Understand readership patterns</li>
          <li>
            Measure newsletter performance (opens/clicks) and site engagement
          </li>
          <li>Evaluate what content formats work best</li>
        </ul>

        {config.features.targetedAdvertising && (
          <>
            <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
              D) Advertising and Marketing (If Enabled)
            </h3>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                Display ads (contextual and/or targeted, depending on your
                choices)
              </li>
              <li>Measure ad performance and limit repetitive ads</li>
              <li>
                Market our products/services (you can opt out of promotional
                emails anytime)
              </li>
            </ul>
          </>
        )}

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          {config.features.targetedAdvertising ? "E" : "D"}) Safety, Security,
          and Legal Compliance
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Prevent fraud, abuse, spam, and unauthorized access</li>
          <li>Enforce our Terms of Service and protect rights and safety</li>
          <li>Comply with legal obligations and respond to lawful requests</li>
        </ul>
      </section>
    </>
  );
}
