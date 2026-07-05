import { preload } from "react-dom";

export type PreloadHeroLcpImageOptions = {
  src: string | null | undefined;
  unoptimized: boolean;
};

/**
 * Preload direct (unoptimized) hero URLs — e.g. Wikimedia thumbs.
 * Optimized Unsplash/Sanity heroes use `priority` on `ImageRenderer`; do not
 * preload the raw CDN URL (that competes with `/_next/image` and hurts LCP).
 */
export function preloadHeroLcpImage({
  src,
  unoptimized,
}: PreloadHeroLcpImageOptions): void {
  if (!unoptimized) return;

  const trimmed = src?.trim();
  if (!trimmed) return;

  preload(trimmed, { as: "image", fetchPriority: "high" });
}
