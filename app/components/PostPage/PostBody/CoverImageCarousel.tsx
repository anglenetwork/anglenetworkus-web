"use client";

import { useEffect, useMemo, useState } from "react";
import {
  isCarouselLcpCandidate,
  shouldRenderCarouselSlide,
} from "@/lib/carousel";
import { ImageRenderer } from "../../ui/image-renderer";
import ArticleCaption from "./ArticleCaption";
import { ARTICLE_MEDIA_CLASSES, DEFAULT_IMAGE_CAPTION } from "./constants";
import type { MediaPresentation, ResolvedArticleImage } from "./types";

interface CoverImageCarouselProps {
  coverImage: ResolvedArticleImage | null;
  galleryImages: ResolvedArticleImage[];
  presentation?: MediaPresentation;
}

export default function CoverImageCarousel({
  coverImage,
  galleryImages,
  presentation = "default",
}: CoverImageCarouselProps) {
  const allImages = useMemo(
    () => [...(coverImage ? [coverImage] : []), ...galleryImages],
    [coverImage, galleryImages],
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) return null;

  const currentImage = allImages[currentIndex] ?? allImages[0];
  const mediaClasses = ARTICLE_MEDIA_CLASSES[presentation];

  return (
    <figure className={mediaClasses.figure}>
      <div className={mediaClasses.wrapper}>
        {allImages.map((image, idx) => {
          if (!shouldRenderCarouselSlide(idx, currentIndex, allImages.length)) {
            return null;
          }

          const isLcp = isCarouselLcpCandidate(idx, currentIndex);

          return (
            <ImageRenderer
              key={`${image.src}-${idx}`}
              src={image.src}
              alt={image.alt}
              width={1200}
              height={675}
              fill
              priority={isLcp}
              fetchPriority={isLcp ? "high" : undefined}
              quality={isLcp ? 70 : 55}
              sizes={mediaClasses.sizes}
              unoptimized={image.unoptimized}
              blurDataURL={image.blurDataURL}
              className={`absolute inset-0 object-cover object-center transition-opacity duration-500 ${
                idx === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            />
          );
        })}
        {allImages.length > 1 && (
          <div className="absolute right-4 bottom-4 z-20 flex gap-1.5">
            {allImages.map((image, idx) => (
              <button
                key={`${image.src}-indicator-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
      <ArticleCaption
        caption={currentImage.caption}
        credit={currentImage.credit}
        license={currentImage.licenseOrRights}
        fallbackCaption={DEFAULT_IMAGE_CAPTION}
      />
    </figure>
  );
}
