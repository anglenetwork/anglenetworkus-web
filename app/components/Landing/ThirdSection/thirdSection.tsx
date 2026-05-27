"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  isCarouselLcpCandidate,
  shouldRenderCarouselSlide,
} from "@/lib/carousel";
import { resolveListingImage } from "@/lib/editorial-image";
import { getCoverImage } from "@/sanity/lib/utils";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  featuredColumnTitle,
  secondaryRowTitle,
} from "@/app/lib/typography/third-section";

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
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  imageGallery?: Array<GalleryImage> | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface ThirdSectionProps {
  leftArticle: Article;
  leftSmallArticles: Article[];
  rightArticle: Article;
  rightSmallArticles: Article[];
}

function listingGalleryImage(galleryImage: GalleryImage): {
  src: string;
  alt: string;
  unoptimized: boolean;
} | null {
  const resolved = resolveListingImage(galleryImage, "Gallery image", 1200);
  if (!resolved) return null;
  return {
    src: resolved.src,
    alt: resolved.alt,
    unoptimized: resolved.unoptimized,
  };
}

const featuredImageClassName =
  "relative w-full h-56 md:h-80 rounded-lg overflow-hidden";
// Carousel component for article images
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
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) return null;

  return (
    <Link href={`/post/${postSlug}`}>
      <div className={featuredImageClassName}>
        {allImages.map((image, idx) => {
          if (!shouldRenderCarouselSlide(idx, currentIndex, allImages.length)) {
            return null;
          }

          const isLcp = isCarouselLcpCandidate(idx, currentIndex);

          return (
            <ImageRenderer
              key={idx}
              src={image.src}
              alt={image.alt}
              width={800}
              height={320}
              fill
              unoptimized={image.unoptimized}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={isLcp}
              className={`absolute inset-0 object-cover transition-opacity duration-500 ${
                idx === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            />
          );
        })}
        {/* Carousel indicators */}
        {allImages.length > 1 && (
          <div className="absolute right-3 bottom-3 z-20 flex gap-1.5">
            {allImages.map((_, idx) => (
              <button
                key={idx}
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

function SmallArticleGridItem({ article }: { article: Article }) {
  const coverData = getCoverImage(
    article.cover,
    article.title || "Article",
    480,
  );
  const firstGallery =
    article.imageGallery?.[0] != null
      ? listingGalleryImage(article.imageGallery[0])
      : null;
  const thumbImage = coverData ?? firstGallery;

  return (
    <div className="border-gray-200 border-b pb-4">
      <Link
        href={`/post/${article.slug}`}
        className="group flex items-start gap-4 text-neutral-900"
      >
        <div className="relative h-[100px] w-[160px] shrink-0 overflow-hidden rounded-md xl:h-[90px] xl:w-[144px]">
          {thumbImage?.src ? (
            <ImageRenderer
              src={thumbImage.src}
              alt={thumbImage.alt}
              width={240}
              height={180}
              fill
              unoptimized={thumbImage.unoptimized}
              sizes="(min-width: 1280px) 144px, 160px"
              className="object-cover transition-opacity group-hover:opacity-90"
            />
          ) : null}
        </div>
        <span className={cn(secondaryRowTitle, "min-w-0 flex-1")}>
          {article.title}
        </span>
      </Link>
    </div>
  );
}

export default function ThirdSection({
  leftArticle,
  leftSmallArticles,
  rightArticle,
  rightSmallArticles,
}: ThirdSectionProps) {
  // Left article images
  const leftCoverData = getCoverImage(
    leftArticle.cover,
    leftArticle.title || "Featured article",
  );
  let leftGalleryImagesData: Array<{
    src: string;
    alt: string;
    unoptimized: boolean;
  }> = [];
  if (leftArticle.imageGallery && Array.isArray(leftArticle.imageGallery)) {
    leftGalleryImagesData = leftArticle.imageGallery
      .map((img) => listingGalleryImage(img))
      .filter(
        (img): img is { src: string; alt: string; unoptimized: boolean } =>
          img !== null,
      );
  }
  const hasLeftGalleryImages = leftGalleryImagesData.length > 0;

  // Right article images
  const rightCoverData = getCoverImage(
    rightArticle.cover,
    rightArticle.title || "Featured article",
  );
  let rightGalleryImagesData: Array<{
    src: string;
    alt: string;
    unoptimized: boolean;
  }> = [];
  if (rightArticle.imageGallery && Array.isArray(rightArticle.imageGallery)) {
    rightGalleryImagesData = rightArticle.imageGallery
      .map((img) => listingGalleryImage(img))
      .filter(
        (img): img is { src: string; alt: string; unoptimized: boolean } =>
          img !== null,
      );
  }
  const hasRightGalleryImages = rightGalleryImagesData.length > 0;

  return (
    <main className="bg-background text-foreground">
      {/* Main container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Section Header */}
          <SectionHeader
            title={leftArticle.category?.title || "More Top Headlines"}
            variant="light"
            accentStyle="geometric-square"
            size="large"
          />

          {/* Featured Article */}
          <article className="space-y-3">
            {hasLeftGalleryImages ? (
              <ArticleImageCarousel
                coverImage={leftCoverData}
                galleryImages={leftGalleryImagesData}
                postSlug={leftArticle.slug}
              />
            ) : leftCoverData?.src ? (
              <Link href={`/post/${leftArticle.slug}`}>
                <div className={featuredImageClassName}>
                  <ImageRenderer
                    src={leftCoverData.src}
                    alt={leftCoverData.alt}
                    width={800}
                    height={320}
                    fill
                    unoptimized={leftCoverData.unoptimized}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            ) : null}
            <Link href={`/post/${leftArticle.slug}`}>
              <h2 className={featuredColumnTitle}>{leftArticle.title}</h2>
            </Link>
          </article>

          {/* Two small stories: stacked list (thumb + title) */}
          {leftSmallArticles.length > 0 && (
            <div className="flex w-full flex-col gap-5">
              {leftSmallArticles.map((article, idx) => (
                <SmallArticleGridItem
                  key={article.slug || idx}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Section Header */}
          <SectionHeader
            title={rightArticle.category?.title || "More Top Headlines"}
            variant="light"
            accentStyle="geometric-square"
            size="large"
          />

          {/* Featured Article */}
          <article className="space-y-3">
            {hasRightGalleryImages ? (
              <ArticleImageCarousel
                coverImage={rightCoverData}
                galleryImages={rightGalleryImagesData}
                postSlug={rightArticle.slug}
              />
            ) : rightCoverData?.src ? (
              <Link href={`/post/${rightArticle.slug}`}>
                <div className={featuredImageClassName}>
                  <ImageRenderer
                    src={rightCoverData.src}
                    alt={rightCoverData.alt}
                    width={800}
                    height={320}
                    fill
                    unoptimized={rightCoverData.unoptimized}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            ) : null}
            <Link href={`/post/${rightArticle.slug}`}>
              <h2 className={featuredColumnTitle}>{rightArticle.title}</h2>
            </Link>
          </article>

          {/* Two small stories: stacked list (thumb + title) */}
          {rightSmallArticles.length > 0 && (
            <div className="flex w-full flex-col gap-5">
              {rightSmallArticles.map((article, idx) => (
                <SmallArticleGridItem
                  key={article.slug || idx}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
