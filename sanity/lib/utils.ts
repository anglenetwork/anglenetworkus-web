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
