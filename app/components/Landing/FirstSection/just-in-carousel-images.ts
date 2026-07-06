import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { resolveListingImage } from "@/lib/editorial-image";
import type { JustInCarouselImage } from "./just-in-image-carousel";

export interface JustInGalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: SanityImageSource | null;
  alt?: string | null;
}

export interface JustInCarouselPost {
  title: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: SanityImageSource | null;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
  imageGallery?: JustInGalleryImage[] | null;
}

function listingImageFromGallery(
  galleryImage: JustInGalleryImage,
): JustInCarouselImage | null {
  const resolved = resolveListingImage(galleryImage, "Gallery image", 640);
  if (!resolved) return null;
  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
  };
}

export function carouselImagesForPost(
  post: JustInCarouselPost,
): JustInCarouselImage[] {
  const coverData = getHomepageCoverImage(
    "heroRail",
    post.cover,
    post.title || "Article image",
  );
  const galleryImages =
    post.imageGallery && Array.isArray(post.imageGallery)
      ? post.imageGallery
          .map((img) => listingImageFromGallery(img))
          .filter((img): img is JustInCarouselImage => img !== null)
      : [];

  const images: JustInCarouselImage[] = [];
  if (coverData?.src) {
    images.push({
      src: coverData.src,
      alt: coverData.alt,
      unoptimized: coverData.unoptimized,
    });
  }
  images.push(...galleryImages);
  return images;
}
