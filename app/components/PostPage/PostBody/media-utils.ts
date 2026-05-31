import { resolveEditorialImage } from "@/lib/editorial-image";
import { urlForImage } from "@/sanity/lib/image-url";
import { DEFAULT_IMAGE_CAPTION } from "./constants";
import type { ArticleImageSource, ResolvedArticleImage } from "./types";

interface BuildArticleImageOptions {
  fallbackAlt: string;
  sanityWidth?: number;
  sanityHeight?: number;
  sanityQuality?: number;
  sanityFit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  wikimediaWidth?: number;
  externalUnoptimized?: boolean | "auto";
}

export function buildArticleImageData(
  input: ArticleImageSource | null | undefined,
  options: BuildArticleImageOptions,
): ResolvedArticleImage | null {
  const resolved = resolveEditorialImage(input, {
    fallbackAlt: options.fallbackAlt,
    sanityWidth: options.sanityWidth,
    sanityHeight: options.sanityHeight,
    sanityQuality: options.sanityQuality,
    sanityFit: options.sanityFit,
    wikimediaWidth: options.wikimediaWidth,
    externalUnoptimized: options.externalUnoptimized,
    includeAttribution: true,
  });

  if (!resolved) return null;

  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
    blurDataURL: resolved.blurDataURL,
    caption: resolved.caption,
    credit: resolved.credit,
    licenseOrRights: resolved.licenseOrRights,
  };
}

export function buildCoverImageData(
  cover: ArticleImageSource | null | undefined,
  title: string,
): ResolvedArticleImage | null {
  return buildArticleImageData(cover, {
    fallbackAlt: title || DEFAULT_IMAGE_CAPTION,
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
