import Link from "next/link";
import { ArrowUpRight, Slash } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import type { TagsGlimpseItem } from "@/app/components/tags-glimpse";
import {
  moreInCategoryCredit,
  moreInCategoryHeading,
  moreInCategoryMeta,
  moreInCategoryRegionHeadline,
  moreInCategoryRegionLabel,
  moreInCategoryRegionMore,
  moreInCategoryTopHeadline,
} from "@/app/lib/typography/category-page";
import { formatImageCredit, getCoverImage } from "@/sanity/lib/utils";
import type { Article } from "./types";

const REGION_IMAGE_SIZES = "(max-width: 1023px) 112px, 25vw";

function MoreInCategoryHeading({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex items-baseline gap-[18px]">
      <h2 className={moreInCategoryHeading}>More in {categoryName}</h2>
      <div className="h-px flex-1 bg-news-border" />
    </div>
  );
}

function moreTopBlockItemClassName(
  index: number,
  total: number,
) {
  return cn(
    "border-news-border py-6 xl:py-0",
    "xl:p-8",
    "xl:border-l",
    index === 0 && "xl:border-l-0 xl:pl-0",
    index === total - 1 && "xl:pr-0",
  );
}

function moreRegionBlockItemClassName(index: number, total: number) {
  return cn(
    "border-news-border py-6 lg:py-0",
    "lg:px-8",
    "lg:border-l",
    index === 0 && "lg:border-l-0 lg:pl-0",
    index === total - 1 && "lg:pr-0",
  );
}

function MoreInCategoryTopRow({ articles }: { articles: Article[] }) {
  const items = articles.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div
      aria-label="More headlines"
      className="mt-9 border-news-border border-t border-b"
    >
      <div className="grid grid-cols-1 divide-y divide-news-border xl:grid-cols-4 xl:divide-y-0">
        {items.map((article, index) => {
          const href = article.href ?? `/post/${article.slug}`;

          return (
            <article
              key={article.id}
              className={moreTopBlockItemClassName(index, items.length)}
            >
              <Link
                href={href}
                className="group block"
                aria-label={`Read article: ${article.title}`}
              >
                <h3 className={cn("mb-3.5", moreInCategoryTopHeadline)}>
                  {article.title}
                </h3>
              </Link>
              <ReadTimeLabel
                minutes={article.readTime}
                variant="news"
                className={cn(moreInCategoryMeta, "mt-0")}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MoreInCategoryRegionMobileRow({ item }: { item: TagsGlimpseItem }) {
  const { article, tagSlug, tagTitle } = item;
  const tagHref = `/tag/${tagSlug}`;
  const articleHref = article.href ?? `/post/${article.slug}`;
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <Link
          href={tagHref}
          className="group flex min-w-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
        >
          <Slash className="size-[11px] shrink-0 text-news-text" strokeWidth={2.5} />
          <span className={moreInCategoryRegionLabel}>{tagTitle}</span>
        </Link>
        <Link
          href={tagHref}
          className="group/more flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
          aria-label={`More from ${tagTitle}`}
        >
          <span className={moreInCategoryRegionMore}>More</span>
          <span
            className="flex size-5 items-center justify-center rounded-full bg-news-primary text-white"
            aria-hidden
          >
            <ArrowUpRight className="size-2.5 stroke-[3]" />
          </span>
        </Link>
      </div>

      <Link
        href={articleHref}
        className="group flex items-start gap-3"
        aria-label={`Read article: ${article.title}`}
      >
        {coverData?.src ? (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-news-secondary">
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              width={112}
              height={80}
              fill
              sizes={REGION_IMAGE_SIZES}
              unoptimized={coverData.unoptimized}
              className="object-cover object-center"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              moreInCategoryRegionHeadline,
              "group-hover:text-news-muted",
            )}
          >
            {article.title}
          </h3>
          <ReadTimeLabel
            minutes={article.readTime}
            variant="news"
            className={cn(moreInCategoryMeta, "mt-3")}
          />
        </div>
      </Link>
    </>
  );
}

function MoreInCategoryRegionColumn({ item }: { item: TagsGlimpseItem }) {
  const { article, tagSlug, tagTitle } = item;
  const tagHref = `/tag/${tagSlug}`;
  const articleHref = article.href ?? `/post/${article.slug}`;
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );
  const credit = formatImageCredit(article.cover);

  return (
    <>
      <div className="flex items-center justify-between py-[22px]">
        <Link
          href={tagHref}
          className="group flex min-w-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
        >
          <Slash className="size-[11px] shrink-0 text-news-text" strokeWidth={2.5} />
          <span className={moreInCategoryRegionLabel}>{tagTitle}</span>
        </Link>
        <Link
          href={tagHref}
          className="group/more flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
          aria-label={`More from ${tagTitle}`}
        >
          <span className={moreInCategoryRegionMore}>More</span>
          <span
            className="flex size-5 items-center justify-center rounded-full bg-news-primary text-white"
            aria-hidden
          >
            <ArrowUpRight className="size-2.5 stroke-[3]" />
          </span>
        </Link>
      </div>

      {coverData?.src ? (
        <Link
          href={articleHref}
          className="group block"
          aria-label={`Read article: ${article.title}`}
        >
          <div className="relative aspect-[5/4] w-full overflow-hidden bg-news-secondary">
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              width={600}
              height={480}
              fill
              sizes={REGION_IMAGE_SIZES}
              unoptimized={coverData.unoptimized}
              className="object-cover object-center"
            />
          </div>
        </Link>
      ) : null}

      {credit ? <p className={moreInCategoryCredit}>{credit}</p> : null}

      <Link href={articleHref} className="group block">
        <h3
          className={cn(
            "mt-[18px] mb-3",
            moreInCategoryRegionHeadline,
            "group-hover:text-news-muted",
          )}
        >
          {article.title}
        </h3>
      </Link>
      <ReadTimeLabel
        minutes={article.readTime}
        variant="news"
        className={cn(moreInCategoryMeta, "mt-0")}
      />
    </>
  );
}

function MoreInCategoryRegions({ items }: { items: TagsGlimpseItem[] }) {
  const columns = items.slice(0, 4);
  if (columns.length === 0) return null;

  return (
    <div aria-label="Regional highlights" className="mt-14">
      <div className="grid grid-cols-1 divide-y divide-news-border lg:grid-cols-4 lg:divide-y-0">
        {columns.map((item, index) => (
          <article
            key={item.tagSlug}
            className={cn("group", moreRegionBlockItemClassName(index, columns.length))}
          >
            <div className="lg:hidden">
              <MoreInCategoryRegionMobileRow item={item} />
            </div>
            <div className="hidden lg:block">
              <MoreInCategoryRegionColumn item={item} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

interface MoreInCategorySectionProps {
  categoryName: string;
  missedItArticles?: Article[];
  tagsGlimpse?: TagsGlimpseItem[];
}

export function MoreInCategorySection({
  categoryName,
  missedItArticles,
  tagsGlimpse,
}: MoreInCategorySectionProps) {
  const topArticles = missedItArticles ?? [];
  const regionItems = tagsGlimpse ?? [];
  const hasHeadlines = topArticles.length > 0;
  const hasTags = regionItems.length > 0;

  if (!hasHeadlines && !hasTags) {
    return null;
  }

  return (
    <section
      aria-label={`More in ${categoryName}`}
      className="bg-news-surface"
    >
      <MoreInCategoryHeading categoryName={categoryName} />

      {hasHeadlines ? <MoreInCategoryTopRow articles={topArticles} /> : null}

      {hasTags ? <MoreInCategoryRegions items={regionItems} /> : null}
    </section>
  );
}
