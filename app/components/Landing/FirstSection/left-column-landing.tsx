import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { HOMEPAGE_JUST_IN_LIMIT } from "@/app/lib/homepage/first-section";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { resolveListingImage } from "@/lib/editorial-image";
import { ColMoreLink } from "./col-more-link";
import {
  justInCategoryLabel,
  justInHeadline,
  justInLabel,
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
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

function listingImageFromGallery(
  galleryImage: GalleryImage,
): JustInCarouselImage | null {
  const resolved = resolveListingImage(galleryImage, "Gallery image", 640);
  if (!resolved) return null;
  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
  };
}

function carouselImagesForPost(post: Post): JustInCarouselImage[] {
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

interface LeftColumnLandingProps {
  justInNews: Post[];
}

export function LeftColumnLanding({ justInNews }: LeftColumnLandingProps) {
  const articles = justInNews.slice(0, HOMEPAGE_JUST_IN_LIMIT);
  const leadCategory = articles[0]?.category;
  const moreHref = leadCategory?.slug ? `/category/${leadCategory.slug}` : null;
  const moreLabel = leadCategory?.title
    ? `More ${leadCategory.title} news`
    : null;

  return (
    <div className="flex h-full flex-col px-6 py-9 lg:py-10 lg:pr-8 lg:pl-0">
      <div>
        <div className="mb-6 flex items-center gap-2.5">
          <span
            className="block size-2 shrink-0 rounded-full border-2 border-angle-red"
            aria-hidden
          />
          <span className={justInLabel}>Just in</span>
        </div>

        <div className="flex flex-col">
          {articles.map((post, index) => {
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
                className="divider-dashed mt-[22px] pt-[22px] first:mt-0 first:bg-none first:pt-0"
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
                <Link href={`/post/${post.slug}`} className="group block">
                  {post.category?.title ? (
                    <span className={justInCategoryLabel}>
                      {post.category.title}
                    </span>
                  ) : null}
                  <h3 className={justInHeadline}>{post.title}</h3>
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      {moreHref && moreLabel ? (
        <ColMoreLink href={moreHref} label={moreLabel} />
      ) : null}
    </div>
  );
}
