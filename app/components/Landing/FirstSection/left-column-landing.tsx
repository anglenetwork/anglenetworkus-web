import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { resolveListingImage } from "@/lib/editorial-image";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import {
  justInPrimaryTitle,
  justInSecondaryTitle,
} from "@/app/lib/typography/first-section";
import type { JustInCarouselImage } from "./just-in-image-carousel";
import { JustInCarouselLoader } from "./just-in-carousel-loader";
import { JustInStaticImage } from "./just-in-static-image";

interface GalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: SanityImageSource | null;
  alt?: string | null;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: SanityImageSource | null;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
  imageGallery?: GalleryImage[] | null;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
}

function listingImageFromGallery(galleryImage: GalleryImage): JustInCarouselImage | null {
  const resolved = resolveListingImage(galleryImage, "Gallery image", 1200);
  if (!resolved) return null;
  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
  };
}

function carouselImagesForPost(post: Post): JustInCarouselImage[] {
  const coverData = getCoverImage(post.cover, post.title || "Article image");
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

interface LeftColumnLandingProps {
  justInNews: Post[];
}

export function LeftColumnLanding({ justInNews }: LeftColumnLandingProps) {
  return (
    <div className="px-0 text-left md:px-4 lg:sticky lg:top-20 lg:h-auto lg:overflow-hidden">
      <SectionHeader
        title="Just in"
        variant="light"
        accentStyle="geometric-square"
        size="large"
      />

      <div className="space-y-6">
        {justInNews.map((post, index) => {
          const isFirstArticle = index === 0;
          const carouselImages = isFirstArticle
            ? carouselImagesForPost(post)
            : [];
          const showCarousel = isFirstArticle && carouselImages.length > 1;
          const showStaticImage =
            isFirstArticle && carouselImages.length === 1;

          return (
            <article
              key={post._id}
              className={`${index < justInNews.length - 1 ? "border-neutral-200 border-b" : ""} pb-4`}
            >
              {showCarousel ? (
                <JustInCarouselLoader
                  images={carouselImages}
                  postSlug={post.slug}
                  breakingNews={post.breakingNews}
                  developingStory={post.developingStory}
                />
              ) : showStaticImage ? (
                <JustInStaticImage
                  image={carouselImages[0]}
                  postSlug={post.slug}
                  breakingNews={post.breakingNews}
                  developingStory={post.developingStory}
                />
              ) : null}
              <Link href={`/post/${post.slug}`} className="hover:text-red-600">
                <h3
                  className={
                    isFirstArticle ? justInPrimaryTitle : justInSecondaryTitle
                  }
                >
                  {post.title}
                </h3>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
