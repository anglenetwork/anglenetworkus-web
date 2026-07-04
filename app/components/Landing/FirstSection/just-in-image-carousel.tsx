"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { shouldRenderCarouselSlide } from "@/lib/carousel";
import { BreakingNewsLabel } from "../../ui/breaking-news-label";
import { ImageRenderer } from "../../ui/image-renderer";

export type JustInCarouselImage = {
  src: string;
  alt: string;
  unoptimized: boolean;
};

type JustInImageCarouselProps = {
  images: JustInCarouselImage[];
  postSlug: string;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
};

/** Client-only rotation for Just In hero when multiple images exist. */
export function JustInImageCarousel({
  images,
  postSlug,
  breakingNews,
  developingStory,
}: JustInImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="mb-3 block">
      <Link href={`/post/${postSlug}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary md:aspect-auto md:h-64">
          {images.map((image, idx) => {
            if (!shouldRenderCarouselSlide(idx, currentIndex, images.length)) {
              return null;
            }

            return (
              <ImageRenderer
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={600}
                height={240}
                fill
                unoptimized={image.unoptimized}
                quality={55}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 300px"
                className={`absolute inset-0 object-cover object-center transition-opacity duration-500 ${
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
          {images.length > 1 && (
            <div className="absolute right-3 bottom-3 z-20 flex gap-1.5">
              {images.map((image, idx) => (
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
    </div>
  );
}
