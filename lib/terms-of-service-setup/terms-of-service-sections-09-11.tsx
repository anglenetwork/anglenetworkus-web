/* eslint-disable react/no-unescaped-entities -- legal prose with extensive quotation marks */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "./terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsOfServiceSections09To11() {
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

      {/* Section 11: Dispute Resolution */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          11. Dispute Resolution: Arbitration and Class Action Waivers
        </h2>
        <p className="mb-4 font-semibold">
          <strong>PLEASE READ THIS SECTION CAREFULLY.</strong> It affects your
          legal rights. It requires most disputes to be resolved through{" "}
          <strong>binding, individual arbitration</strong> and includes a{" "}
          <strong>stand-alone class action waiver</strong> and a{" "}
          <strong>mass filing (bellwether) protocol</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.1 Definitions
        </h3>
        <p className="mb-4">For purposes of this Section 11:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            "<strong>Dispute</strong>" means any dispute, claim, or controversy
            between you and <strong>{config.company.legalName}</strong> /{" "}
            <strong>{config.company.brandName}</strong> (and our affiliates,
            officers, directors, employees, agents, licensors, and service
            providers) arising out of or relating to the Services or these
            Terms, including their formation, interpretation, breach,
            termination, enforcement, or validity, and including claims based in
            contract, tort, statute, fraud, misrepresentation, or any other
            legal theory.
          </li>
          <li>
            "<strong>Arbitration Provider</strong>" means{" "}
            <strong>{config.legal.arbitrationProvider}</strong> and its
            applicable rules, as modified by these Terms.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.2 Informal Dispute Resolution (Required First)
        </h3>
        <p className="mb-4">
          Before initiating arbitration or a court proceeding, you and{" "}
          <strong>{config.company.brandName}</strong> agree to try to resolve
          any Dispute informally.
        </p>
        <p className="mb-4">
          <strong>Notice of Dispute.</strong> The party initiating a Dispute
          must send a written notice ("<strong>Notice</strong>") that includes:
          (a) the party's name and contact information; (b) a description of the
          Dispute and the legal basis for it; (c) the relief sought; and (d)
          sufficient information to identify any relevant account or use of the
          Services.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            Notices to <strong>{config.company.brandName}</strong> must be sent
            to: <strong>{getCompanyAddress()}</strong>, Attn: Legal Department,
            and also email a copy to{" "}
            <a
              href={`mailto:${contact.legalEmail}`}
              className="text-blue-600 hover:underline"
            >
              {contact.legalEmail}
            </a>
            .
          </li>
          <li>
            We will send Notices to you using the contact information associated
            with your account or any other reasonable means.
          </li>
        </ul>
        <p className="mb-4">
          <strong>Informal resolution period.</strong> You and we will engage in
          good-faith efforts to resolve the Dispute for <strong>60 days</strong>{" "}
          after receipt of a Notice (unless we mutually agree to extend). Either
          party may request an individual settlement conference by phone or
          video during this period.
        </p>
        <p className="mb-4">
          <strong>Tolling.</strong> Any applicable statute of limitations will
          be <strong>tolled</strong> during the informal dispute resolution
          period.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.3 Agreement to Arbitrate (Binding Individual Arbitration)
        </h3>
        <p className="mb-4">
          If the Dispute is not resolved within the informal dispute resolution
          period, you and <strong>{config.company.brandName}</strong> agree
          that, to the fullest extent permitted by law, the Dispute will be
          resolved by{" "}
          <strong>binding, confidential, individual arbitration</strong> and{" "}
          <strong>not in court</strong>, except as expressly provided below.
        </p>
        <p className="mb-4 font-semibold uppercase">
          <strong>
            YOU AND {config.company.brandName.toUpperCase()} ARE EACH WAIVING
            THE RIGHT TO SUE IN COURT AND THE RIGHT TO A TRIAL BY JURY.
          </strong>
        </p>
        <p className="mb-4">
          This arbitration agreement is governed by the{" "}
          <strong>Federal Arbitration Act</strong> (to the extent applicable).
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.4 Exceptions
        </h3>
        <p className="mb-4">
          The following exceptions apply to the arbitration requirement:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            bring an individual claim in <strong>small claims court</strong> if
            it qualifies and remains an individual case; and/or
          </li>
          <li>
            seek <strong>injunctive or equitable relief</strong> in court to
            prevent actual or threatened infringement, misappropriation, or
            violation of intellectual property rights or to protect the security
            or integrity of the Services (to the extent allowed by law).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.5 Arbitration Procedure, Rules, and Location
        </h3>
        <p className="mb-4">
          <strong>Provider and Rules.</strong> The arbitration will be
          administered by <strong>{config.legal.arbitrationProvider}</strong>{" "}
          under its applicable rules then in effect (the "<strong>Rules</strong>
          "), except as modified by these Terms. If the Rules conflict with
          these Terms, these Terms will control.
        </p>
        <p className="mb-4">
          <strong>Filing.</strong> To start arbitration, a party must submit a
          demand in accordance with the Rules and serve a copy on the other
          party.
        </p>
        <p className="mb-4">
          <strong>Hearing format.</strong> The arbitrator may decide the Dispute
          based on written submissions, a telephonic/video hearing, or an
          in-person hearing, unless the Rules require otherwise.
        </p>
        <p className="mb-4">
          <strong>Location.</strong> Unless you and we agree otherwise, any
          in-person hearing will take place in{" "}
          <strong>{config.legal.jurisdiction}</strong> or, if you prefer, in the
          U.S. county (or equivalent) where you reside, subject to the
          arbitrator's discretion and the Rules.
        </p>
        <p className="mb-4">
          <strong>Authority.</strong> The arbitrator will have exclusive
          authority to resolve any dispute about the interpretation,
          applicability, enforceability, or formation of this arbitration
          agreement, except that a court of competent jurisdiction will decide
          the enforceability of the class action waiver in Section 11.7 (and any
          portion expressly reserved to courts).
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          11.6 Costs and Fees
        </h3>
        <p className="mb-4">
          Payment of arbitration fees will be governed by the Rules and
          applicable law. If you can demonstrate that arbitration costs would be
          prohibitive compared to court, we will consider reasonable requests
          for fee adjustments to facilitate arbitration, to the extent permitted
          by the Rules and applicable law. Each party will bear its own
          attorneys' fees and costs unless the arbitrator awards otherwise under
          applicable law.
        </p>

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
      </section>

    </>
  );
}
