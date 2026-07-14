/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "../privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacySection06() {
  return (
    <>
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
              className="text-news-primary hover:underline"
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
    </>
  );
}
