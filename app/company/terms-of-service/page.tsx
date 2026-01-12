interface ContentSection {
  type: "heading" | "paragraph" | "list";
  content: string | string[];
}

interface TermsOfServiceContent {
  title: string;
  lastUpdated?: string | Date;
  sections: ContentSection[];
}

interface TermsOfServicePageProps {
  content?: TermsOfServiceContent;
}

// Default content structure - can be replaced with data from CMS, API, or props
const defaultContent: TermsOfServiceContent = {
  title: "Terms of Service",
  lastUpdated: "January 1, 2025",
  sections: [
    {
      type: "heading",
      content: "Acceptance of Terms",
    },
    {
      type: "paragraph",
      content:
        "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      type: "heading",
      content: "Use License",
    },
    {
      type: "paragraph",
      content:
        "Permission is granted to temporarily view the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
    },
    {
      type: "list",
      content: [
        "Modify or copy the materials",
        "Use the materials for any commercial purpose or for any public display",
        "Attempt to reverse engineer any software contained on our website",
        "Remove any copyright or other proprietary notations from the materials",
      ],
    },
    {
      type: "heading",
      content: "Disclaimer",
    },
    {
      type: "paragraph",
      content:
        "The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    },
    {
      type: "heading",
      content: "Limitations",
    },
    {
      type: "paragraph",
      content:
        "In no event shall our website or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.",
    },
  ],
};

function renderSection(section: ContentSection, index: number) {
  switch (section.type) {
    case "heading":
      return (
        <h2 key={index} className="text-2xl font-semibold mt-8 mb-4 font-sans">
          {section.content as string}
        </h2>
      );
    case "paragraph":
      return (
        <p key={index} className="mb-4">
          {section.content as string}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
          {(section.content as string[]).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function TermsOfServicePage({
  content = defaultContent,
}: TermsOfServicePageProps) {
  // Use static date string to avoid hydration mismatches
  const lastUpdatedDate =
    content.lastUpdated instanceof Date
      ? content.lastUpdated.toLocaleDateString()
      : content.lastUpdated || "January 1, 2025";

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 font-sans">{content.title}</h1>
      <div className="prose prose-lg max-w-none font-secondary">
        <p className="mb-4 text-sm text-gray-600">
          Last updated: {lastUpdatedDate}
        </p>

        {content.sections.map((section, index) =>
          renderSection(section, index)
        )}
      </div>
    </div>
  );
}
