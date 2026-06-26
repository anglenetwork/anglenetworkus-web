import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { SectionHeader } from "@/app/components/ui/section-header";
import { articleFamilyHeroTileTitle } from "@/app/lib/typography/article-family-card";
import {
  searchResultAuthor,
  searchResultDate,
  searchResultExcerpt,
  searchResultSponsorLabel,
} from "@/app/lib/typography/search-page";
import {
  editorialKicker,
  searchResultSectionKicker,
  typeLabel,
} from "@/app/lib/article-family/card-labels";
import {
  getArticleFamilyCardThumbLayout,
  type ArticleFamilyCardLayout,
} from "@/app/lib/article-family/card-thumb-layout";

type ArticleFamilyCardVariant = "default" | "search";

function ArticleCardBodyMetadata({
  article,
  showExcerpt,
  showAuthor,
  showAnalysisFocus,
  showDate,
  dateStr,
  hideExcerptOnMobile,
  hideAuthorOnMobile,
  hidePostTypeBadgeOnMobile,
  dateClassName,
}: {
  article: CardModel;
  showExcerpt: boolean;
  showAuthor: boolean;
  showAnalysisFocus: boolean | "" | null | undefined;
  showDate: boolean;
  dateStr: string;
  hideExcerptOnMobile: boolean;
  hideAuthorOnMobile: boolean;
  hidePostTypeBadgeOnMobile: boolean;
  dateClassName: string;
}) {
  return (
    <>
      {showExcerpt && article.excerpt ? (
        <p
          className={cn(
            searchResultExcerpt,
            hideExcerptOnMobile && "max-md:hidden",
          )}
        >
          {article.excerpt}
        </p>
      ) : null}
      {showAuthor && article.author?.name ? (
        <p
          className={cn(
            searchResultAuthor,
            hideAuthorOnMobile && "max-md:hidden",
          )}
        >
          {article.author.name}
        </p>
      ) : null}
      {showAnalysisFocus ? (
        <p
          className={cn(
            "mb-1 line-clamp-2 text-neutral-600 text-xs",
            hidePostTypeBadgeOnMobile && "max-md:hidden",
          )}
        >
          {article.analysisFocus}
        </p>
      ) : null}
      {showDate && dateStr ? <p className={dateClassName}>{dateStr}</p> : null}
    </>
  );
}

export type ArticleFamilyCardContext = {
  article: CardModel;
  layout: ArticleFamilyCardLayout;
  variant: ArticleFamilyCardVariant;
  kickerMode: "card" | "editorial";
  showDate: boolean;
  readTimeMinutes?: number;
  isSearchVariant: boolean;
  showPostTypeBadge: boolean;
  showAuthor: boolean;
  showExcerpt: boolean;
  hideExcerptOnMobile: boolean;
  hideAuthorOnMobile: boolean;
  hidePostTypeBadgeOnMobile: boolean;
  showTypeMetadataInCompact: boolean;
  label: string | null;
  imgUrl: string | null;
  coverData: ReturnType<typeof getCoverImage>;
  showAnalysisFocus: boolean | "" | null | undefined;
  sponsorName: string | undefined;
  dateStr: string;
  thumbLayout: ReturnType<typeof getArticleFamilyCardThumbLayout>;
  editorialK: string;
  thumbnail: React.ReactNode;
};

export function buildArticleFamilyCardContext({
  article,
  layout = "compact",
  variant = "default",
  kickerMode = "card",
  showDate = true,
  readTimeMinutes,
}: {
  article: CardModel;
  layout?: ArticleFamilyCardLayout;
  variant?: ArticleFamilyCardVariant;
  kickerMode?: "card" | "editorial";
  showDate?: boolean;
  readTimeMinutes?: number;
}): ArticleFamilyCardContext {
  const isSearchVariant = variant === "search";
  const showPostTypeBadge = isSearchVariant;
  const showAuthor = isSearchVariant;
  const showExcerpt = isSearchVariant;
  const hideExcerptOnMobile = isSearchVariant;
  const hideAuthorOnMobile = isSearchVariant;
  const hidePostTypeBadgeOnMobile = isSearchVariant;
  const showTypeMetadataInCompact = isSearchVariant;
  const label = typeLabel(article._type, showPostTypeBadge);

  const thumbLayout = getArticleFamilyCardThumbLayout(layout, isSearchVariant);

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article",
    thumbLayout.imgMaxW,
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

  const editorialK = editorialKicker(article, label);

  const thumbnail = imgUrl ? (
    <div className={thumbLayout.thumbWrap}>
      <ImageRenderer
        src={imgUrl}
        alt={coverData?.alt || article.title || "Article image"}
        unoptimized={coverData?.unoptimized}
        className="object-cover object-center transition-opacity duration-200"
        width={thumbLayout.thumbImageWidth}
        height={thumbLayout.thumbImageHeight}
        quality={50}
        sizes={thumbLayout.thumbSizes}
        fill
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-gray-200/80 font-sans text-[10px] text-gray-500",
        thumbLayout.placeholderClass,
      )}
    >
      No Image
    </div>
  );

  return {
    article,
    layout,
    variant,
    kickerMode,
    showDate,
    readTimeMinutes,
    isSearchVariant,
    showPostTypeBadge,
    showAuthor,
    showExcerpt,
    hideExcerptOnMobile,
    hideAuthorOnMobile,
    hidePostTypeBadgeOnMobile,
    showTypeMetadataInCompact,
    label,
    imgUrl,
    coverData,
    showAnalysisFocus,
    sponsorName,
    dateStr,
    thumbLayout,
    editorialK,
    thumbnail,
  };
}

