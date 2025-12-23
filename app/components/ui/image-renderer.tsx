import Image from "next/image";

interface ImageRendererProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  unoptimized?: boolean;
  priority?: boolean;
  fetchPriority?: "auto" | "high" | "low";
  quality?: number;
  sizes?: string;
  className?: string;
  fill?: boolean;
}

/**
 * Reusable image renderer component that handles:
 * - Wikimedia Commons images (always unoptimized to avoid rate limiting)
 * - Other external images (based on unoptimized prop)
 * - Sanity asset images (optimized through Next.js)
 */
export function ImageRenderer({
  src,
  alt,
  width,
  height,
  unoptimized: propUnoptimized = false,
  priority = false,
  fetchPriority,
  quality,
  sizes,
  className,
  fill = false,
}: ImageRendererProps) {
  // Helper to detect Wikimedia Commons images
  const isWikimedia = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return /(^|\.)upload\.wikimedia\.org$/.test(urlObj.hostname);
    } catch {
      return false;
    }
  };

  // Force unoptimized for Wikimedia images to avoid rate limiting (429 errors)
  const shouldUnoptimize = isWikimedia(src) || propUnoptimized;

  // If using fill, don't pass width/height
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={shouldUnoptimize}
        priority={priority}
        fetchPriority={fetchPriority}
        quality={quality}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={shouldUnoptimize}
      priority={priority}
      fetchPriority={fetchPriority}
      quality={quality}
      sizes={sizes}
      className={className}
    />
  );
}
