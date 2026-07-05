import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { HOMEPAGE_HERO_LCP_IMAGE } from "./hero-lcp-image";

export type PreloadHeroLcpImageOptions = {
  src: string | null | undefined;
  unoptimized: boolean;
};

/**
 * Preload the URL the browser requests for the homepage hero.
 * Unoptimized: direct CDN URL. Optimized: `/_next/image` (matches hero Image props).
 */
export function preloadHeroLcpImage({
  src,
  unoptimized,
}: PreloadHeroLcpImageOptions): void {
  const trimmed = src?.trim();
  if (!trimmed) return;

  if (unoptimized) {
    preload(trimmed, { as: "image", fetchPriority: "high" });
    return;
  }

  const { props: imageProps } = getImageProps({
    ...HOMEPAGE_HERO_LCP_IMAGE,
    alt: "",
    src: trimmed,
    priority: true,
  });

  preload(imageProps.src, { as: "image", fetchPriority: "high" });
}
