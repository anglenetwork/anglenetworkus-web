import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";

export type HomepageCompactArticleRowCover = {
  src: string;
  alt: string;
  unoptimized?: boolean;
};

export type HomepageCompactArticleRowProps = {
  title: string;
  href: string;
  readTimeMinutes?: number | null;
  cover?: HomepageCompactArticleRowCover | null;
  variant?: "news" | "dark";
  titleClassName?: string;
  imagePosition?: "left" | "right";
  badge?: ReactNode;
  showPlaceholderImage?: boolean;
  showReadTime?: boolean;
  className?: string;
};

function CompactArticleThumb({
  cover,
  title,
  showPlaceholderImage,
}: {
  cover?: HomepageCompactArticleRowCover | null;
  title: string;
  showPlaceholderImage?: boolean;
}) {
  if (cover?.src) {
    return (
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
        <ImageRenderer
          src={cover.src}
          alt={cover.alt}
          width={112}
          height={80}
          fill
          unoptimized={cover.unoptimized}
          sizes="112px"
          className="object-cover object-center"
        />
      </div>
    );
  }

  if (!showPlaceholderImage) {
    return null;
  }

  return (
    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-sm bg-news-secondary font-sans text-[10px] text-news-muted">
      No Image
    </div>
  );
}

export function HomepageCompactArticleRow({
  title,
  href,
  readTimeMinutes,
  cover,
  variant = "news",
  titleClassName,
  imagePosition = "right",
  badge,
  showPlaceholderImage = false,
  showReadTime = true,
  className,
}: HomepageCompactArticleRowProps) {
  const thumb = (
    <CompactArticleThumb
      cover={cover}
      title={title}
      showPlaceholderImage={showPlaceholderImage}
    />
  );

  const textContent = (
    <div className={cn("min-w-0 flex-1", badge && "space-y-2")}>
      {badge}
      <h3 className={titleClassName ?? categorySecondaryRowTitle[variant]}>
        {title}
      </h3>
      {showReadTime ? (
        <ReadTimeLabel minutes={readTimeMinutes} variant={variant} />
      ) : null}
    </div>
  );

  return (
    <Link
      href={href}
      className={cn("group flex items-start gap-3", className)}
      aria-label={`Read article: ${title}`}
    >
      {imagePosition === "left" ? (
        <>
          {thumb}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {thumb}
        </>
      )}
    </Link>
  );
}
