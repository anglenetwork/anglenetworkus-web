export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 font-sans">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none font-secondary">
        <p className="mb-4 text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Introduction
        </h2>
        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal
          data. This privacy policy explains how we collect, use, and safeguard
          your information when you visit our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Information We Collect
        </h2>
        <p className="mb-4">
          We may collect information about you in various ways when you use our
          services, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Personal information you provide directly to us</li>
          <li>
            Information collected automatically through cookies and tracking
            technologies
          </li>
          <li>Usage data and analytics information</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          How We Use Your Information
        </h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide and improve our services</li>
          <li>Communicate with you about our services</li>
          <li>Analyze usage patterns and trends</li>
          <li>Ensure security and prevent fraud</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 font-sans">
          Your Rights
        </h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal
          information at any time. Please contact us if you wish to exercise
          these rights.
        </p>
      </div>
    </div>
  );
}
