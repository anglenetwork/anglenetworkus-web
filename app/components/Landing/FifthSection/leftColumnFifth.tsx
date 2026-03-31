import Link from "next/link";
import { SectionHeader } from "@/app/components/ui/section-header";

export function LeftColumnFifth() {
  const videoSrc =
    "https://videos.pexels.com/video-files/4622514/4622514-uhd_2560_1440_24fps.mp4";

  return (
    <div className="border-r border-gray-200 pr-6 pl-4">
      <div className="sticky top-6">
        <SectionHeader
          title="Partner with Us"
          variant="light"
          accentStyle="geometric-square"
          size="large"
        />
        <Link href="/company/advertise-with-us" className="block group">
          <div className="relative w-full h-96 overflow-hidden rounded-sm">
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
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight font-sans text-center">
                <div className="font-light text-xl">Your Message.</div>
                <div className="font-medium text-2xl">Our Audience.</div>
                <div className="font-bold text-4xl">Real Impact.</div>
              </h1>
              <button className="mt-6 px-6 py-3 border-2 border-white text-white bg-transparent hover:bg-white/10 transition-colors font-sans font-medium text-sm uppercase tracking-wide">
                Reach Our Audience
              </button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
