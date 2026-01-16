"use client";

import { useState, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import {
  getCoverImage,
  urlForImage,
  formatImageCredit,
} from "@/sanity/lib/utils";
import SocialShareButtons from "./SocialShareButtons";
import BookmarkButton from "./BookmarkButton";
import { ImageRenderer } from "../ui/image-renderer";

interface BodyImage {
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

interface BodyBlock {
  bodyText?: any;
  bodyImage?: BodyImage | null;
}

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

interface PostBodyProps {
  bodyTextOne: any;
  bodyBlocks?: Array<BodyBlock> | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    epigraph?: string | null;
    creditProvider?: string | null;
    creditAuthor?: string | null;
    creditSourceUrl?: string | null;
    creditLicense?: string | null;
  } | null;
  imageGallery?: Array<GalleryImage> | null;
  title: string;
  author?: { name: string; picture?: any };
  date: string;
  updatedAt?: string | null;
  slug?: string;
  articleId?: string;
}

/** Portable Text renderers (Spectral for body, DM Sans for headings) */
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const builder = urlForImage(value);
      if (!builder) return null;

      const imageUrl = builder.width(1200).height(800).fit("max").quality(70).url();
      return (
        <figure className="my-8 text-left">
          <ImageRenderer
            src={imageUrl}
            alt={value.alt || ""}
            width={1200}
            height={800}
            // Body images are content width; tell Next so it doesn't fetch overly large sizes
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {(value.alt || value.epigraph || formatImageCredit(value)) && (
            <figcaption className="mt-2 text-left">
              {/* Epigraph + Source in secondary font */}
              {(value.epigraph || formatImageCredit(value)) && (
                <p className="font-secondary text-[12px] sm:text-xs text-neutral-500">
                  {value.epigraph && (
                    <span className="italic">{value.epigraph}</span>
                  )}
                  {value.epigraph && formatImageCredit(value) && (
                    <span className="text-neutral-400"> • </span>
                  )}
                  {formatImageCredit(value) && (
                    <span className="text-neutral-400">
                      {formatImageCredit(value)}
                    </span>
                  )}
                </p>
              )}
              {/* Optional alt-as-caption (muted) */}
              {value.alt && (
                <p
                  className="font-secondary text-[12px] sm:text-xs text-neutral-400"
                  aria-hidden="true"
                >
                  {value.alt}
                </p>
              )}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="underline decoration-neutral-300 underline-offset-[3px] hover:decoration-neutral-700 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="font-sans font-semibold tracking-tight text-[34px] sm:text-[40px] md:text-[44px] text-neutral-900 mt-10 mb-4 leading-tight text-left">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-[28px] md:text-[32px] lg:text-[36px] text-neutral-900 mt-10 md:mt-12 mb-4 leading-snug text-left">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-sans font-semibold text-[20px] sm:text-[22px] md:text-[24px] text-neutral-900 mt-8 mb-3 leading-snug text-left">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-sans font-medium text-lg text-neutral-900 mt-6 mb-2 leading-snug text-left">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="font-body text-xl !leading-relaxed sm:text-xl text-neutral-900 mb-4 text-left">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-10 md:my-12 border-l-2 border-neutral-200 pl-4 md:pl-6 text-left">
        <div className="font-sans text-2xl md:text-3xl leading-tight text-neutral-900">
          {children}
        </div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="font-body list-disc pl-6 space-y-2 text-neutral-900 mb-4 text-left">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="font-body list-decimal pl-6 space-y-2 text-neutral-900 mb-4 text-left">
        {children}
      </ol>
    ),
  },
};

/** Helpers */
function buildGalleryImage(galleryImage: GalleryImage | null | undefined): {
  src: string | null;
  alt: string;
  unoptimized: boolean;
  epigraph?: string | null;
  credit?: string | null;
} | null {
  if (!galleryImage) return null;

  const hasExternalUrl =
    galleryImage.externalUrl && galleryImage.externalUrl.trim() !== "";
  const hasImageAsset =
    galleryImage.image && (galleryImage.image as any)?.asset?._ref;

  if (!hasExternalUrl && !hasImageAsset) {
    return null;
  }

  // Prefer explicit external URL when present or source === "external"
  if (
    hasExternalUrl &&
    (galleryImage.source === "external" || !galleryImage.source) &&
    galleryImage.externalUrl
  ) {
    let externalUrl = galleryImage.externalUrl.trim();
    if (externalUrl.startsWith("//")) {
      externalUrl = `https:${externalUrl}`;
    } else if (!externalUrl.match(/^https?:\/\//)) {
      externalUrl = `https://${externalUrl}`;
    }

    try {
      new URL(externalUrl);
      const isWikimedia = /(^|\.)upload\.wikimedia\.org$/.test(new URL(externalUrl).hostname);
      // Use Wikimedia thumbnail API for Wikimedia images
      if (isWikimedia) {
        const { getWikimediaThumbnail } = require("@/lib/image-optimization");
        externalUrl = getWikimediaThumbnail(externalUrl, 1200);
      }
      return {
        src: externalUrl,
        alt: galleryImage.alt || "Gallery image",
        unoptimized: isWikimedia,
        epigraph: galleryImage.epigraph,
        credit: formatImageCredit(galleryImage),
      };
    } catch {
      return null;
    }
  }

  // Fallback to Sanity asset
  if (
    hasImageAsset &&
    (galleryImage.source === "asset" || !galleryImage.source || !hasExternalUrl)
  ) {
    const imageUrl = urlForImage(galleryImage.image);
    if (imageUrl) {
      try {
        const url = imageUrl.quality(70).url();
        if (url && url.length > 0) {
          return {
            src: url,
            alt: galleryImage.alt || (galleryImage.image as any)?.alt || "Gallery image",
            unoptimized: false,
            epigraph: galleryImage.epigraph,
            credit: formatImageCredit(galleryImage),
          };
        }
      } catch (error) {
        console.warn('Failed to build Sanity image URL:', error);
        return null;
      }
    }
  }

  return null;
}

function buildBodyImage(bodyImage: BodyImage | null | undefined): {
  src: string | null;
  alt: string;
  unoptimized: boolean;
  epigraph?: string | null;
  credit?: string | null;
} | null {
  if (!bodyImage) return null;

  // Check if bodyImage is essentially empty (no actual image data)
  const hasExternalUrl =
    bodyImage.externalUrl && bodyImage.externalUrl.trim() !== "";
  const hasImageAsset =
    bodyImage.image && (bodyImage.image as any)?.asset?._ref;

  if (!hasExternalUrl && !hasImageAsset) {
    return null;
  }

  // Prefer explicit external URL when present or source === "external"
  if (
    hasExternalUrl &&
    (bodyImage.source === "external" || !bodyImage.source) &&
    bodyImage.externalUrl
  ) {
    let externalUrl = bodyImage.externalUrl.trim();
    // Ensure URL has protocol
    if (externalUrl.startsWith("//")) {
      externalUrl = `https:${externalUrl}`;
    } else if (!externalUrl.match(/^https?:\/\//)) {
      externalUrl = `https://${externalUrl}`;
    }
    
    // Use Wikimedia thumbnail API for Wikimedia images
    const isWikimedia = /(^|\.)upload\.wikimedia\.org$/.test(
      new URL(externalUrl).hostname
    );
    if (isWikimedia) {
      const { getWikimediaThumbnail } = require("@/lib/image-optimization");
      externalUrl = getWikimediaThumbnail(externalUrl, 1200);
    }
    
    return {
      src: externalUrl,
      alt: bodyImage.alt || "Body image",
      unoptimized: isWikimedia,
      epigraph: bodyImage.epigraph,
      credit: formatImageCredit(bodyImage),
    };
  }

  // Fallback to Sanity asset
  if (
    hasImageAsset &&
    (bodyImage.source === "asset" || !bodyImage.source || !hasExternalUrl)
  ) {
    const builder = urlForImage(bodyImage.image);
    if (builder) {
      return {
        src: builder.width(1200).height(675).fit("max").quality(70).url(),
        alt: bodyImage.alt || bodyImage.image?.alt || "Body image",
        unoptimized: false,
        epigraph: bodyImage.epigraph,
        credit: formatImageCredit(bodyImage),
      };
    }
  }
  return null;
}

function renderBodyImage(
  bodyImage: BodyImage | null | undefined,
  key: string | number
) {
  const imageData = buildBodyImage(bodyImage);
  if (!imageData?.src) return null;

  return (
    <figure key={key} className="my-8 text-left">
      <div className="relative w-full aspect-[4/3] max-h-[600px] overflow-hidden rounded-lg shadow-lg">
        <ImageRenderer
          src={imageData.src}
          alt={imageData.alt}
          width={1200}
          height={900}
          fill
          unoptimized={imageData.unoptimized}
          // Same logical width assumptions as the cover/body images
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
          className="object-cover rounded-lg"
        />
      </div>
      {(imageData.epigraph || imageData.credit || imageData.alt) && (
        <figcaption className="mt-2 text-left">
          {(imageData.epigraph || imageData.credit) && (
            <p className="font-secondary text-[12px] sm:text-xs text-neutral-500">
              {imageData.epigraph && (
                <span className="">{imageData.epigraph}</span>
              )}
              {imageData.epigraph && imageData.credit && (
                <span className="text-neutral-400"> • </span>
              )}
              {imageData.credit && (
                <span className="text-neutral-400">{imageData.credit}</span>
              )}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function renderBodyText(content: any, key: string | number) {
  if (!content) return null;
  return (
    <div key={key} className="font-body space-y-5 sm:space-y-6 text-left">
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}

// Cover image carousel component
function CoverImageCarousel({
  coverImage,
  galleryImages,
}: {
  coverImage: { src: string; alt: string; unoptimized: boolean; epigraph?: string | null; credit?: string | null } | null;
  galleryImages: Array<{ src: string; alt: string; unoptimized: boolean; epigraph?: string | null; credit?: string | null }>;
}) {
  const allImages = [
    ...(coverImage ? [coverImage] : []),
    ...galleryImages,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) return null;

  const currentImage = allImages[currentIndex];

  return (
    <figure className="mb-12 text-left">
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
        {allImages.map((image, idx) => (
          <ImageRenderer
            key={idx}
            src={image.src}
            alt={image.alt}
            width={1200}
            height={675}
            fill
            priority={idx === 0}
            fetchPriority={idx === 0 ? "high" : undefined}
            quality={70}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
            unoptimized={image.unoptimized}
            className={`object-cover object-center absolute inset-0 transition-opacity duration-500 ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        {/* Carousel indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
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
      <figcaption className="mt-2 font-secondary text-sm tracking-tight leading-snug text-neutral-500 text-left">
        <span className="font-bold">
          {currentImage.epigraph || "Catch up on the latest headlines and developing news."}
        </span>
        {currentImage.credit && (
          <>
            <span className="text-neutral-500"> • </span>
            <span className="text-neutral-500">
              {currentImage.credit}
            </span>
          </>
        )}
      </figcaption>
    </figure>
  );
}

export default function PostBody({
  bodyTextOne,
  bodyBlocks,
  cover,
  imageGallery,
  title,
  author,
  date,
  updatedAt,
  slug,
  articleId,
}: PostBodyProps) {
  return (
    <div className="antialiased text-left mb-8">
      {/* Byline / Meta / Share — secondary font */}
      <div className="flex items-center justify-between mb-6 font-secondary">
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">
            By{" "}
            <span className="text-blue-600 font-medium">
              {author?.name || "Unknown Author"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {updatedAt && updatedAt !== date && (
            <div className="text-xs text-muted-foreground">
              Updated:{" "}
              {new Date(updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {articleId && slug && (
            <BookmarkButton
              articleId={articleId}
              articleSlug={slug}
            />
          )}
          {slug && <SocialShareButtons title={title} url={`/post/${slug}`} />}
        </div>
      </div>

      {/* Cover image carousel with epigraphs and credits */}
      {(() => {
        const coverData = getCoverImage(cover, title);
        
        // Build cover image data with metadata
        const coverImageData = coverData ? {
          ...coverData,
          epigraph: cover?.epigraph || null,
          credit: formatImageCredit(cover),
        } : null;

        // Build gallery images data with metadata
        const galleryImagesData: Array<{
          src: string;
          alt: string;
          unoptimized: boolean;
          epigraph?: string | null;
          credit?: string | null;
        }> = [];
        
        if (imageGallery && Array.isArray(imageGallery)) {
          imageGallery.forEach((img) => {
            const galleryData = buildGalleryImage(img);
            if (galleryData && galleryData.src) {
              galleryImagesData.push({
                src: galleryData.src,
                alt: galleryData.alt,
                unoptimized: galleryData.unoptimized,
                epigraph: galleryData.epigraph,
                credit: galleryData.credit,
              });
            }
          });
        }

        // Check if we should show carousel (cover + gallery images)
        const hasGalleryImages = galleryImagesData.length > 0;
        const shouldShowCarousel = coverImageData?.src || hasGalleryImages;

        if (!shouldShowCarousel) return null;

        // If we have gallery images, show carousel; otherwise show single cover
        if (hasGalleryImages) {
          return (
            <CoverImageCarousel
              coverImage={coverImageData}
              galleryImages={galleryImagesData}
            />
          );
        }

        // Fallback to single cover image (no gallery)
        if (!coverImageData?.src) return null;
        
        return (
          <figure className="mb-12 text-left">
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <ImageRenderer
                src={coverImageData.src}
                alt={coverImageData.alt}
                width={1200}
                height={675}
                fill
                priority
                fetchPriority="high"
                quality={70}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
                unoptimized={coverImageData.unoptimized}
                className="object-cover object-center"
              />
            </div>
            <figcaption className="mt-2 font-secondary text-sm tracking-tight leading-snug text-neutral-500 text-left">
              <span className="font-bold">
                {cover?.epigraph || "Catch up on the latest headlines and developing news."}
              </span>
              {formatImageCredit(cover) && (
                <>
                  <span className="text-neutral-500"> • </span>
                  <span className="text-neutral-500">
                    {formatImageCredit(cover)}
                  </span>
                </>
              )}
            </figcaption>
          </figure>
        );
      })()}

      {/* Main text */}
      <div className="space-y-8 text-left">
        {renderBodyText(bodyTextOne, "main-text")}
      </div>

      {/* Dynamic body blocks */}
      {bodyBlocks && bodyBlocks.length > 0 && (
        <div className="space-y-8 text-left mt-8">
          {bodyBlocks.map((block, index) => (
            <div key={`block-${index}`}>
              {renderBodyImage(block.bodyImage, `block-image-${index}`)}
              {renderBodyText(block.bodyText, `block-text-${index}`)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
