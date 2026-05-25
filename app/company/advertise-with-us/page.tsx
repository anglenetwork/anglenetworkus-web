import VideoBanner from "@/app/components/ui/video-banner";

export default function AdvertiseWithUsPage() {
  const videoSrc =
    "https://videos.pexels.com/video-files/4766149/4766149-uhd_2732_1440_24fps.mp4";

  return (
    <main className="relative z-0 flex min-h-screen flex-col items-center">
      <div className="relative z-0 h-screen w-full">
        {/* Background video */}
        <VideoBanner videoSrc={videoSrc} />

        {/* Centered contact/partnership text overlaid on video */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h1 className="font-sans text-5xl text-white leading-tight md:text-6xl lg:text-7xl">
              <div className="font-light text-4xl">Your Message.</div>
              <div className="font-medium text-5xl">Our Audience.</div>
              <div className="font-bold">Real Impact.</div>
            </h1>

            <p className="mx-auto max-w-2xl font-sans text-lg text-white leading-relaxed md:text-lg">
              Partner with us to put your brand in front of a highly engaged,
              news-driven audience. For advertising and sponsorship
              opportunities, get in touch:
            </p>

            <div className="pt-4">
              <a
                href="mailto:ads@yourdomain.com"
                className="inline-flex items-center gap-2 font-sans font-semibold text-2xl text-white transition-colors hover:text-white/80 md:text-3xl"
              >
                📩 ads@yourdomain.com
              </a>
            </div>
          </div>
        </div>

        {/* Video source attribution - bottom right */}
        <div className="absolute right-4 bottom-4 z-10">
          <p className="font-sans text-sm text-white/80">
            Video source:{" "}
            <a
              href="https://www.pexels.com/@kelly/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline transition-colors hover:text-white/80"
            >
              Kelly
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
