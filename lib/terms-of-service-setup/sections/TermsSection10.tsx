/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection10() { return (<>
      {/* Section 10: Limitation of Damages */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          10. Limitation of Damages
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          10.1 Exclusion of Certain Damages
        </h3>
        <p className="mb-4 font-semibold uppercase">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,{" "}
          <strong>{config.company.legalName}</strong>,{" "}
          <strong>{config.company.brandName}</strong>, AND OUR AFFILIATES,
          LICENSORS, AND SERVICE PROVIDERS, AND EACH OF THEIR RESPECTIVE
          OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AGENTS, AND
          REPRESENTATIVES (COLLECTIVELY, THE "
          <strong>{config.company.brandName.toUpperCase()} PARTIES</strong>"){" "}
          <strong>WILL NOT BE LIABLE</strong> TO YOU OR ANY THIRD PARTY FOR{" "}
          <strong>
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
            PUNITIVE DAMAGES
          </strong>
          , OR FOR ANY{" "}
          <strong>
            LOSS OF PROFITS, REVENUE, GOODWILL, BUSINESS INTERRUPTION, LOSS OF
            DATA, OR OTHER INTANGIBLE LOSSES
          </strong>
          , ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS,{" "}
          <strong>EVEN IF</strong> ANY{" "}
          <strong>{config.company.brandName.toUpperCase()} PARTY</strong> HAS
          BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          10.2 Monetary Cap on Liability
        </h3>
        <p className="mb-4 font-semibold uppercase">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE{" "}
          <strong>AGGREGATE LIABILITY</strong> OF THE{" "}
          <strong>{config.company.brandName.toUpperCase()} PARTIES</strong> TO
          YOU FOR <strong>ANY AND ALL CLAIMS</strong> ARISING OUT OF OR RELATING
          TO THE SERVICES OR THESE TERMS (REGARDLESS OF THE FORM OF ACTION,
          WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE){" "}
          <strong>WILL NOT EXCEED</strong> THE <strong>LESSER OF</strong>:
        </p>
        <p className="mb-4 uppercase">
          (a) THE AMOUNT (IF ANY) PAID BY YOU TO{" "}
          <strong>{config.company.brandName.toUpperCase()}</strong> FOR THE
          SERVICES IN THE <strong>SIX (6) MONTHS</strong> IMMEDIATELY PRECEDING
          THE EVENT GIVING RISE TO THE CLAIM; OR
        </p>
        <p className="mb-4 uppercase">
          (b) <strong>ONE HUNDRED U.S. DOLLARS (US $100).</strong>
        </p>
        <p className="mb-4 uppercase">
          IF YOU HAVE NOT PAID{" "}
          <strong>{config.company.brandName.toUpperCase()}</strong> ANY AMOUNTS
          IN THAT SIX-MONTH PERIOD, YOUR RECOVERY IS LIMITED TO{" "}
          <strong>US $100</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          10.3 Basis of the Bargain
        </h3>
        <p className="mb-4 font-semibold uppercase">
          YOU ACKNOWLEDGE THAT THE DISCLAIMERS OF WARRANTIES AND THE LIMITATIONS
          OF LIABILITY SET FORTH IN THESE TERMS ARE{" "}
          <strong>ESSENTIAL ELEMENTS OF THE BASIS OF THE BARGAIN</strong>{" "}
          BETWEEN YOU AND{" "}
          <strong>{config.company.brandName.toUpperCase()}</strong>, AND THAT{" "}
          <strong>{config.company.brandName.toUpperCase()}</strong> WOULD NOT BE
          ABLE TO PROVIDE THE SERVICES WITHOUT THESE LIMITATIONS.
        </p>
        <p className="mb-4 uppercase">
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN
          DAMAGES OR LIABILITY. TO THE EXTENT SUCH LIMITATIONS ARE NOT
          PERMITTED,{" "}
          <strong>
            THE LIABILITY OF THE {config.company.brandName.toUpperCase()}{" "}
            PARTIES WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY
            APPLICABLE LAW
          </strong>
          .
        </p>
      </section>
</>); }
