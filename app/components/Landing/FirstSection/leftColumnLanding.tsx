"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { shouldRenderCarouselSlide } from "@/lib/carousel";
import { resolveListingImage } from "@/lib/editorial-image";
import { getCoverImage } from "@/sanity/lib/utils";
import { BreakingNewsLabel } from "../../ui/breaking-news-label";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  justInPrimaryTitle,
  justInSecondaryTitle,
} from "@/app/lib/typography/first-section";

interface GalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: any;
  alt?: string | null;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
  imageGallery?: GalleryImage[] | null;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
}

function listingImageFromGallery(galleryImage: GalleryImage): {
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

interface LeftColumnLandingProps {
  justInNews: Post[];
}

// Carousel component for cover + gallery images
function ImageCarousel({
  coverImage,
  galleryImages,
  postSlug,
  breakingNews,
  developingStory,
}: {
  coverImage: { src: string; alt: string; unoptimized: boolean } | null;
  galleryImages: Array<{ src: string; alt: string; unoptimized: boolean }>;
  postSlug: string;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
}) {
  // Combine cover and gallery images (cover first)
  const allImages = [...(coverImage ? [coverImage] : []), ...galleryImages];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) return null;

  return (
    <div className="mb-3 block">
      <Link href={`/post/${postSlug}`}>
        <div className="relative h-56 w-full overflow-hidden rounded-sm md:h-60">
          {allImages.map((image, idx) => {
            if (
              !shouldRenderCarouselSlide(idx, currentIndex, allImages.length)
            ) {
              return null;
            }

            return (
              <ImageRenderer
                key={idx}
                src={image.src}
                alt={image.alt}
                width={600}
                height={240}
                fill
                unoptimized={image.unoptimized}
                quality={55}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 300px"
                className={`rounded-sm object-cover transition-opacity duration-500 ${
                  idx === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              />
            );
          })}
          {(breakingNews || developingStory) && (
            <div className="absolute bottom-3 left-3 z-20">
              <BreakingNewsLabel
                text={breakingNews ? "Breaking" : "Developing story"}
              />
            </div>
          )}
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
    </div>
  );
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
          const coverData = isFirstArticle
            ? getCoverImage(post.cover, post.title || "Article image")
            : null;

          // Get gallery images for first article
          let galleryImagesData: Array<{
            src: string;
            alt: string;
            unoptimized: boolean;
          }> = [];
          if (
            isFirstArticle &&
            post.imageGallery &&
            Array.isArray(post.imageGallery)
          ) {
            galleryImagesData = post.imageGallery
              .map((img) => listingImageFromGallery(img))
              .filter(
                (
                  img,
                ): img is { src: string; alt: string; unoptimized: boolean } =>
                  img !== null,
              );
          }

          // Check if we should show carousel (cover + gallery images)
          const hasGalleryImages = galleryImagesData.length > 0;
          const shouldShowCarousel =
            isFirstArticle && (coverData?.src || hasGalleryImages);

          return (
            <article
              key={post._id}
              className={`${index < justInNews.length - 1 ? "border-neutral-200 border-b" : ""} pb-4`}
            >
              {shouldShowCarousel ? (
                <ImageCarousel
                  coverImage={coverData}
                  galleryImages={galleryImagesData}
                  postSlug={post.slug}
                  breakingNews={post.breakingNews}
                  developingStory={post.developingStory}
                />
              ) : isFirstArticle && coverData?.src ? (
                <div className="mb-3 block">
                  <Link href={`/post/${post.slug}`}>
                    <div className="relative h-56 w-full overflow-hidden rounded-sm md:h-60">
                      <ImageRenderer
                        src={coverData.src}
                        alt={coverData.alt}
                        width={600}
                        height={240}
                        fill
                        unoptimized={coverData.unoptimized}
                        quality={55}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 300px"
                        className="rounded-sm object-cover"
                      />
                      {(post.breakingNews || post.developingStory) && (
                        <div className="absolute bottom-3 left-3 z-10">
                          <BreakingNewsLabel
                            text={
                              post.breakingNews
                                ? "Breaking"
                                : "Developing story"
                            }
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
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
