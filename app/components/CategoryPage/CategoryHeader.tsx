import Link from "next/link";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { categoryHeaderTagLink } from "@/app/lib/typography/category-page";
import type { CategoryTag } from "./types";

interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription?: string;
  categoryTags?: CategoryTag[];
}

/** e.g. "THURSDAY, JULY 2, 2026" */
function formatSectionDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function CategoryHeader({
  categoryName,
  categoryDescription,
  categoryTags,
}: CategoryHeaderProps) {
  return (
    <header className="border-news-text border-b bg-news-surface">
      <SitePageWidth className="flex flex-col gap-4 pt-[26px] pb-[18px] sm:pt-16 sm:pb-7 xl:flex-row xl:items-baseline xl:justify-between xl:pt-7">
        <div className="max-sm:contents sm:flex sm:min-w-0 sm:items-baseline sm:gap-x-6">
          <h1 className="shrink-0 font-bold font-display text-[38px] text-news-text capitalize leading-none tracking-[-2px] sm:text-[52px] xl:text-[72px]">
            {categoryName}
          </h1>
          {categoryTags && categoryTags.length > 0 ? (
            <nav
              className="flex w-full flex-wrap items-baseline gap-x-4 gap-y-2 sm:min-w-0 sm:flex-1 sm:gap-x-5"
              aria-label={`${categoryName} tags`}
            >
              {categoryTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className={categoryHeaderTagLink}
                >
                  {tag.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        <p className="font-sans text-news-muted text-xs uppercase tracking-wide">
          {formatSectionDate(new Date())}
        </p>
      </SitePageWidth>
    </header>
  );
}
