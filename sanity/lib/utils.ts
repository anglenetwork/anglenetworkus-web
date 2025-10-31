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
 * Unified image helper for cover structure (supports both external URLs and Sanity assets)
 * @param cover - The cover object with source, externalUrl, image, and alt
 * @param fallbackAlt - Fallback alt text if cover.alt is not available
 * @returns Object with src, alt, and unoptimized flag, or null if no image is available
 */
export function getCoverImage(
  cover: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: SanityImageSource | null;
    alt?: string | null;
  } | null | undefined,
  fallbackAlt: string = "Image"
): { src: string; alt: string; unoptimized: boolean } | null {
  if (!cover || (typeof cover === 'object' && Object.keys(cover).length === 0)) {
    return null;
  }

  // 1) External URL takes priority if source is external OR if externalUrl exists (fallback for missing source)
  if (cover.externalUrl && (cover.source === "external" || !cover.source)) {
    return {
      src: cover.externalUrl,
      alt: cover.alt || fallbackAlt,
      unoptimized: true, // External URLs need to be unoptimized unless whitelisted in next.config
    };
  }

  // 2) Asset image - check if source is asset OR if image exists (fallback for missing source)
  if (cover.image && (cover.source === "asset" || !cover.source || !cover.externalUrl)) {
    const imageUrl = urlForImage(cover.image);
    if (imageUrl) {
      return {
        src: imageUrl.url(),
        alt: cover.alt || (cover.image as any)?.alt || fallbackAlt,
        unoptimized: false,
      };
    }
  }

  return null;
}
