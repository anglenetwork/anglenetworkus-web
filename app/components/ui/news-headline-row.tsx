import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { headlineRowTitle } from "@/app/lib/typography/news-headline-row";

/** Normalized payload for cross-route headline rows (category, analysis, tag, etc.). */
export type NewsHeadlineRowItem = {
  id: string;
  title: string;
  href: string;
  readTimeMinutes?: number | null;
};

const GRID_COLUMNS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

type NewsHeadlineRowVariant = "news" | "light";

/**
 * Bordered row of linked headlines with read time (no images).
 *
 * @example
 * ```tsx
 * <NewsHeadlineRow
 *   items={articles.map((article) => ({
 *     id: article.id,
 *     title: article.title,
 *     href: article.href,
 *     readTimeMinutes: article.readTime,
 *   }))}
 * />
 * ```
 */
export function NewsHeadlineRow({
  items,
  columns = 4,
  variant = "news",
  className,
  ariaLabel = "Headline news",
  minItems = 1,
}: {
  items: NewsHeadlineRowItem[];
  columns?: keyof typeof GRID_COLUMNS;
  variant?: NewsHeadlineRowVariant;
  className?: string;
  ariaLabel?: string;
  minItems?: number;
}) {
  if (items.length < minItems) {
    return null;
  }

  const displayItems = items.slice(0, columns);

  return (
    <section
      aria-label={ariaLabel}
      className={cn("border-news-border border-t", className)}
    >
      <div
        className={cn(
          "grid grid-cols-1 items-start divide-y divide-news-border sm:grid-cols-2 lg:divide-x lg:divide-y-0",
          GRID_COLUMNS[columns],
        )}
      >
        {displayItems.map((item) => (
          <article
            key={item.id}
            className="flex w-full flex-col gap-2 px-6 py-8"
          >
            <Link
              href={item.href}
              className="group block"
              aria-label={`Read article: ${item.title}`}
            >
              <h3 className={cn("m-0", headlineRowTitle[variant])}>
                {item.title}
              </h3>
            </Link>
            <ReadTimeLabel
              minutes={item.readTimeMinutes}
              variant={variant}
              className="mt-0"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
