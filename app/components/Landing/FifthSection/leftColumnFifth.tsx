"use client";

import Link from "next/link";
import { LazyBackgroundVideo } from "@/app/components/ui/lazy-background-video";
import { PROMO_VIDEO_SRC } from "@/lib/pexels-video";
import { SectionHeader } from "@/app/components/ui/section-header";

export function LeftColumnFifth() {
  return (
    <div className="border-gray-200 border-r pr-6 pl-4">
      <div className="sticky top-6">
        <SectionHeader
          title="Partner with Us"
          variant="light"
          accentStyle="geometric-square"
          size="large"
        />
        <Link href="/company/advertise-with-us" className="group block">
          <div className="relative h-96 w-full overflow-hidden rounded-sm">
            <LazyBackgroundVideo
              videoSrc={PROMO_VIDEO_SRC}
              loadStrategy="viewport"
            />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/50" />
            {/* Text overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
              <h1 className="text-center font-sans text-5xl text-white leading-tight md:text-6xl lg:text-7xl">
                <div className="font-light text-xl">Your Message.</div>
                <div className="font-medium text-2xl">Our Audience.</div>
                <div className="font-bold text-4xl">Real Impact.</div>
              </h1>
              <button
                type="button"
                className="mt-6 border-2 border-white bg-transparent px-6 py-3 font-medium font-sans text-sm text-white uppercase tracking-wide transition-colors hover:bg-white/10"
              >
                Reach Our Audience
              </button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
