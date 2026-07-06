"use client";

import dynamic from "next/dynamic";
import type { JustInCarouselImage } from "./just-in-image-carousel";

const JustInImageCarousel = dynamic(
  () =>
    import("./just-in-image-carousel").then((mod) => ({
      default: mod.JustInImageCarousel,
    })),
  { ssr: false },
);

type JustInCarouselLoaderProps = {
  images: JustInCarouselImage[];
  postSlug: string;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
  imageAspectClassName?: string;
  imageSizes?: string;
  className?: string;
};

export function JustInCarouselLoader(props: JustInCarouselLoaderProps) {
  return <JustInImageCarousel {...props} />;
}
