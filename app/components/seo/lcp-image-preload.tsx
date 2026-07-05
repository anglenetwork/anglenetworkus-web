import {
  preloadHeroLcpImage,
  type PreloadHeroLcpImageOptions,
} from "@/app/lib/homepage/preload-hero-lcp-image";

export type LcpImagePreloadProps = PreloadHeroLcpImageOptions;

/** Server render hook: preloads the homepage hero LCP image URL. */
export function LcpImagePreload(props: LcpImagePreloadProps) {
  preloadHeroLcpImage(props);
  return null;
}
