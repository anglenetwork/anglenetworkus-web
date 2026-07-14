"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Slash } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingPhotoCredit } from "@/app/helpers";
import { shouldRenderCarouselSlide } from "@/lib/carousel";
import { resolveListingImage } from "@/lib/editorial-image";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { categoryFeaturedTitle } from "@/app/lib/typography/second-section";
import { mostReadFeedSeeAllLink } from "@/app/lib/typography/fourth-section";
import { sectionHeaderLink } from "@/app/lib/typography/article-links";
import { minimalSectionTitle } from "@/app/lib/typography/section-header";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

export interface FeaturedStoryGalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: unknown;
  alt?: string | null;
  caption?: string | null;
  creditAuthor?: string | null;
  creditSource?: string | null;
}

export interface FeaturedStoryArticle {
  title: string;
  slug: string;
  href?: string;
  readTime?: number | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: unknown;
    alt?: string | null;
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
  imageGallery?: Array<FeaturedStoryGalleryImage> | null;
}

const DEFAULT_IMAGE_SIZES = "(max-width: 1024px) 100vw, 33vw";
const DEFAULT_IMAGE_ASPECT_CLASS_NAME = "aspect-[16/9]";

const featuredImageBaseClassName =
  "relative w-full overflow-hidden rounded-sm bg-news-secondary";

function ArticleImageCarousel({
  coverImage,
  galleryImages,
  articleHref,
  imageSizes,
  imageAspectClassName = DEFAULT_IMAGE_ASPECT_CLASS_NAME,
}: {
  coverImage: { src: string; alt: string; unoptimized: boolean } | null;
  galleryImages: Array<{ src: string; alt: string; unoptimized: boolean }>;
  articleHref: string;
  imageSizes: string;
  imageAspectClassName?: string;
}) {
  const allImages = [...(coverImage ? [coverImage] : []), ...galleryImages];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) return null;

  return (
    <Link
      href={articleHref}
      className="group block"
      aria-label="View featured article images"
    >
      <div className={cn(featuredImageBaseClassName, imageAspectClassName)}>
        {allImages.map((image, idx) => {
          if (!shouldRenderCarouselSlide(idx, currentIndex, allImages.length)) {
            return null;
          }

          return (
            <ImageRenderer
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={800}
              height={450}
              fill
              unoptimized={image.unoptimized}
              sizes={imageSizes}
              className={`absolute inset-0 object-cover object-center transition-opacity duration-500 ${
                idx === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            />
          );
        })}
        {allImages.length > 1 && (
          <div className="absolute right-3 bottom-3 z-20 flex gap-1.5">
            {allImages.map((image, idx) => (
              <button
                key={image.src}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function resolveArticleImages(
  article: FeaturedStoryArticle,
  coverMaxWidth?: number,
) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Featured article",
    coverMaxWidth,
  );
  const galleryMaxWidth = coverMaxWidth ?? 900;
  const galleryImagesData =
    article.imageGallery && Array.isArray(article.imageGallery)
      ? article.imageGallery
          .map((img) => {
            const resolved = resolveListingImage(
              img,
              "Gallery image",
              galleryMaxWidth,
            );
            if (!resolved) return null;
            return {
              src: resolved.src,
              alt: resolved.alt,
              unoptimized: resolved.unoptimized,
            };
          })
          .filter(
            (img): img is { src: string; alt: string; unoptimized: boolean } =>
              img !== null,
          )
      : [];
  const hasGalleryImages = galleryImagesData.length > 0;

  return { coverData, galleryImagesData, hasGalleryImages };
}

function TitleWithMoreHeader({
  title,
  href,
  variant = "news",
}: {
  title: string;
  href: string;
  variant?: "news" | "dark";
}) {
  const focusClass =
    variant === "news"
      ? "focus-visible:outline-news-primary"
      : "focus-visible:outline-news-primary";

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <Link
        href={href}
        className={cn(
          "group flex min-w-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          focusClass,
        )}
      >
        <Slash
          className={cn(
            "size-3.5 shrink-0",
            variant === "dark" ? "text-white" : "text-news-text",
          )}
          strokeWidth={3}
          aria-hidden
        />
        <h2 className={cn(minimalSectionTitle[variant], sectionHeaderLink)}>
          {title}
        </h2>
      </Link>
      <Link
        href={href}
        className={cn(
          "group flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          focusClass,
        )}
        aria-label={`More from ${title}`}
      >
        <span className={mostReadFeedSeeAllLink}>More</span>
        <span
          className="flex size-4 items-center justify-center rounded-full bg-news-primary text-white"
          aria-hidden
        >
          <ArrowUpRight className="size-3 stroke-[2.5]" />
        </span>
      </Link>
    </div>
  );
}

export function FeaturedStoryColumn({
  headerTitle,
  headerHref,
  article,
  variant = "news",
  imageSizes = DEFAULT_IMAGE_SIZES,
  headerLayout = "default",
  imageAspectClassName = DEFAULT_IMAGE_ASPECT_CLASS_NAME,
  /** Caps external CDN width (e.g. homepage sixth section). */
  coverMaxWidth,
}: {
  headerTitle: string;
  headerHref?: string;
  article: FeaturedStoryArticle;
  variant?: "news" | "dark";
  imageSizes?: string;
  headerLayout?: "default" | "title-with-more";
  imageAspectClassName?: string;
  coverMaxWidth?: number;
}) {
  const { coverData, galleryImagesData, hasGalleryImages } =
    resolveArticleImages(article, coverMaxWidth);
  const articleHref = article.href ?? `/post/${article.slug}`;

  const header =
    headerLayout === "title-with-more" && headerHref ? (
      <TitleWithMoreHeader
        title={headerTitle}
        href={headerHref}
        variant={variant}
      />
    ) : (
      <SectionHeader
        title={headerTitle}
        href={headerHref}
        variant={variant}
        accentStyle="minimal"
      />
    );

  return (
    <>
      {header}

      <div>
        {hasGalleryImages ? (
          <ArticleImageCarousel
            coverImage={coverData}
            galleryImages={galleryImagesData}
            articleHref={articleHref}
            imageSizes={imageSizes}
            imageAspectClassName={imageAspectClassName}
          />
        ) : coverData?.src ? (
          <Link
            href={articleHref}
            className="group block"
            aria-label={`Read article: ${article.title}`}
          >
            <div
              className={cn(featuredImageBaseClassName, imageAspectClassName)}
            >
              <ImageRenderer
                src={coverData.src}
                alt={coverData.alt}
                width={800}
                height={450}
                fill
                unoptimized={coverData.unoptimized}
                sizes={imageSizes}
                className="object-cover object-center"
              />
            </div>
          </Link>
        ) : null}

        <ListingPhotoCredit
          cover={
            article.cover as Parameters<typeof ListingPhotoCredit>[0]["cover"]
          }
          align="right"
        />

        <Link href={articleHref} className="group block">
          <h3 className={cn("mt-4", categoryFeaturedTitle[variant])}>
            {article.title}
          </h3>
        </Link>
        <ReadTimeLabel minutes={article.readTime} variant={variant} />
      </div>
    </>
  );
}
