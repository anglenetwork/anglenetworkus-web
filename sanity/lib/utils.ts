// sanity/lib/utils.ts
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { isWhitelistedDomain as isWhitelistedDomainFromPolicy } from "@/lib/editorial-image/policy";
import { resolveListingImage } from "@/lib/editorial-image/resolve";
import type { EditorialImageInput } from "@/lib/editorial-image/resolve";

export {
  formatImageCredit,
  formatImageLicense,
  getImageAttribution,
  normalizeImageMeta,
  type ImageMetaInput,
} from "@/sanity/lib/image-attribution";
export { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/image-url";

/** Prefer `articleFamilyHref` from `@/app/lib/article-family/routes` in app code. */
export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/post/${slug}` : undefined;
    case "opinion":
      return slug ? `/opinion/${slug}` : undefined;
    case "analysis":
      return slug ? `/analysis/${slug}` : undefined;
    case "sponsored":
      return slug ? `/sponsored/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}

/**
 * Check if an external URL is from a whitelisted domain that can be optimized.
 * Wikimedia Commons is excluded (thumbnail API + always unoptimized).
 */
export function isWhitelistedDomain(url: string): boolean {
  return isWhitelistedDomainFromPolicy(url);
}

const DEFAULT_ALT_TEXT =
  "Catch up on the latest headlines and developing news.";

/**
 * Unified image helper for cover structure (supports both external URLs and Sanity assets)
 */
export function getCoverImage(
  cover:
    | {
        source?: "asset" | "external";
        externalUrl?: string | null;
        image?: SanityImageSource | null;
        alt?: string | null;
      }
    | null
    | undefined,
  fallbackAlt: string = "Image",
  maxWidth: number = 1200,
): { src: string; alt: string; unoptimized: boolean } | null {
  const resolved = resolveListingImage(
    cover as EditorialImageInput | null | undefined,
    fallbackAlt,
    maxWidth,
    DEFAULT_ALT_TEXT,
  );
  if (!resolved) return null;
  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
  };
}
