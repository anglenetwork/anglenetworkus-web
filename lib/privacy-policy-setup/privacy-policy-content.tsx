/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
/**
 * Privacy Policy Content
 *
 * This file contains the complete privacy policy content with variable placeholders.
 * The content is structured as React components for easy rendering and modification.
 *
 * HOW TO MODIFY THE CONTENT:
 *
 * 1. For simple text changes: Edit the JSX content directly in this file
 * 2. For variable values: Update privacy-policy-config.ts instead
 * 3. To add/remove sections: Modify the JSX structure in this component
 * 4. To conditionally show sections: Use feature flags from config (e.g., config.features.subscriptions)
 *
 * All placeholders like {config.company.legalName} are automatically replaced with values
 * from privacy-policy-config.ts. To change a value, update the config file, not this file.
 *
 * STRUCTURE:
 * - Each section is wrapped in a <section> tag
 * - Sections are numbered 1-19, plus optional addenda (A, B)
 * - Conditional sections use feature flags (e.g., {config.features.targetedAdvertising && ...})
 * - Links use Next.js Link component for internal routes, <a> tags for external/mailto
 */

import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "./privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-8">
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
              className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
                    >
                      {config.dpo.email}
                    </Link>
                  ) : (
                    <a
                      href={`mailto:${config.dpo.email}`}
                      className="text-blue-600 hover:underline"
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
              <em className="text-gray-600">
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

      {/* Section 6: Cookies */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          6) Cookies, Pixels, SDKs, and Similar Technologies
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) What We Use
        </h3>
        <p className="mb-4">We may use:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Cookies</strong> (first-party and third-party)
          </li>
          <li>
            <strong>Pixels / tags / beacons</strong>
          </li>
          <li>
            <strong>Local storage</strong>
          </li>
          <li>
            <strong>SDKs</strong> (primarily for app experiences, if applicable)
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          B) Categories of Cookies/Trackers
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Strictly Necessary</strong>: login, security, load
            balancing, consent tools
          </li>
          <li>
            <strong>Functional</strong>: remember settings and preferences
          </li>
          <li>
            <strong>Analytics</strong>: audience measurement, performance,
            debugging
          </li>
          {config.features.targetedAdvertising && (
            <li>
              <strong>Advertising</strong>: deliver and measure ads; limit
              frequency; support targeted advertising (if permitted)
            </li>
          )}
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          C) Your Controls
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Use our <strong>Cookie Preferences / Consent Tool</strong>:{" "}
            <Link
              href={config.links.cookiePreferences}
              className="text-blue-600 hover:underline"
            >
              {config.links.cookiePreferences}
            </Link>
          </li>
          <li>Adjust browser controls (block/delete cookies)</li>
          <li>Use device-level ad controls (mobile)</li>
          <li>
            Opt out of targeted advertising (see "Your Rights and Choices")
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          D) Global Privacy Control (GPC)
        </h3>
        <p className="mb-4">
          Where required or recognized, we treat{" "}
          <strong>Global Privacy Control</strong> signals as a request to opt
          out of certain tracking/"sale"/"sharing" for targeted advertising.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          E) Industry Privacy Signals (Optional, if you implement it)
        </h3>
        <p className="mb-4">
          If we support industry standards (e.g., IAB privacy strings), we may
          transmit your preferences to participating advertising partners to
          help enforce your choices across the ad ecosystem.
        </p>
      </section>

      {/* Section 7: When We Share Information */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          7) When We Share Information
        </h2>
        <p className="mb-4">We may share Personal Information with:</p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) Service Providers (Processors)
        </h3>
        <p className="mb-4">Vendors who help us run the site, such as:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Hosting and infrastructure</li>
          <li>Analytics and performance monitoring</li>
          <li>Newsletter/email delivery</li>
          <li>Customer support tools</li>
          <li>Security and fraud prevention</li>
          {(config.features.subscriptions || config.features.donations) && (
            <li>Payment processing (if applicable)</li>
          )}
        </ul>
        <p className="mb-4">
          They are permitted to use Personal Information{" "}
          <strong>only to provide services to us</strong> (subject to
          contracts).
        </p>

        {config.features.targetedAdvertising && (
          <>
            <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
              B) Advertising and Measurement Partners (If Enabled)
            </h3>
            <p className="mb-4">
              We may share identifiers and event data (cookie IDs, device IDs,
              IP, page views, ad interactions) to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Deliver ads</li>
              <li>Measure ad performance</li>
              <li>Manage frequency</li>
              <li>
                Support targeted advertising (depending on your choices and
                location)
              </li>
            </ul>
          </>
        )}

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          {config.features.targetedAdvertising ? "C" : "B"}) Affiliates
        </h3>
        <p className="mb-4">
          If we operate as part of a corporate group, we may share data with
          affiliates for internal administration, security, and service
          delivery.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          {config.features.targetedAdvertising ? "D" : "C"}) Legal, Safety, and
          Business Transfers
        </h3>
        <p className="mb-4">We may share information:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>To comply with law, court order, or legal process</li>
          <li>
            To protect rights, safety, and integrity of our users and services
          </li>
          <li>
            In connection with a merger, acquisition, financing, or sale of
            assets (with appropriate protections)
          </li>
        </ul>
      </section>

      {/* Section 8: Sale/Sharing */}
      {config.features.targetedAdvertising && (
        <section>
          <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
            8) "Sale" / "Sharing" / Targeted Advertising Disclosures (US State
            Laws)
          </h2>
          <p className="mb-4">
            Some privacy laws define "sale" or "sharing" broadly to include
            disclosure of data for{" "}
            <strong>cross-context behavioral advertising</strong>.
          </p>
          <p className="mb-4">
            If our advertising setup qualifies as "sale" or "sharing" under
            applicable law, you can opt out via:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              <strong>Do Not Sell or Share My Personal Information:</strong>{" "}
              <Link
                href={config.links.doNotSellLink}
                className="text-blue-600 hover:underline"
              >
                {config.links.doNotSellLink}
              </Link>
            </li>
            <li>
              <strong>Privacy Choices / Cookie Preferences:</strong>{" "}
              <Link
                href={config.links.cookiePreferences}
                className="text-blue-600 hover:underline"
              >
                {config.links.cookiePreferences}
              </Link>
            </li>
            <li>
              <strong>Global Privacy Control (GPC):</strong> supported where
              required/recognized
            </li>
          </ul>
          <p>
            <strong>
              We do not knowingly sell the Personal Information of minors under
              16
            </strong>{" "}
            (where applicable).
          </p>
        </section>
      )}

      {/* Section 9: Your Rights */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          9) Your Rights and Choices
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          A) Account + Communication Controls
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Newsletter unsubscribe</strong>: link in every email
          </li>
          <li>
            <strong>Update preferences</strong>:{" "}
            <Link
              href={config.links.accountPreferences}
              className="text-blue-600 hover:underline"
            >
              {config.links.accountPreferences}
            </Link>
          </li>
          <li>
            <strong>Delete your account</strong>:{" "}
            <Link
              href={config.links.accountDeletion}
              className="text-blue-600 hover:underline"
            >
              {config.links.accountDeletion}
            </Link>
          </li>
          <li>
            <strong>Cookie preferences</strong>:{" "}
            <Link
              href={config.links.cookiePreferences}
              className="text-blue-600 hover:underline"
            >
              {config.links.cookiePreferences}
            </Link>
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          B) Privacy Rights Requests (Depending on Location)
        </h3>
        <p className="mb-4">
          Depending on where you live, you may have rights to:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Access / Know</strong> what we collect and how we use it
          </li>
          <li>
            <strong>Delete</strong> Personal Information
          </li>
          <li>
            <strong>Correct</strong> inaccurate Personal Information
          </li>
          <li>
            <strong>Portability</strong> (receive a copy in a usable format)
          </li>
          {config.features.targetedAdvertising && (
            <li>
              <strong>Opt out</strong> of targeted advertising / profiling (as
              defined by law)
            </li>
          )}
          <li>
            <strong>
              Limit use/disclosure of Sensitive Personal Information
            </strong>{" "}
            (where applicable)
          </li>
          <li>
            <strong>Non-discrimination</strong> for exercising privacy rights
          </li>
        </ul>
        <p className="mb-4">
          <strong>How to submit a request:</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Privacy Request Portal:{" "}
            <Link
              href={contact.portal}
              className="text-blue-600 hover:underline"
            >
              {contact.portal}
            </Link>
          </li>
          <li>
            Email:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </li>
          {config.company.phone && (
            <li>Toll-free number: {config.company.phone}</li>
          )}
        </ul>
        <p className="mb-4">
          <strong>Verification:</strong> We may need to verify your identity
          before fulfilling a request.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          C) Authorized Agents (Optional)
        </h3>
        <p className="mb-4">
          If allowed by law, you may designate an authorized agent to submit
          requests on your behalf. We may require proof of authorization.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          D) Appeals (Recommended Best Practice)
        </h3>
        <p className="mb-4">
          If we deny your request, you may appeal by contacting{" "}
          <a
            href={`mailto:${config.links.appealsEmail}`}
            className="text-blue-600 hover:underline"
          >
            {config.links.appealsEmail}
          </a>{" "}
          with the subject line "Privacy Request Appeal."
        </p>
      </section>

      {/* Section 10: Children's Privacy */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          10) Children's Privacy
        </h2>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Our services are{" "}
            <strong>
              not intended for children under {config.children.standard}
            </strong>{" "}
            (choose your standard).
          </li>
          <li>
            We do not knowingly collect Personal Information from children under{" "}
            <strong>13</strong> without verifiable parental consent.
          </li>
          <li>
            If you believe a child has provided Personal Information, contact us
            at{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>{" "}
            so we can delete it.
          </li>
        </ul>
      </section>

      {/* Section 11: Data Retention */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          11) Data Retention
        </h2>
        <p className="mb-4">
          We keep Personal Information only as long as reasonably necessary for
          the purposes described, including legal, accounting, and security
          needs.
        </p>
        <p className="mb-4">
          <strong>Typical retention examples (customize):</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Account data</strong>: {config.retention.accountData}
          </li>
          <li>
            <strong>Newsletter subscriptions</strong>:{" "}
            {config.retention.newsletterSubscriptions}
          </li>
          <li>
            <strong>Analytics logs</strong>: {config.retention.analyticsLogs}
          </li>
          <li>
            <strong>Security logs</strong>: {config.retention.securityLogs}
          </li>
          <li>
            <strong>Legal holds</strong>: retained as required by law or ongoing
            disputes
          </li>
        </ul>
      </section>

      {/* Section 12: Security */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          12) Security
        </h2>
        <p className="mb-4">
          We use reasonable administrative, technical, and physical safeguards
          designed to protect Personal Information, such as:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Encryption in transit (HTTPS/TLS)</li>
          <li>Access controls and least-privilege permissions</li>
          <li>Monitoring, rate limiting, and abuse detection</li>
          <li>Vendor risk management where feasible</li>
        </ul>
        <p>
          No system is 100% secure. You are responsible for keeping your
          credentials confidential.
        </p>
      </section>

      {/* Section 13: International Data Transfers */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          13) International Data Transfers
        </h2>
        <p className="mb-4">
          If you access our services from outside{" "}
          <strong>{config.primaryCountry}</strong>, your information may be
          transferred to and processed in other countries.
        </p>
        <p className="mb-4">
          Where required, we use appropriate safeguards such as:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Standard contractual clauses or similar transfer mechanisms</li>
          <li>Contractual and technical protections with vendors</li>
        </ul>
      </section>

      {/* Section 14: Third-Party Links */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          14) Third-Party Links, Embedded Content, and Social Features
        </h2>
        <p className="mb-4">
          Our content may include links or embeds (e.g., videos, social posts).
          These third parties may collect data directly from you and set cookies
          under their own privacy policies. We encourage you to review their
          policies.
        </p>
        {config.features.socialSignIn && (
          <p>
            If we offer social features (sharing buttons, sign-in), the provider
            may receive usage data depending on your settings.
          </p>
        )}
      </section>

      {/* Section 15: User-Generated Content */}
      {config.features.userGeneratedContent && (
        <section>
          <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
            15) User-Generated Content and Public Areas (If Enabled)
          </h2>
          <p className="mb-4">
            If you post comments or other content in public areas, it may be
            visible to others and searchable. Please avoid posting sensitive
            information. We may moderate content according to our Terms.
          </p>
        </section>
      )}

      {/* Section 16: Automated Decisions */}
      {config.features.personalizedContent && (
        <section>
          <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
            16) Automated Decisions / Profiling (If You Personalize)
          </h2>
          <p className="mb-4">We may use automated processing to:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Recommend articles or topics</li>
            <li>Detect fraud or abuse</li>
            {config.features.targetedAdvertising && (
              <li>Measure and optimize ad delivery (if enabled)</li>
            )}
          </ul>
          <p>
            Where required, you may have the right to opt out of certain
            profiling or request more information about the logic involved.
          </p>
        </section>
      )}

      {/* Section 17: Journalistic Ethics */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          17) Journalistic Ethics, Reader Trust, and Source Protection
        </h2>
        <p className="mb-4">
          We recognize a dual responsibility: protecting reader data and
          protecting journalistic integrity.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Source protection:</strong> We take steps designed to
            prevent analytics and technical logs from being used to identify
            confidential sources.
          </li>
          <li>
            <strong>Data minimization:</strong> We aim to collect only what we
            need to operate and improve our services.
          </li>
          <li>
            <strong>Integrity and transparency:</strong> We strive to present
            clear labeling of advertising/sponsored content and to provide
            meaningful privacy choices.
          </li>
        </ul>
        {config.links.ethicsPolicy && (
          <p>
            (You can link here to your{" "}
            <strong>Ethics Policy / Editorial Standards</strong> page:{" "}
            <Link
              href={config.links.ethicsPolicy}
              className="text-blue-600 hover:underline"
            >
              {config.links.ethicsPolicy}
            </Link>
            .)
          </p>
        )}
      </section>

      {/* Section 18: Changes to Policy */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          18) Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, or legal requirements.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>We will update the "Last Updated" date at the top.</li>
          <li>
            If changes are material, we will provide additional notice (e.g.,
            site banner or email).
          </li>
        </ul>
      </section>

      {/* Section 19: Contact Us */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          19) Contact Us
        </h2>
        <p className="mb-4">For questions, requests, or complaints:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Email:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </li>
          <li>
            Privacy Request Portal:{" "}
            <Link
              href={contact.portal}
              className="text-blue-600 hover:underline"
            >
              {contact.portal}
            </Link>
          </li>
          <li>Address: {contact.address}</li>
        </ul>
      </section>

      {/* Optional Addenda */}
      {config.features.euUkUsers && (
        <>
          <section>
            <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
              A) EU/UK Addendum (GDPR/UK GDPR) — If You Have EU/UK Users
            </h2>
            <p className="mb-4">
              <strong>Legal bases</strong> may include:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Performance of a contract (account/newsletter delivery)</li>
              <li>
                Legitimate interests (site security, analytics, service
                improvement)
              </li>
              <li>
                Consent (certain cookies/targeted advertising; marketing where
                required)
              </li>
              <li>Legal obligation (compliance requests)</li>
            </ul>
            <p className="mb-4">
              <strong>Your GDPR rights</strong> may include access, deletion,
              correction, objection, restriction, portability, and withdrawal of
              consent.
            </p>
            <p>
              You may also lodge a complaint with your local supervisory
              authority.
            </p>
          </section>

          <section>
            <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
              B) "Notice at Collection" (If You Want a California-style front
              panel)
            </h2>
            <p className="mb-4">At or before collection, we collect:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                Identifiers (email/account), internet activity (usage/device),
                approximate location (IP-derived), and preferences
              </li>
            </ul>
            <p className="mb-4">For purposes:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                Service delivery, personalization, analytics, advertising
                (optional), security, and compliance
              </li>
            </ul>
            <p className="mb-4">Disclosures:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                We may "sell/share" for targeted advertising (if enabled) — opt
                out via{" "}
                <Link
                  href={config.links.doNotSellLink}
                  className="text-blue-600 hover:underline"
                >
                  {config.links.doNotSellLink}
                </Link>{" "}
                and{" "}
                <Link
                  href={config.links.cookiePreferences}
                  className="text-blue-600 hover:underline"
                >
                  {config.links.cookiePreferences}
                </Link>
                .
              </li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
