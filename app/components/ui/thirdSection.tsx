"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  promoCtaButton,
  promoHeadline,
  promoHeadlineLine1,
  promoHeadlineLine2,
  promoHeadlineLine3,
} from "@/app/lib/typography/fifth-section";

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
    <div className="relative h-96 w-full overflow-hidden rounded-md bg-neutral-900">
      <StaticBackdrop />
      {showVideo ? (
        <video
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 h-full w-full object-cover"
          onError={() => setVideoFailed(true)}
        />
      ) : null}

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <h2 className={promoHeadline}>
          <span className={promoHeadlineLine1}>Your Message.</span>
          <span className={promoHeadlineLine2}>Our Audience.</span>
          <span className={promoHeadlineLine3}>Real Impact.</span>
        </h2>

        <Link href="/company/advertise-with-us" className={promoCtaButton}>
          Reach Our Audience
        </Link>
      </div>
    </div>
  );
}
