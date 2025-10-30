export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 font-sans">Terms of Service</h1>
      <div className="prose prose-lg max-w-none font-secondary">
        <p className="mb-4 text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Acceptance of Terms
        </h2>
        <p className="mb-4">
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement. If you do not agree to
          abide by the above, please do not use this service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Use License
        </h2>
        <p className="mb-4">
          Permission is granted to temporarily view the materials on our website
          for personal, non-commercial transitory viewing only. This is the
          grant of a license, not a transfer of title, and under this license
          you may not:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Modify or copy the materials</li>
          <li>
            Use the materials for any commercial purpose or for any public
            display
          </li>
          <li>
            Attempt to reverse engineer any software contained on our website
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Disclaimer
        </h2>
        <p className="mb-4">
          The materials on our website are provided on an &apos;as is&apos;
          basis. We make no warranties, expressed or implied, and hereby
          disclaim and negate all other warranties including, without
          limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Limitations
        </h2>
        <p className="mb-4">
          In no event shall our website or its suppliers be liable for any
          damages (including, without limitation, damages for loss of data or
          profit, or due to business interruption) arising out of the use or
          inability to use the materials on our website.
        </p>
      </div>
    </div>
  );
}
