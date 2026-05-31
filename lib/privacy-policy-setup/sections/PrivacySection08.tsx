/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  privacyPolicyConfig,
  getCompanyAddress,
  getContactInfo,
} from "../privacy-policy-config";

const config = privacyPolicyConfig;
const contact = getContactInfo();

export function PrivacySection08() { return (<>
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

</>); }
