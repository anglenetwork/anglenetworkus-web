import { getWikimediaThumbnail } from "@/lib/image-optimization";
import { formatImageCredit, urlForImage } from "@/sanity/lib/utils";
import { DEFAULT_IMAGE_EPIGRAPH } from "./constants";
import type { ArticleImageSource, ResolvedArticleImage } from "./types";

type SanityImageWithAlt = {
  alt?: string | null;
  asset?: {
    _ref?: string;
  } | null;
};

interface BuildArticleImageOptions {
  fallbackAlt: string;
  sanityWidth?: number;
  sanityHeight?: number;
  sanityQuality?: number;
  sanityFit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  wikimediaWidth?: number;
  externalUnoptimized?: boolean | "auto";
}

function getSanityImage(image: unknown): SanityImageWithAlt | null {
  if (!image || typeof image !== "object") return null;
  return image as SanityImageWithAlt;
}

function hasSanityAsset(image: unknown): boolean {
  return Boolean(getSanityImage(image)?.asset?._ref);
}

export function normalizeExternalImageUrl(
  value: string | null | undefined,
): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const normalized = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : /^https?:\/\//.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  try {
    return new URL(normalized);
  } catch {
    return null;
  }
}

export function isWikimediaUrl(url: URL): boolean {
  return /(^|\.)upload\.wikimedia\.org$/.test(url.hostname);
}

function isWhitelistedExternalImage(url: URL): boolean {
  return ["images.unsplash.com", "cdn.sanity.io", "images.pexels.com"].includes(
    url.hostname,
  );
}

function shouldUnoptimizeExternal(url: URL, options: BuildArticleImageOptions) {
  if (isWikimediaUrl(url)) return true;
  if (options.externalUnoptimized === "auto") {
    return !isWhitelistedExternalImage(url);
  }
  return options.externalUnoptimized ?? false;
}

export function buildArticleImageData(
  input: ArticleImageSource | null | undefined,
  options: BuildArticleImageOptions,
): ResolvedArticleImage | null {
  if (!input) return null;

  const externalUrl = normalizeExternalImageUrl(input.externalUrl);
  const image = getSanityImage(input.image);
  const hasImageAsset = hasSanityAsset(image);

  if (!externalUrl && !hasImageAsset) {
    return null;
  }

  if (externalUrl && (input.source === "external" || !input.source)) {
    const isWikimedia = isWikimediaUrl(externalUrl);
    const src = isWikimedia
      ? getWikimediaThumbnail(externalUrl.toString(), options.wikimediaWidth)
      : externalUrl.toString();

    return {
      src,
      alt: input.alt || options.fallbackAlt,
      unoptimized: shouldUnoptimizeExternal(externalUrl, options),
      epigraph: input.epigraph,
      credit: formatImageCredit(input),
    };
  }

  if (
    hasImageAsset &&
    (input.source === "asset" || !input.source || !externalUrl)
  ) {
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
      if (!src) return null;

      return {
        src,
        alt: input.alt || image?.alt || options.fallbackAlt,
        unoptimized: false,
        epigraph: input.epigraph,
        credit: formatImageCredit(input),
      };
    } catch (error) {
      console.warn("Failed to build Sanity image URL:", error);
      return null;
    }
  }

  return null;
}

export function buildCoverImageData(
  cover: ArticleImageSource | null | undefined,
  title: string,
): ResolvedArticleImage | null {
  return buildArticleImageData(cover, {
    fallbackAlt: title || DEFAULT_IMAGE_EPIGRAPH,
    sanityQuality: 70,
    wikimediaWidth: 1200,
    externalUnoptimized: "auto",
  });
}

export function buildGalleryImageData(
  image: ArticleImageSource | null | undefined,
): ResolvedArticleImage | null {
  return buildArticleImageData(image, {
    fallbackAlt: "Gallery image",
    sanityQuality: 60,
    wikimediaWidth: 800,
    externalUnoptimized: false,
  });
}

export function buildBodyImageData(
  image: ArticleImageSource | null | undefined,
): ResolvedArticleImage | null {
  return buildArticleImageData(image, {
    fallbackAlt: "Body image",
    sanityWidth: 1200,
    sanityHeight: 675,
    sanityFit: "max",
    sanityQuality: 60,
    wikimediaWidth: 1200,
    externalUnoptimized: false,
  });
}

export function authorAvatarUrl(picture: unknown): string | null {
  if (!picture) return null;

  try {
    const url = urlForImage(picture as Parameters<typeof urlForImage>[0]);
    return url ? url.width(48).height(48).fit("crop").url() : null;
  } catch {
    return null;
  }
}
