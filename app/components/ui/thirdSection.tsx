"use client";

import Link from "next/link";
import { LazyBackgroundVideo } from "@/app/components/ui/lazy-background-video";
import { PROMO_VIDEO_SRC } from "@/lib/pexels-video";
import {
  promoCtaButton,
  promoHeadline,
  promoHeadlineLine1,
  promoHeadlineLine2,
  promoHeadlineLine3,
} from "@/app/lib/typography/fifth-section";

export function ThirdSection() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-md bg-neutral-900">
      <LazyBackgroundVideo videoSrc={PROMO_VIDEO_SRC} loadStrategy="viewport" />

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
