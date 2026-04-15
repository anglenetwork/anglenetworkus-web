"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const VIDEO_SRC =
  "https://videos.pexels.com/video-files/4622514/4622514-uhd_2560_1440_24fps.mp4";

/** Static gradient fallback when video fails or motion is reduced. */
function StaticBackdrop() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black"
      aria-hidden
    />
  );
}

export function ThirdSection() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showVideo = !reduceMotion && !videoFailed;

  return (
    <div className="px-4 md:px-0">
      <div className="relative h-96 w-full overflow-hidden rounded-md bg-neutral-900">
        <StaticBackdrop />
        {showVideo ? (
          <video
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 h-full w-full object-cover"
            onError={() => setVideoFailed(true)}
          />
        ) : null}

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
          <h2 className="text-center font-sans leading-tight text-white">
            <span className="block text-lg font-light md:text-xl">
              Your Message.
            </span>
            <span className="mt-2 block text-2xl font-medium md:text-4xl">
              Our Audience.
            </span>
            <span className="mt-2 block text-4xl font-bold md:text-5xl lg:text-6xl">
              Real Impact.
            </span>
          </h2>

          <Link
            href="/company/advertise-with-us"
            className="mt-6 inline-flex items-center rounded border-2 border-white bg-transparent px-6 py-3 font-sans text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Reach Our Audience
          </Link>
        </div>
      </div>
    </div>
  );
}
