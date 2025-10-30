export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 font-sans">About Us</h1>
      <div className="prose prose-lg max-w-none font-secondary">
        <p className="mb-4">
          Welcome to our news platform. We are dedicated to bringing you the
          most up-to-date and comprehensive news coverage.
        </p>
        <p className="mb-4">
          Our mission is to deliver accurate, timely, and insightful journalism
          that keeps you informed about the events shaping our world.
        </p>
        <p className="mb-4">
          We believe in the power of information and strive to provide our
          readers with high-quality content across various topics including
          politics, business, technology, and more.
        </p>
        <p>
          Thank you for being part of our community and trusting us as your
          source of news and information.
        </p>
      </div>
    </div>
  );
}
