type GalleryPreviewSelection = {
  media?: unknown;
  externalUrl?: string | null;
  caption?: string | null;
  alt?: string | null;
  source?: "asset" | "external";
};

export type GalleryPreviewContext = {
  path?: unknown[];
  document?: {
    imageGallery?: Array<{
      source?: string;
      externalUrl?: string | null;
      image?: { asset?: { _ref?: string } };
    }>;
  };
};

export function resolveGalleryImageIndex(
  selection: GalleryPreviewSelection,
  context: GalleryPreviewContext,
): number | null {
  const path = context?.path;
  if (Array.isArray(path) && path.length >= 2 && typeof path[1] === "number") {
    return path[1] + 1;
  }

  const gallery = context?.document?.imageGallery;
  if (!Array.isArray(gallery)) {
    return null;
  }

  const { source, externalUrl, media } = selection;
  const index = gallery.findIndex((item) => {
    if (source === "external" && item?.source === "external") {
      return item?.externalUrl === externalUrl;
    }
    if (source === "asset" && item?.source === "asset") {
      const selectionAssetRef = (media as { asset?: { _ref?: string } })?.asset
        ?._ref;
      return item?.image?.asset?._ref === selectionAssetRef;
    }
    return false;
  });

  return index === -1 ? null : index + 1;
}

export function buildGalleryImagePreviewTitle(
  imageNumber: number | null,
  caption?: string | null,
  alt?: string | null,
): string {
  if (imageNumber !== null) {
    return `Image ${imageNumber}`;
  }

  return caption || alt || "Gallery Image";
}

export function buildGalleryImagePreviewSubtitle(
  source: GalleryPreviewSelection["source"],
  imageNumber: number | null,
  caption?: string | null,
): string | undefined {
  const subtitleParts = [
    source === "external" ? "External URL" : "Uploaded Asset",
    imageNumber !== null && caption ? caption : null,
  ].filter(Boolean);

  return subtitleParts.length > 0 ? subtitleParts.join(" • ") : undefined;
}
