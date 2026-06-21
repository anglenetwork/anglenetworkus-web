import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { newsCardRowTitle } from "@/app/lib/typography/news-card-row-section";

/** Normalized card payload for cross-route reuse (homepage, category, tag, etc.). */
export type NewsCardRowItem = {
  id: string;
  title: string;
  href: string;
  image: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  readTimeMinutes?: number | null;
};

const GRID_COLUMNS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

const IMAGE_SIZES = {
  2: "(max-width: 1024px) 100vw, 50vw",
  3: "(max-width: 1024px) 100vw, 33vw",
  4: "(max-width: 1024px) 100vw, 25vw",
} as const;

type NewsCardRowVariant = "news" | "dark";

/**
 * Single image-over-title card used by {@link NewsCardRowSection}.
 *
 * @example
 * ```tsx
 * <NewsCardRowCard
 *   item={{
 *     id: post._id,
 *     title: post.title,
 *     href: `/post/${post.slug}`,
 *     image: cover.src,
 *     imageAlt: cover.alt,
 *     readTimeMinutes: post.readTime,
 *   }}
 * />
 * ```
 */
export function NewsCardRowCard({
  item,
  variant = "news",
  showReadTime = true,
  imageSizes = "(max-width: 1024px) 100vw, 25vw",
  className,
}: {
  item: NewsCardRowItem;
  variant?: NewsCardRowVariant;
  showReadTime?: boolean;
  imageSizes?: string;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link
        href={item.href}
        className="block"
        aria-label={`Read article: ${item.title}`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary">
          <ImageRenderer
            src={item.image || "/placeholder.svg"}
            alt={item.imageAlt?.trim() || item.title}
            width={800}
            height={450}
            fill
            unoptimized={item.imageUnoptimized}
            sizes={imageSizes}
            className="object-cover object-center"
          />
        </div>
      </Link>
      <Link href={item.href} className="group/title block">
        <h3 className={cn("mt-4", newsCardRowTitle[variant])}>{item.title}</h3>
      </Link>
      {showReadTime ? (
        <ReadTimeLabel minutes={item.readTimeMinutes} variant={variant} />
      ) : null}
    </article>
  );
}

/**
 * Reusable editorial section: landing-style header + responsive card row.
 *
 * @example
 * ```tsx
 * <NewsCardRowSection
 *   title="Tech"
 *   href="/category/tech"
 *   items={posts.map((post) => ({
 *     id: post._id,
 *     title: post.title,
 *     href: `/post/${post.slug}`,
 *     image: cover.src,
 *     readTimeMinutes: post.readTime,
 *   }))}
 * />
 * ```
 */
export function NewsCardRowSection({
  title,
  href,
  items,
  variant = "news",
  columns = 4,
  className,
  ariaLabel,
  showReadTime = true,
  minItems = 1,
}: {
  title: string;
  href?: string;
  items: NewsCardRowItem[];
  variant?: NewsCardRowVariant;
  columns?: keyof typeof GRID_COLUMNS;
  className?: string;
  ariaLabel?: string;
  showReadTime?: boolean;
  minItems?: number;
}) {
  if (items.length < minItems) {
    return null;
  }

  const imageSizes = IMAGE_SIZES[columns];

  return (
    <section
      aria-label={ariaLabel ?? title}
      className={cn("rounded-lg bg-news-surface", className)}
    >
      <SectionHeader
        title={title}
        href={href}
        variant={variant}
        accentStyle="modern"
        size="regular"
      />

      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2",
          GRID_COLUMNS[columns],
        )}
      >
        {items.map((item) => (
          <NewsCardRowCard
            key={item.id}
            item={item}
            variant={variant}
            showReadTime={showReadTime}
            imageSizes={imageSizes}
          />
        ))}
      </div>
    </section>
  );
}
