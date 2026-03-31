"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCoverImage, urlForImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

interface GalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: any;
  alt?: string | null;
  epigraph?: string | null;
  creditProvider?: string | null;
  creditAuthor?: string | null;
  creditSourceUrl?: string | null;
  creditLicense?: string | null;
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

interface SecondSectionProps {
  leftArticle: Article;
  leftSmallArticles: Article[];
  rightArticle: Article;
  rightSmallArticles: Article[];
}

// Helper to build gallery image data
function buildGalleryImageData(galleryImage: GalleryImage): {
  src: string;
  alt: string;
  unoptimized: boolean;
} | null {
  if (!galleryImage) return null;

  const hasExternalUrl =
    galleryImage.externalUrl && galleryImage.externalUrl.trim() !== "";
  const hasImageAsset =
    galleryImage.image && (galleryImage.image as any)?.asset?._ref;

  if (!hasExternalUrl && !hasImageAsset) return null;

  // External URL
  if (
    hasExternalUrl &&
    (galleryImage.source === "external" || !galleryImage.source)
  ) {
    let externalUrl = galleryImage.externalUrl!.trim();
    if (externalUrl.startsWith("//")) {
      externalUrl = `https:${externalUrl}`;
    } else if (!externalUrl.match(/^https?:\/\//)) {
      externalUrl = `https://${externalUrl}`;
    }

    try {
      new URL(externalUrl);
      const isWikimedia = /(^|\.)upload\.wikimedia\.org$/.test(
        new URL(externalUrl).hostname,
      );
      return {
        src: externalUrl,
        alt: galleryImage.alt || "Gallery image",
        unoptimized: isWikimedia,
      };
    } catch {
      return null;
    }
  }

  // Asset image
  if (
    hasImageAsset &&
    (galleryImage.source === "asset" || !galleryImage.source || !hasExternalUrl)
  ) {
    const imageUrl = urlForImage(galleryImage.image);
    if (imageUrl) {
      try {
        const url = imageUrl.quality(60).url();
        if (url && url.length > 0) {
          return {
            src: url,
            alt:
              galleryImage.alt ||
              (galleryImage.image as any)?.alt ||
              "Gallery image",
            unoptimized: false,
          };
        }
      } catch (error) {
        console.warn("Failed to build Sanity image URL:", error);
        return null;
      }
    }
  }

  return null;
}

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
      <div className="relative w-full h-80 rounded-lg overflow-hidden">
        {allImages.map((image, idx) => (
          <ImageRenderer
            key={idx}
            src={image.src}
            alt={image.alt}
            width={800}
            height={320}
            fill
            unoptimized={image.unoptimized}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover absolute inset-0 transition-opacity duration-500 ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        {/* Carousel indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
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

export default function SecondSection({
  leftArticle,
  leftSmallArticles,
  rightArticle,
  rightSmallArticles,
}: SecondSectionProps) {
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
      .map((img) => buildGalleryImageData(img))
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
      .map((img) => buildGalleryImageData(img))
      .filter(
        (img): img is { src: string; alt: string; unoptimized: boolean } =>
          img !== null,
      );
  }
  const hasRightGalleryImages = rightGalleryImagesData.length > 0;

  return (
    <main className="bg-background text-foreground">
      {/* Main container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-0">
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
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
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
              <h2 className="text-3xl font-sans font-bold leading-tight tracking-tight pt-2">
                {leftArticle.title}
              </h2>
            </Link>
          </article>

          {/* Small Articles Grid - 1 column on mobile, 2 columns on desktop */}
          {leftSmallArticles.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {leftSmallArticles.map((article, idx) => {
                  // In a 2-column grid: even indices (0,2,4...) are left column, odd (1,3,5...) are right column
                  const isLeftColumn = idx % 2 === 0;
                  const nextItemInSameColumn = idx + 2;
                  const hasNextInColumn =
                    nextItemInSameColumn < leftSmallArticles.length;

                  return (
                    <div
                      key={article.slug || idx}
                      className="pb-4 border-b border-gray-200"
                    >
                      <Link
                        href={`/post/${article.slug}`}
                        className="text-neutral-900 leading-snug font-sans text-lg sm:text-base font-normal tracking-tight block"
                      >
                        {article.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
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
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
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
              <h2 className="text-3xl font-sans font-bold leading-tight tracking-tight pt-2">
                {rightArticle.title}
              </h2>
            </Link>
          </article>

          {/* Small Articles Grid - 1 column on mobile, 2 columns on desktop */}
          {rightSmallArticles.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rightSmallArticles.map((article, idx) => {
                  // In a 2-column grid: even indices (0,2,4...) are left column, odd (1,3,5...) are right column
                  const isLeftColumn = idx % 2 === 0;
                  const nextItemInSameColumn = idx + 2;
                  const hasNextInColumn =
                    nextItemInSameColumn < rightSmallArticles.length;

                  return (
                    <div
                      key={article.slug || idx}
                      className="pb-4 border-b border-gray-200"
                    >
                      <Link
                        href={`/post/${article.slug}`}
                        className="text-neutral-900 leading-snug font-sans text-lg sm:text-base font-normal tracking-tight block"
                      >
                        {article.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
