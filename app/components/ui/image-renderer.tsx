import Image from "next/image";
import { isWikimediaUrl } from "@/lib/editorial-image/policy";
import { cn } from "@/lib/utils";

type ImageRendererProps = {
  src: string;
  alt: string;
  unoptimized?: boolean;
  blurDataURL?: string | null;
  priority?: boolean;
  fetchPriority?: "auto" | "high" | "low";
  quality?: number;
  sizes?: string;
  className?: string;
} & (
  | {
      fill: true;
      width?: number;
      height?: number;
    }
  | {
      fill?: false;
      width: number;
      height: number;
    }
);

/**
 * Reusable image renderer component that handles:
 * - Wikimedia Commons images (always unoptimized to avoid rate limiting)
 * - Other external images (based on unoptimized prop)
 * - Sanity asset images (optimized through Next.js)
 */
export function ImageRenderer(props: ImageRendererProps) {
  const {
    src,
    alt,
    unoptimized: propUnoptimized = false,
    blurDataURL,
    priority = false,
    fetchPriority,
    quality,
    sizes,
    className,
    fill = false,
  } = props;
  // Force unoptimized for Wikimedia images to avoid rate limiting (429 errors)
  const shouldUnoptimize = isWikimediaUrl(src) || propUnoptimized;
  const placeholder =
    blurDataURL && !shouldUnoptimize ? ("blur" as const) : ("empty" as const);
  const imageClassName = cn("border-0 outline-none ring-0", className);

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
        placeholder={placeholder}
        blurDataURL={!shouldUnoptimize ? (blurDataURL ?? undefined) : undefined}
        className={imageClassName}
      />
    );
  }

  const { width, height } = props;

  // Check if className modifies dimensions via CSS
  // Next.js warns when CSS modifies dimensions - we add auto style to maintain aspect ratio
  const hasHeightConstraint = className?.match(
    /\bh-\[?[\d.]+(px|rem|em|vh|%)?\]?|\bh-full|\bh-screen/,
  );
  const hasWidthConstraint = className?.match(
    /\bw-\[?[\d.]+(px|rem|em|vw|%)?\]?|\bw-full|\bw-screen/,
  );

  // When width is constrained (like w-full), add height: auto to maintain aspect ratio
  // When height is constrained but width isn't, add width: auto
  // This prevents Next.js warnings about aspect ratio
  const style = hasWidthConstraint
    ? { height: "auto" }
    : hasHeightConstraint
      ? { width: "auto" }
      : undefined;

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
      placeholder={placeholder}
      blurDataURL={!shouldUnoptimize ? (blurDataURL ?? undefined) : undefined}
      className={imageClassName}
      style={style}
    />
  );
}
