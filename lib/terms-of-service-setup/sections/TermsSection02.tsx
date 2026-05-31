/* eslint-disable react/no-unescaped-entities -- legal prose */
import Link from "next/link";
import {
  termsOfServiceConfig,
  getCompanyAddress,
  getContactInfo,
} from "../terms-of-service-config";

const config = termsOfServiceConfig;
const contact = getContactInfo();

export function TermsSection02() {
  return (
    <>
      {/* Section 2: Intellectual Property */}
      <section>
        <h2 className="mt-8 mb-4 font-sans font-semibold text-xl">
          2. Intellectual Property and "Site Elements"
        </h2>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.1 Ownership
        </h3>
        <p className="mb-4">
          The Services and all materials and content made available through the
          Services are owned or licensed by{" "}
          <strong>{config.company.legalName}</strong> and/or our licensors and
          content providers, and are protected by applicable intellectual
          property laws, including copyright, trademark, trade dress, and other
          laws in the{" "}
          <strong>{config.legal.country} and internationally</strong>.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.2 Definition of "Site Elements"
        </h3>
        <p className="mb-4">
          For purposes of these Terms, "<strong>Site Elements</strong>" means{" "}
          <strong>all</strong> content, materials, and features displayed,
          performed, published, provided, or otherwise made available through
          the Services, including, without limitation:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Editorial and informational content:</strong> articles,
            headlines, summaries, text, interviews, captions, metadata, tags,
            categories, directories, compilations, and databases;
          </li>
          <li>
            <strong>Visual assets:</strong> photographs, illustrations,
            graphics, charts, infographics, images, icons, animations, and
            design elements;
          </li>
          <li>
            <strong>Audio/visual content:</strong> videos, livestreams, audio
            clips, podcasts, music, and other audio-visual files;
          </li>
          <li>
            <strong>Brand and identity materials:</strong> names, trademarks,
            service marks, logos, trade names, domain names, and other brand
            features;
          </li>
          <li>
            <strong>Software and technology:</strong> the Services' software,
            applications, tools, widgets, APIs (if any), source and object code,
            scripts, and any other underlying technology;
          </li>
          <li>
            <strong>Interface and code:</strong> user interface elements,
            layout, page templates, navigation, and the underlying or associated
            code and structures, including{" "}
            <strong>
              HTML, CSS, JavaScript, XML, JSON, and other markup or data formats
            </strong>
            ;
          </li>
          <li>
            <strong>Downloads and digital files:</strong> newsletters, PDFs,
            digital downloads, and other files or materials; and
          </li>
          <li>
            <strong>Other features and materials:</strong> interactive features,
            comment/community features (excluding User Content as defined
            elsewhere), and any products or services offered through the
            Services.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.3 "Look and Feel" and Compilation
        </h3>
        <p className="mb-4">
          The Services'{" "}
          <strong>overall appearance, design, and presentation</strong>,
          including the <strong>"look and feel,"</strong> selection,
          coordination, arrangement, and organization of Site Elements
          (including the ordering and display of stories, modules, and
          navigational structure), constitute{" "}
          <strong>original works of authorship</strong> and are protected by
          intellectual property and trade dress laws. You may not copy, imitate,
          or replicate any portion of the Services' look and feel or compilation
          without our prior written permission.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.4 No Transfer of Rights
        </h3>
        <p className="mb-4">
          Except as expressly stated in these Terms,{" "}
          <strong>no right, title, or interest</strong> in or to the Services or
          any Site Elements is transferred to you. Any access to or use of the
          Services does not grant you ownership of any intellectual property
          rights in Site Elements. All rights not expressly granted are reserved
          by <strong>{config.company.brandName}</strong> and our licensors.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.5 Limited License to Use the Services
        </h3>
        <p className="mb-4">
          Subject to your compliance with these Terms, we grant you a{" "}
          <strong>
            limited, revocable, non-exclusive, non-transferable, and
            non-sublicensable
          </strong>{" "}
          license to access and use the Services and Site Elements{" "}
          <strong>for your personal, non-commercial use</strong> only. This
          license does not permit you to (and you may not) reproduce,
          distribute, publicly display, publicly perform, publish, transmit,
          create derivative works from, sell, license, exploit, or otherwise use
          any Site Elements except as expressly allowed by these Terms or with
          our prior written consent.
        </p>

        <h3 className="mt-6 mb-3 font-sans font-semibold text-lg">
          2.6 Third-Party Rights
        </h3>
        <p className="mb-4">
          Some Site Elements may be owned by or licensed from third parties. All
          third-party trademarks, logos, and content remain the property of
          their respective owners, and your use of those materials may be
          subject to additional restrictions imposed by the applicable owners or
          licensors.
        </p>
      </section>
    </>
  );
}
