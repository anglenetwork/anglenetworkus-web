/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection11a() {
  return (
    <>
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
              className="text-news-primary hover:underline"
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
      </section>
    </>
  );
}
