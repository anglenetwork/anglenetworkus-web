export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 font-sans">Contact Us</h1>
      <div className="prose prose-lg max-w-none font-secondary">
        <p className="mb-6">
          We&apos;d love to hear from you. Whether you have a question,
          feedback, or just want to get in touch, feel free to reach out to us
          through any of the following methods.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3 font-sans">Email</h2>
            <p className="mb-2">
              General inquiries:{" "}
              <a
                href="mailto:info@example.com"
                className="text-blue-600 hover:underline"
              >
                info@example.com
              </a>
            </p>
            <p className="mb-2">
              Editorial:{" "}
              <a
                href="mailto:editorial@example.com"
                className="text-blue-600 hover:underline"
              >
                editorial@example.com
              </a>
            </p>
            <p>
              Advertising:{" "}
              <a
                href="mailto:advertising@example.com"
                className="text-blue-600 hover:underline"
              >
                advertising@example.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3 font-sans">Address</h2>
            <p className="mb-2">
              123 News Street
              <br />
              City, State 12345
              <br />
              United States
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3 font-sans">
              Response Time
            </h2>
            <p>
              We typically respond to inquiries within 24-48 hours during
              business days. For urgent matters, please call our main office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
