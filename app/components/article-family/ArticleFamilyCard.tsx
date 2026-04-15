import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";

export type ArticleFamilyCardLayout =
  | "compact"
  | "large"
  | "rail"
  | "heroTile";

function typeLabel(
  t: CardModel["_type"],
  showPostAsNews: boolean
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
  fallbackTypeLabel: string | null
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
  showPostTypeBadge = false,
  showAuthor = false,
  showExcerpt = false,
  showTypeMetadataInCompact = false,
  kickerMode = "card",
  showDate = true,
  readTimeMinutes,
}: {
  article: CardModel;
  layout?: ArticleFamilyCardLayout;
  /** When true, `post` shows a "News" label (e.g. search / mixed feeds). */
  showPostTypeBadge?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  /** Show opinionFormat / analysisFocus in compact layout (e.g. search). */
  showTypeMetadataInCompact?: boolean;
  /** `editorial` = category title first, then Opinion/Analysis (opinion rail). */
  kickerMode?: "card" | "editorial";
  showDate?: boolean;
  /** Used when `layout="heroTile"` (carousel tiles). */
  readTimeMinutes?: number;
}) {
  const label = typeLabel(article._type, showPostTypeBadge);
  const imgMaxW =
    layout === "large"
      ? 400
      : layout === "rail"
        ? 180
        : layout === "heroTile"
          ? 400
          : 200;

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article",
    imgMaxW
  );
  const imgUrl = coverData?.src ?? null;
  const showAnalysisFocus =
    article.analysisFocus &&
    (layout === "large" ||
      (showTypeMetadataInCompact && layout === "compact"));
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
          <div className="relative h-[400px] w-full cursor-pointer overflow-hidden rounded-lg bg-black transition-opacity duration-200 hover:opacity-90">
            <div className="absolute inset-0">
              <ImageRenderer
                src={imgUrl || "/placeholder.svg"}
                alt={coverData?.alt || article.title || "Article"}
                width={300}
                height={400}
                fill
                unoptimized={coverData?.unoptimized}
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover rounded-sm"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="mb-2 font-sans text-xl font-semibold leading-snug tracking-tight text-white">
                {article.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-light">
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
      : "relative h-[77px] w-24 flex-shrink-0 overflow-hidden rounded-lg";
  const thumbH = layout === "rail" ? 72 : 77;
  const linkGap = layout === "rail" ? "gap-3" : "gap-4";
  const titleClass =
    layout === "rail"
      ? "line-clamp-2 font-sans text-sm font-semibold leading-snug tracking-normal text-neutral-900"
      : "mb-2 font-sans text-sm font-semibold leading-snug tracking-normal text-neutral-900";

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
                width={96}
                height={thumbH}
                quality={50}
                sizes="96px"
                fill
              />
            </div>
          ) : (
            <div
              className={`flex w-24 items-center justify-center rounded-lg bg-gray-200/80 font-sans text-[10px] text-gray-500 ${
                layout === "rail" ? "h-[72px] rounded-[4px]" : "h-[77px]"
              }`}
            >
              No Image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {kickerMode === "editorial" ? (
            <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-wide text-editorialKicker">
              {editorialK}
            </p>
          ) : (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {label && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-sectionAccent">
                  {label}
                </span>
              )}
              {article._type === "sponsored" && sponsorName && (
                <span className="text-[10px] font-semibold text-amber-800">
                  {sponsorName}
                </span>
              )}
              {article._type === "opinion" &&
                article.opinionFormat &&
                (layout === "large" ||
                  (showTypeMetadataInCompact && layout === "compact")) && (
                  <span className="text-[10px] capitalize text-neutral-600">
                    {article.opinionFormat.replace(/-/g, " ")}
                  </span>
                )}
            </div>
          )}
          <h3 className={titleClass}>{article.title}</h3>
          {showExcerpt && article.excerpt ? (
            <p className="mb-2 line-clamp-3 font-sans text-xs leading-relaxed text-neutral-700">
              {article.excerpt}
            </p>
          ) : null}
          {showAuthor && article.author?.name ? (
            <p className="mb-1 font-sans text-xs text-neutral-600">
              {article.author.name}
            </p>
          ) : null}
          {showAnalysisFocus && (
            <p className="mb-1 line-clamp-2 text-xs text-neutral-600">
              {article.analysisFocus}
            </p>
          )}
          {showDate && dateStr && (
            <p className="mt-1 font-sans text-xs text-neutral-500">
              {dateStr}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