function ArticleFamilyHeroTile({
  article,
  imgUrl,
  coverData,
  readTimeMinutes,
}: Pick<
  ArticleFamilyCardContext,
  "article" | "imgUrl" | "coverData" | "readTimeMinutes"
>) {
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
              <ReadTimeLabel
                minutes={readTimeMinutes}
                variant="hero"
                as="span"
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ArticleFamilySearchCard({
  article,
  label,
  sponsorName,
  thumbnail,
  thumbLayout,
  showExcerpt,
  showAuthor,
  showAnalysisFocus,
  showDate,
  dateStr,
  hideExcerptOnMobile,
  hideAuthorOnMobile,
}: ArticleFamilyCardContext) {
  const kicker = searchResultSectionKicker(article, label);

  return (
    <article className="group">
      <div className={cn("flex items-start rounded-lg", thumbLayout.linkGap)}>
        <Link
          href={article.href}
          className="shrink-0"
          aria-label={`Read article: ${article.title}`}
        >
          {thumbnail}
        </Link>
        <div className="min-w-0 flex-1">
          {kicker ? (
            <div className="[&>div]:mb-2">
              <SectionHeader
                title={kicker.title}
                href={kicker.href}
                variant="news"
                accentStyle="minimal"
                icon="slash"
              />
            </div>
          ) : null}
          {article._type === "sponsored" && sponsorName ? (
            <p className={cn(searchResultSponsorLabel, "mb-2")}>
              {sponsorName}
            </p>
          ) : null}
          <Link href={article.href} className="block">
            <h3 className={thumbLayout.titleClass}>{article.title}</h3>
          </Link>
          <ArticleCardBodyMetadata
            article={article}
            showExcerpt={showExcerpt}
            showAuthor={showAuthor}
            showAnalysisFocus={showAnalysisFocus}
            showDate={showDate}
            dateStr={dateStr}
            hideExcerptOnMobile={hideExcerptOnMobile}
            hideAuthorOnMobile={hideAuthorOnMobile}
            hidePostTypeBadgeOnMobile={false}
            dateClassName={searchResultDate}
          />
        </div>
      </div>
    </article>
  );
}

function ArticleFamilyDefaultCard({
  article,
  label,
  sponsorName,
  kickerMode,
  editorialK,
  thumbnail,
  thumbLayout,
  showExcerpt,
  showAuthor,
  showAnalysisFocus,
  showDate,
  dateStr,
  hideExcerptOnMobile,
  hideAuthorOnMobile,
  hidePostTypeBadgeOnMobile,
}: ArticleFamilyCardContext) {
  return (
    <article className="group">
      <Link
        href={article.href}
        className={`flex cursor-pointer items-start rounded-lg transition-colors duration-200 ${thumbLayout.linkGap}`}
      >
        <div className="flex-shrink-0">{thumbnail}</div>
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
          <h3 className={thumbLayout.titleClass}>{article.title}</h3>
          <ArticleCardBodyMetadata
            article={article}
            showExcerpt={showExcerpt}
            showAuthor={showAuthor}
            showAnalysisFocus={showAnalysisFocus}
            showDate={showDate}
            dateStr={dateStr}
            hideExcerptOnMobile={hideExcerptOnMobile}
            hideAuthorOnMobile={hideAuthorOnMobile}
            hidePostTypeBadgeOnMobile={hidePostTypeBadgeOnMobile}
            dateClassName="mt-1 font-sans text-neutral-500 text-xs"
          />
        </div>
      </Link>
    </article>
  );
}

export default function ArticleFamilyCard(props: {
  article: CardModel;
  layout?: ArticleFamilyCardLayout;
  variant?: ArticleFamilyCardVariant;
  kickerMode?: "card" | "editorial";
  showDate?: boolean;
  readTimeMinutes?: number;
}) {
  const ctx = buildArticleFamilyCardContext(props);

  if (props.layout === "heroTile") {
    return <ArticleFamilyHeroTile {...ctx} />;
  }
  if (props.variant === "search") {
    return <ArticleFamilySearchCard {...ctx} />;
  }
  return <ArticleFamilyDefaultCard {...ctx} />;
}
