"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingPhotoCredit } from "@/app/helpers";
import { shouldRenderCarouselSlide } from "@/lib/carousel";
import { resolveListingImage } from "@/lib/editorial-image";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import { categoryFeaturedTitle } from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface GalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: any;
  alt?: string | null;
  caption?: string | null;
  creditAuthor?: string | null;
  creditSource?: string | null;
}

interface Article {
  title: string;
  slug: string;
  readTime?: number | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
  imageGallery?: Array<GalleryImage> | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface SixthSectionProps {
  leftArticle: Article;
  centerArticle: Article;
  rightArticle: Article;
  variant?: "news" | "dark";
}

const featuredImageSizes = "(max-width: 1024px) 100vw, 33vw";

const featuredImageClassName =
  "relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary";

function listingGalleryImage(galleryImage: GalleryImage): {
  src: string;
  alt: string;
  unoptimized: boolean;
} | null {
  const resolved = resolveListingImage(galleryImage, "Gallery image", 900);
  if (!resolved) return null;
  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
  };
}

function ArticleImageCarousel({
  coverImage,
  galleryImages,
  postSlug,
}: {
  coverImage: { src: string; alt: string; unoptimized: boolean } | null;
  galleryImages: Array<{ src: string; alt: string; unoptimized: boolean }>;
  postSlug: string;
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
      href={`/post/${postSlug}`}
      className="group block"
      aria-label="View featured article images"
    >
      <div className={featuredImageClassName}>
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
              sizes={featuredImageSizes}
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

function resolveArticleImages(article: Article) {
  const coverData = getCoverImage(
    article.cover,
    article.title || "Featured article",
  );
  const galleryImagesData =
    article.imageGallery && Array.isArray(article.imageGallery)
      ? article.imageGallery
          .map((img) => listingGalleryImage(img))
          .filter(
            (img): img is { src: string; alt: string; unoptimized: boolean } =>
              img !== null,
          )
      : [];
  const hasGalleryImages = galleryImagesData.length > 0;

  return { coverData, galleryImagesData, hasGalleryImages };
}

function FeaturedColumn({
  article,
  variant = "news",
}: {
  article: Article;
  variant?: "news" | "dark";
}) {
  const { coverData, galleryImagesData, hasGalleryImages } =
    resolveArticleImages(article);

  const categoryTitle = article.category?.title || "More Top Headlines";
  const categoryHref = article.category?.slug
    ? `/category/${article.category.slug}`
    : undefined;

  return (
    <>
      <SectionHeader
        title={categoryTitle}
        href={categoryHref}
        variant={variant}
        accentStyle="modern"
      />

      <div>
        {hasGalleryImages ? (
          <ArticleImageCarousel
            coverImage={coverData}
            galleryImages={galleryImagesData}
            postSlug={article.slug}
          />
        ) : coverData?.src ? (
          <Link
            href={`/post/${article.slug}`}
            className="group block"
            aria-label={`Read article: ${article.title}`}
          >
            <div className={featuredImageClassName}>
              <ImageRenderer
                src={coverData.src}
                alt={coverData.alt}
                width={800}
                height={450}
                fill
                unoptimized={coverData.unoptimized}
                sizes={featuredImageSizes}
                className="object-cover object-center"
              />
            </div>
          </Link>
        ) : null}

        <ListingPhotoCredit cover={article.cover} align="right" />

        <Link href={`/post/${article.slug}`} className="group block">
          <h3 className={cn("mt-4", categoryFeaturedTitle[variant])}>
            {article.title}
          </h3>
        </Link>
        <ReadTimeLabel minutes={article.readTime} variant={variant} />
      </div>
    </>
  );
}

export default function SixthSection({
  leftArticle,
  centerArticle,
  rightArticle,
  variant = "news",
}: SixthSectionProps) {
  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";

  return (
    <main
      className={cn(
        "rounded-lg",
        variant === "dark" ? "bg-news-secondary" : "bg-news-surface",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-dotted lg:grid-cols-3 lg:divide-x lg:divide-y-0",
          divideClass,
        )}
      >
        {[leftArticle, centerArticle, rightArticle].map((article) => (
          <article
            key={article.slug}
            className="space-y-4 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
          >
            <FeaturedColumn article={article} variant={variant} />
          </article>
        ))}
      </div>
    </main>
  );
}
