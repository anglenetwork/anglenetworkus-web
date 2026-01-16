// sanity/lib/utils.ts
import createImageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

/** Returns an image builder or null if the source is missing/invalid */
export function urlForImage(
  source: SanityImageSource | null | undefined
): ImageUrlBuilder | null {
  // Only build if we have a ref-bearing image object (most common case)
  if (!source || !(source as any)?.asset?._ref) return null;
  return imageBuilder.image(source).auto("format").fit("max");
}

export function resolveOpenGraphImage(
  image: SanityImageSource | null | undefined,
  width = 1200,
  height = 627
) {
  const builder = urlForImage(image);
  if (!builder) return;
  const url = builder.width(width).height(height).fit("crop").url();
  return { url, alt: (image as any)?.alt as string | undefined, width, height };
}

export function resolveHref(
  documentType?: string,
  slug?: string
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/posts/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}

/**
 * Check if an external URL is from a whitelisted domain that can be optimized
 * Note: Wikimedia Commons is excluded due to rate limiting (429 errors)
 * Their images are already optimized and served via CDN, so no need to optimize again
 */
export function isWhitelistedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const whitelistedDomains = [
      'images.unsplash.com',
      'cdn.sanity.io',
      'images.pexels.com', // Allow Next.js to optimize Pexels images
      // 'upload.wikimedia.org' - Use thumbnail API instead (handled in getCoverImage)
    ];
    return whitelistedDomains.some(domain => urlObj.hostname === domain);
  } catch {
    return false;
  }
}

/**
 * Unified image helper for cover structure (supports both external URLs and Sanity assets)
 * @param cover - The cover object with source, externalUrl, image, and alt
 * @param fallbackAlt - Fallback alt text if cover.alt is not available
 * @returns Object with src, alt, and unoptimized flag, or null if no image is available
 */
const DEFAULT_ALT_TEXT = "Catch up on the latest headlines and developing news.";

export function getCoverImage(
  cover: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: SanityImageSource | null;
    alt?: string | null;
  } | null | undefined,
  fallbackAlt: string = "Image",
  maxWidth: number = 1200
): { src: string; alt: string; unoptimized: boolean } | null {
  if (!cover || (typeof cover === 'object' && Object.keys(cover).length === 0)) {
    return null;
  }

  // Check if cover has actual image data
  const hasExternalUrl = cover.externalUrl && cover.externalUrl.trim() !== "";
  const hasImageAsset = cover.image && (cover.image as any)?.asset?._ref;
  
  if (!hasExternalUrl && !hasImageAsset) {
    return null;
  }

  // 1) External URL takes priority if source is external OR if externalUrl exists (fallback for missing source)
  if (hasExternalUrl && (cover.source === "external" || !cover.source)) {
    let externalUrl = cover.externalUrl!.trim();
    
    // Ensure URL has protocol (fixes //cdn.sanity.io/... issues)
    if (externalUrl.startsWith("//")) {
      externalUrl = `https:${externalUrl}`;
    } else if (!externalUrl.match(/^https?:\/\//)) {
      // If no protocol at all, assume https
      externalUrl = `https://${externalUrl}`;
    }
    
    // Validate URL format
    try {
      new URL(externalUrl);
    } catch {
      // Invalid URL format, return null
      return null;
    }
    
    // Check if it's Wikimedia Commons - use thumbnail API to get optimized sizes
    const isWikimedia = /(^|\.)upload\.wikimedia\.org$/.test(new URL(externalUrl).hostname);
    const altText = cover.alt?.trim() || DEFAULT_ALT_TEXT;
    if (isWikimedia) {
      // Import dynamically to avoid circular dependencies
      const { getWikimediaThumbnail } = require("@/lib/image-optimization");
      // Use thumbnail API to get appropriately sized images based on display size
      // This dramatically reduces file size (e.g., 101MB -> ~500KB for 1200px, ~50KB for 200px)
      const optimizedUrl = getWikimediaThumbnail(externalUrl, maxWidth);
      return {
        src: optimizedUrl,
        alt: altText,
        unoptimized: true, // Always unoptimize Wikimedia to avoid 429 rate limit errors
      };
    }
    
    // Allow optimization for whitelisted domains to enable proper caching
    const canOptimize = isWhitelistedDomain(externalUrl);
    return {
      src: externalUrl,
      alt: altText,
      unoptimized: !canOptimize, // Only unoptimize if domain is not whitelisted
    };
  }

  // 2) Asset image - check if source is asset OR if image exists (fallback for missing source)
  if (hasImageAsset && (cover.source === "asset" || !cover.source || !hasExternalUrl)) {
    const imageUrl = urlForImage(cover.image);
    if (imageUrl) {
      try {
        const url = imageUrl.quality(70).url();
        // Validate the URL is not empty and looks like a valid Sanity CDN URL
        if (url && url.length > 0 && (url.includes('cdn.sanity.io') || url.startsWith('/'))) {
          const altText = cover.alt?.trim() || (cover.image as any)?.alt?.trim() || DEFAULT_ALT_TEXT;
          return {
            src: url,
            alt: altText,
            unoptimized: false,
          };
        }
      } catch (error) {
        // If URL building fails, return null
        console.warn('Failed to build Sanity image URL:', error);
        return null;
      }
    }
  }

  return null;
}

/**
 * Formats image credit/attribution using minimal structured fields
 */
export function formatImageCredit(cover: {
  creditProvider?: string | null;
  creditAuthor?: string | null;
  creditSourceUrl?: string | null;
  creditLicense?: string | null;
  [key: string]: any; // Allow additional properties
} | null | undefined): string | null {
  if (!cover) return null;

  // Build credit line if we have any attribution data
  if (cover.creditProvider || cover.creditAuthor || cover.creditLicense) {
    const parts: string[] = ["Photo"];

    // Author
    if (cover.creditAuthor) {
      parts.push(`by ${cover.creditAuthor}`);
    }

    // Provider/Source
    if (cover.creditProvider) {
      parts.push(`via ${cover.creditProvider}`);
    }

    // License (in parentheses)
    if (cover.creditLicense) {
      parts.push(`(${cover.creditLicense})`);
    }

    if (parts.length > 1) {
      return parts.join(" ");
    }
  }

  return null;
}
