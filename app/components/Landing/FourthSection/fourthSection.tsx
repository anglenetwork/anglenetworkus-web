"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { shouldRenderCarouselSlide } from "@/lib/carousel";
import { resolveListingImage } from "@/lib/editorial-image";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import { featuredColumnTitle } from "@/app/lib/typography/fourth-section";

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

interface FourthSectionProps {
  leftArticle: Article;
  centerArticle: Article;
  rightArticle: Article;
}

const featuredImageSizes = "(max-width: 1024px) 100vw, 33vw";

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

const featuredImageClassName =
  "relative w-full h-[10.5rem] md:h-60 rounded-lg overflow-hidden";

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
    <Link href={`/post/${postSlug}`}>
      <div className={featuredImageClassName}>
        {allImages.map((image, idx) => {
          if (!shouldRenderCarouselSlide(idx, currentIndex, allImages.length)) {
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
              sizes={featuredImageSizes}
              className={`absolute inset-0 object-cover transition-opacity duration-500 ${
                idx === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            />
          );
        })}
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

function FeaturedColumn({ article }: { article: Article }) {
  const { coverData, galleryImagesData, hasGalleryImages } =
    resolveArticleImages(article);

  return (
    <div className="space-y-8">
      <SectionHeader
        title={article.category?.title || "More Top Headlines"}
        variant="light"
        accentStyle="small-dot"
        size="regular"
        href={
          article.category?.slug
            ? `/category/${article.category.slug}`
            : undefined
        }
      />

      <article className="space-y-3">
        {hasGalleryImages ? (
          <ArticleImageCarousel
            coverImage={coverData}
            galleryImages={galleryImagesData}
            postSlug={article.slug}
          />
        ) : coverData?.src ? (
          <Link href={`/post/${article.slug}`}>
            <div className={featuredImageClassName}>
              <ImageRenderer
                src={coverData.src}
                alt={coverData.alt}
                width={600}
                height={240}
                fill
                unoptimized={coverData.unoptimized}
                sizes={featuredImageSizes}
                className="object-cover"
              />
            </div>
          </Link>
        ) : null}
        <Link href={`/post/${article.slug}`}>
          <h2 className={featuredColumnTitle}>{article.title}</h2>
        </Link>
      </article>
    </div>
  );
}

export default function FourthSection({
  leftArticle,
  centerArticle,
  rightArticle,
}: FourthSectionProps) {
  return (
    <main className="bg-background text-foreground">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FeaturedColumn article={leftArticle} />
        <FeaturedColumn article={centerArticle} />
        <FeaturedColumn article={rightArticle} />
      </div>
    </main>
  );
}
