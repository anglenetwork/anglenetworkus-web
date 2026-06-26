import { getWikimediaThumbnail } from "@/lib/image-optimization";
import {
  formatImageCredit,
  formatImageLicense,
  normalizeImageMeta,
  type ImageMetaInput,
} from "@/sanity/lib/image-attribution";
import { urlForImage } from "@/sanity/lib/image-url";
import {
  clampOptimizableExternalUrl,
  normalizeExternalImageUrl,
} from "./normalize";
import { isWikimediaUrl, shouldUnoptimizeExternalUrl } from "./policy";

export type EditorialImageInput = {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: unknown;
  alt?: string | null;
  lqip?: string | null;
} & ImageMetaInput;

type SanityImageWithAlt = {
  alt?: string | null;
  asset?: {
    _ref?: string;
  } | null;
};

export type ResolveEditorialImageOptions = {
  fallbackAlt: string;
  maxWidth?: number;
  defaultAlt?: string;
  sanityQuality?: number;
  sanityWidth?: number;
  sanityHeight?: number;
  sanityFit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  wikimediaWidth?: number;
  externalUnoptimized?: boolean | "auto";
  includeAttribution?: boolean;
};

export type ResolvedEditorialImage = {
  src: string;
  alt: string;
  unoptimized: boolean;
  blurDataURL?: string | null;
  caption?: string | null;
  credit?: string | null;
  licenseOrRights?: string | null;
};

function getSanityLqip(input: EditorialImageInput): string | null {
  const lqip = input.lqip?.trim();
  return lqip || null;
}

function getSanityImage(image: unknown): SanityImageWithAlt | null {
  if (!image || typeof image !== "object") return null;
  return image as SanityImageWithAlt;
}

function hasSanityAsset(image: unknown): boolean {
  return Boolean(getSanityImage(image)?.asset?._ref);
}

function resolveAlt(
  input: EditorialImageInput,
  image: SanityImageWithAlt | null,
  options: ResolveEditorialImageOptions,
): string {
  const trimmed = input.alt?.trim();
  if (trimmed) return trimmed;
  const imageAlt = image?.alt?.trim();
  if (imageAlt) return imageAlt;
  if (options.defaultAlt) return options.defaultAlt;
  return options.fallbackAlt;
}

function attachAttribution(
  result: ResolvedEditorialImage,
  input: EditorialImageInput,
  includeAttribution: boolean,
): ResolvedEditorialImage {
  if (!includeAttribution) return result;
  const meta = normalizeImageMeta(input);
  return {
    ...result,
    caption: meta.caption,
    credit: formatImageCredit(input),
    licenseOrRights: formatImageLicense(input),
  };
}

function resolveExternalEditorialImage(
  input: EditorialImageInput,
  image: SanityImageWithAlt | null,
  externalUrl: URL,
  options: ResolveEditorialImageOptions,
): ResolvedEditorialImage {
  const wikimediaWidth = options.wikimediaWidth ?? options.maxWidth ?? 1200;
  const externalPolicy = options.externalUnoptimized ?? "auto";
  const includeAttribution = options.includeAttribution ?? false;
  const listingWidth = options.maxWidth ?? 1200;
  const src = isWikimediaUrl(externalUrl)
    ? getWikimediaThumbnail(externalUrl.toString(), wikimediaWidth)
    : clampOptimizableExternalUrl(externalUrl, listingWidth).toString();

  const result: ResolvedEditorialImage = {
    src,
    alt: resolveAlt(input, image, options),
    unoptimized: shouldUnoptimizeExternalUrl(externalUrl, externalPolicy),
  };
  return attachAttribution(result, input, includeAttribution);
}

function resolveSanityAssetEditorialImage(
  input: EditorialImageInput,
  image: SanityImageWithAlt,
  options: ResolveEditorialImageOptions,
): ResolvedEditorialImage | null {
  const includeAttribution = options.includeAttribution ?? false;
  const builder = urlForImage(image as Parameters<typeof urlForImage>[0]);
  if (!builder) return null;

  try {
    let urlBuilder = builder.quality(options.sanityQuality ?? 60);
    if (options.sanityWidth) {
      urlBuilder = urlBuilder.width(options.sanityWidth);
    }
    if (options.sanityHeight) {
      urlBuilder = urlBuilder.height(options.sanityHeight);
    }
    if (options.sanityFit) {
      urlBuilder = urlBuilder.fit(options.sanityFit);
    }

    const src = urlBuilder.url();
    if (
      !src ||
      src.length === 0 ||
      (!src.includes("cdn.sanity.io") && !src.startsWith("/"))
    ) {
      return null;
    }

    const result: ResolvedEditorialImage = {
      src,
      alt: resolveAlt(input, image, options),
      unoptimized: false,
      blurDataURL: getSanityLqip(input),
    };
    return attachAttribution(result, input, includeAttribution);
  } catch (error) {
    console.warn("Failed to build Sanity image URL:", error);
    return null;
  }
}

export function resolveEditorialImage(
  input: EditorialImageInput | null | undefined,
  options: ResolveEditorialImageOptions,
): ResolvedEditorialImage | null {
  if (
    !input ||
    (typeof input === "object" && Object.keys(input).length === 0)
  ) {
    return null;
  }

  const externalUrl = normalizeExternalImageUrl(input.externalUrl);
  const image = getSanityImage(input.image);
  const hasImageAsset = hasSanityAsset(image);
  const hasExternalUrl = Boolean(externalUrl);

  if (!hasExternalUrl && !hasImageAsset) {
    return null;
  }

  if (externalUrl && (input.source === "external" || !input.source)) {
    return resolveExternalEditorialImage(input, image, externalUrl, options);
  }

  if (
    hasImageAsset &&
    image &&
    (input.source === "asset" || !input.source || !hasExternalUrl)
  ) {
    return resolveSanityAssetEditorialImage(input, image, options);
  }

  return null;
}

/** Listing / carousel preset matching legacy `getCoverImage`. */
const LISTING_IMAGE_RESOLVE_OPTIONS = {
  externalUnoptimized: "auto" as const,
  sanityQuality: 70,
};

export function resolveListingImage(
  input: EditorialImageInput | null | undefined,
  fallbackAlt: string,
  maxWidth: number = 1200,
  defaultAlt?: string,
): ResolvedEditorialImage | null {
  return resolveEditorialImage(input, {
    fallbackAlt,
    maxWidth,
    defaultAlt,
    wikimediaWidth: maxWidth,
    includeAttribution: false,
    ...LISTING_IMAGE_RESOLVE_OPTIONS,
  });
}
