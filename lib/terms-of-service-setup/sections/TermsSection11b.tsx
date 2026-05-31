/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection11b() { return (<>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.7 Stand-Alone Class Action Waiver
        </h3>
        <p className="mb-4">To the fullest extent permitted by law:</p>
        <p className="mb-4 font-semibold uppercase">
          <strong>
            YOU AND {config.company.brandName.toUpperCase()} AGREE THAT EACH MAY
            BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY, AND
            NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS,
            COLLECTIVE, PRIVATE ATTORNEY GENERAL, OR REPRESENTATIVE PROCEEDING.
          </strong>
        </p>
        <p className="mb-4">
          The arbitrator <strong>may not</strong> consolidate more than one
          person's claims and <strong>may not</strong> award relief on a
          class-wide, collective, or representative basis.
        </p>
        <p className="mb-4">
          If a court determines that this class action waiver is unenforceable
          for a particular claim or request for relief, then that claim or
          request for relief (and only that claim or request) will proceed in
          court, subject to the remainder of these Terms.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.8 Mass Filing Protocol (Bellwether "Initial Arbitrations")
        </h3>
        <p className="mb-4">
          To reduce burdens and promote efficient resolution, additional
          procedures apply to "Mass Filings."
        </p>
        <p className="mb-4">
          <strong>Mass Filing Definition.</strong> A "
          <strong>Mass Filing</strong>" occurs when <strong>25 or more</strong>{" "}
          similar arbitration demands are submitted against{" "}
          <strong>{config.company.brandName}</strong> (or by{" "}
          <strong>{config.company.brandName}</strong>) and: (a) the demands
          raise substantially similar issues of law or fact; and (b) the
          claimants are represented by the same counsel or coordinated counsel;
          and (c) the demands are submitted within a <strong>90-day</strong>{" "}
          period (or otherwise close in proximity).
        </p>
        <p className="mb-4">
          <strong>Initial Arbitrations (Bellwethers).</strong> If a Mass Filing
          occurs, the parties agree that:
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            Only a limited number of cases will proceed first as "
            <strong>Initial Arbitrations</strong>."
          </li>
          <li>
            The Initial Arbitrations will consist of{" "}
            <strong>10 cases total</strong> (unless the parties agree
            otherwise):{" "}
            <strong>
              5 selected by claimants' counsel and 5 selected by{" "}
              {config.company.brandName}
            </strong>{" "}
            from the pool of filed demands.
          </li>
          <li>
            The remaining demands will be{" "}
            <strong>administratively stayed</strong> (not filed/processed, or
            paused if already filed) and no arbitration fees for the stayed
            demands will be due until the Initial Arbitrations and the process
            below are completed.
          </li>
        </ol>
        <p className="mb-4">
          <strong>Bellwether Process and Global Mediation.</strong>
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            The Initial Arbitrations will proceed to merits decisions (or
            earlier resolution).
          </li>
          <li>
            After the Initial Arbitrations conclude, the parties will
            participate in <strong>good-faith global mediation</strong> for at
            least <strong>30 days</strong> (unless resolved sooner).
          </li>
          <li>
            If the Disputes are not resolved in mediation, the parties will then
            confer on a fair process for resolving the remaining demands, which
            may include proceeding in staged batches, additional bellwethers, or
            other efficient mechanisms consistent with the Rules and these
            Terms.
          </li>
        </ol>
        <p className="mb-4">
          <strong>If Not Enforceable.</strong> If a court determines that this
          Mass Filing protocol is unenforceable as to a particular claimant's
          Dispute, then that Dispute must proceed <strong>individually</strong>{" "}
          in court (not as part of a class, collective, or representative
          action), consistent with the class action waiver and other terms in
          this Section 11, to the extent permitted by law.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.9 Time Limit to Bring Claims
        </h3>
        <p className="mb-4">
          To the fullest extent permitted by law, any Dispute must be filed
          within <strong>one (1) year</strong> after the claim arose, unless a
          longer period is required by applicable law. (This limitation period
          is tolled during the informal dispute resolution period described in
          Section 11.2.)
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.10 Severability and Survival
        </h3>
        <p className="mb-4">
          If any portion of this Section 11 is found to be unenforceable, the
          remainder will remain in effect to the fullest extent permitted by
          law. This Section 11 survives termination of your account and/or your
          use of the Services.
        </p>
</>); }
