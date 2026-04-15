import VideoBanner from "@/app/components/ui/video-banner";

export default function AdvertiseWithUsPage() {
  const videoSrc =
    "https://videos.pexels.com/video-files/4766149/4766149-uhd_2732_1440_24fps.mp4";

  return (
    <main className="flex min-h-screen flex-col items-center relative z-0">
      <div className="relative w-full h-screen z-0">
        {/* Background video */}
        <VideoBanner videoSrc={videoSrc} />

        {/* Centered contact/partnership text overlaid on video */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight font-sans">
              <div className="font-light text-4xl">Your Message.</div>
              <div className="font-medium text-5xl">Our Audience.</div>
              <div className="font-bold">Real Impact.</div>
            </h1>

            <p className="text-lg md:text-lg text-white leading-relaxed max-w-2xl mx-auto font-sans">
              Partner with us to put your brand in front of a highly engaged,
              news-driven audience. For advertising and sponsorship
              opportunities, get in touch:
            </p>

            <div className="pt-4">
              <a
                href="mailto:ads@yourdomain.com"
                className="inline-flex items-center gap-2 text-2xl md:text-3xl font-semibold text-white hover:text-white/80 transition-colors font-sans"
              >
                📩 ads@yourdomain.com
              </a>
            </div>
          </div>
        </div>

        {/* Video source attribution - bottom right */}
        <div className="absolute bottom-4 right-4 z-10">
          <p className="text-sm text-white/80 font-sans">
            Video source:{" "}
            <a
              href="https://www.pexels.com/@kelly/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              Kelly
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
