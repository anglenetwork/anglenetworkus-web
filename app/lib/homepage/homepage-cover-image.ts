import { getCoverImage } from "@/sanity/lib/utils";

/**
 * Max source widths for homepage cover slots (2× largest CSS display width).
 * Keeps external CDN requests small while leaving room for retina.
 */
export const HOMEPAGE_COVER_MAX_WIDTH = {
  /** Main headline hero (~720px display). */
  heroMain: 800,
  /** Just In / frontline rails (~300–640px display). */
  heroRail: 640,
  /** Right-rail side story thumbs. */
  heroSide: 400,
  /** Compact right-rail rows (~112px display). */
  heroCompact: 256,
  /** Second / fourth section lead card (~33vw, max ~640px). */
  sectionFeatured: 640,
  /** Small listing thumb (~112px display). */
  sectionThumb: 224,
  /** Fifth-section left featured column (wider aspect). */
  fifthFeatured: 960,
  /** Seventh-section carousel tile (300px card). */
  carouselTile: 600,
} as const;

export type HomepageCoverSlot = keyof typeof HOMEPAGE_COVER_MAX_WIDTH;

type CoverInput = Parameters<typeof getCoverImage>[0];

/** Resolve a homepage cover with slot-appropriate max width for CDN/thumbnail requests. */
export function getHomepageCoverImage(
  slot: HomepageCoverSlot,
  cover: CoverInput,
  fallbackAlt: string,
) {
  return getCoverImage(cover, fallbackAlt, HOMEPAGE_COVER_MAX_WIDTH[slot]);
}
