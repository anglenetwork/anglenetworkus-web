import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import {
  articleFamilyCardTitle,
  articleFamilyCardTitleRail,
  articleFamilyHeroTileTitle,
} from "@/app/lib/typography/article-family-card";

export type ArticleFamilyCardLayout =
  | "compact"
  | "large"
  | "rail"
  | "heroTile";

export type ArticleFamilyCardVariant = "default" | "search";

function typeLabel(
  t: CardModel["_type"],
  showPostAsNews: boolean,
): string | null {
  switch (t) {
    case "post":
      return showPostAsNews ? "News" : null;
    case "opinion":
      return "Opinion";
    case "analysis":
      return "Analysis";
    case "sponsored":
      return "Sponsored";
    default:
      return null;
  }
}

/** Category-first kicker (homepage opinion rail). */
function editorialKicker(
  article: CardModel,
  fallbackTypeLabel: string | null,
): string {
  const cat = article.category?.title?.trim();
  if (cat) return cat;
  if (article._type === "opinion") return "Opinion";
  if (article._type === "analysis") return "Analysis";
  return fallbackTypeLabel || "Trending";
}

export default function ArticleFamilyCard({
  article,
  layout = "compact",
  variant = "default",
  kickerMode = "card",
  showDate = true,
  readTimeMinutes,
}: {
  article: CardModel;
  layout?: ArticleFamilyCardLayout;
  /** `search` enables the search-results card treatment (type badge, excerpt, mobile tweaks). */
  variant?: ArticleFamilyCardVariant;
  /** `editorial` = category title first, then Opinion/Analysis (opinion rail). */
  kickerMode?: "card" | "editorial";
  showDate?: boolean;
  /** Used when `layout="heroTile"` (carousel tiles). */
  readTimeMinutes?: number;
}) {
  const isSearchVariant = variant === "search";
  const showPostTypeBadge = isSearchVariant;
  const showAuthor = isSearchVariant;
  const showExcerpt = isSearchVariant;
  const hideExcerptOnMobile = isSearchVariant;
  const hideAuthorOnMobile = isSearchVariant;
  const hidePostTypeBadgeOnMobile = isSearchVariant;
  const enlargeMobileThumb = isSearchVariant;
  const showTypeMetadataInCompact = isSearchVariant;
  const label = typeLabel(article._type, showPostTypeBadge);
  const imgMaxW =
    layout === "large"
      ? 400
      : layout === "rail"
        ? 180
        : layout === "heroTile"
          ? 400
          : 450;

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article",
    imgMaxW,
  );
  const imgUrl = coverData?.src ?? null;
  const showAnalysisFocus =
    article.analysisFocus &&
    (layout === "large" || (showTypeMetadataInCompact && layout === "compact"));
  const sponsorName = article.sponsorAttribution?.sponsorName;

  let dateStr = "";
  try {
    if (article.publishedAt) {
      dateStr = format(parseISO(article.publishedAt), "MMM dd, h:mm a");
    }
  } catch {
    dateStr = "";
  }

  const readMins = readTimeMinutes ?? 5;

  if (layout === "heroTile") {
    return (
      <article className="group">
        <Link href={article.href} className="block">
          <div className="relative h-[400px] w-full cursor-pointer overflow-hidden rounded-lg bg-neutral-950 transition-opacity duration-200 hover:opacity-90">
            <div className="absolute inset-0">
              <ImageRenderer
                src={imgUrl || "/placeholder.svg"}
                alt={coverData?.alt || article.title || "Article"}
                width={300}
                height={400}
                fill
                unoptimized={coverData?.unoptimized}
                sizes="(max-width: 768px) 100vw, 300px"
                className="rounded-sm object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
              <h3 className={articleFamilyHeroTileTitle}>{article.title}</h3>
              <div className="flex items-center gap-2">
                <span className="font-light font-sans text-xs">
                  {readMins} min read
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  const thumbWrap =
    layout === "rail"
      ? "relative h-[72px] w-24 flex-shrink-0 overflow-hidden rounded-[4px]"
      : enlargeMobileThumb
        ? "relative h-[92px] w-[115px] flex-shrink-0 overflow-hidden rounded-lg md:h-[174px] md:w-[216px]"
        : "relative h-[77px] w-24 flex-shrink-0 overflow-hidden rounded-lg md:h-[174px] md:w-[216px]";
  const thumbImageWidth = layout === "rail" ? 96 : 216;
  const thumbImageHeight = layout === "rail" ? 72 : 174;
  const thumbSizes =
    layout === "rail"
      ? "96px"
      : enlargeMobileThumb
        ? "(max-width: 768px) 115px, 216px"
        : "(max-width: 768px) 96px, 216px";
  const linkGap = layout === "rail" ? "gap-3" : "gap-4";
  const titleClass =
    layout === "rail" ? articleFamilyCardTitleRail : articleFamilyCardTitle;

  const editorialK = editorialKicker(article, label);

  return (
    <article className="group">
      <Link
        href={article.href}
        className={`flex cursor-pointer items-start rounded-lg transition-colors duration-200 ${linkGap}`}
      >
        <div className="flex-shrink-0">
          {imgUrl ? (
            <div className={thumbWrap}>
              <ImageRenderer
                src={imgUrl}
                alt={coverData?.alt || article.title || "Article image"}
                unoptimized={coverData?.unoptimized}
                className="object-cover object-center transition-opacity duration-200"
                width={thumbImageWidth}
                height={thumbImageHeight}
                quality={50}
                sizes={thumbSizes}
                fill
              />
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center justify-center rounded-lg bg-gray-200/80 font-sans text-[10px] text-gray-500",
                layout === "rail"
                  ? "h-[72px] w-24 rounded-[4px]"
                  : enlargeMobileThumb
                    ? "h-[92px] w-[115px] md:h-[174px] md:w-[216px]"
                    : "h-[77px] w-24 md:h-[174px] md:w-[216px]",
              )}
            >
              No Image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {kickerMode === "editorial" ? (
            <p className="mb-1 font-bold font-sans text-[10px] text-editorialKicker uppercase tracking-wide">
              {editorialK}
            </p>
          ) : (
            <div
              className={cn(
                "mb-1 flex flex-wrap items-center gap-2",
                hidePostTypeBadgeOnMobile && "max-md:hidden",
              )}
            >
              {label && (
                <span className="font-bold text-[10px] text-sectionAccent uppercase tracking-wider">
                  {label}
                </span>
              )}
              {article._type === "sponsored" && sponsorName && (
                <span className="font-semibold text-[10px] text-amber-800">
                  {sponsorName}
                </span>
              )}
            </div>
          )}
          <h3 className={titleClass}>{article.title}</h3>
          {showExcerpt && article.excerpt ? (
            <p
              className={cn(
                "search-result-excerpt mb-2 line-clamp-3 font-sans text-neutral-700 text-sm leading-relaxed md:text-base",
                hideExcerptOnMobile && "max-md:hidden",
              )}
            >
              {article.excerpt}
            </p>
          ) : null}
          {showAuthor && article.author?.name ? (
            <p
              className={cn(
                "mb-1 font-sans text-neutral-600 text-xs",
                hideAuthorOnMobile && "max-md:hidden",
              )}
            >
              {article.author.name}
            </p>
          ) : null}
          {showAnalysisFocus && (
            <p
              className={cn(
                "mb-1 line-clamp-2 text-neutral-600 text-xs",
                hidePostTypeBadgeOnMobile && "max-md:hidden",
              )}
            >
              {article.analysisFocus}
            </p>
          )}
          {showDate && dateStr && (
            <p className="mt-1 font-sans text-neutral-500 text-xs">{dateStr}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
