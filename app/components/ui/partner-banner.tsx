import Link from "next/link";

export function PartnerBanner() {
  const videoSrc =
    "https://videos.pexels.com/video-files/4622514/4622514-uhd_2560_1440_24fps.mp4";

  return (
    <div className="px-4 md:px-0">
      <div className="relative w-full h-96 overflow-hidden rounded-md">
        {/* Background Video */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <h1 className="text-white text-center leading-tight font-sans">
            <div className="font-light text-lg md:text-xl">Your Message.</div>
            <div className="font-medium text-2xl md:text-4xl mt-2">
              Our Audience.
            </div>
            <div className="font-bold text-4xl md:text-5xl lg:text-6xl mt-2">
              Real Impact.
            </div>
          </h1>

          {/* CTA Button */}
          <Link href="/company/advertise-with-us">
            <button className="mt-6 px-6 py-3 border-2 border-white text-white bg-transparent hover:bg-white/10 transition-colors font-sans font-medium text-sm uppercase tracking-wide rounded">
              Reach Our Audience
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
