import Link from "next/link";
import { cn } from "@/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { SectionHeader } from "@/app/components/ui/section-header";
import { articleFamilyHeroTileTitle } from "@/app/lib/typography/article-family-card";
import { searchResultSponsorLabel } from "@/app/lib/typography/search-page";
import { searchResultSectionKicker } from "@/app/lib/article-family/card-labels";
import type { ArticleFamilyCardLayout } from "@/app/lib/article-family/card-thumb-layout";
import {
  buildArticleFamilyCardContext,
  type ArticleFamilyCardContext,
} from "./article-family-card-context";
import {
  ArticleCardDefaultMetadata,
  ArticleCardSearchMetadata,
} from "./article-card-metadata";

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
  showAnalysisFocus,
  showDate,
  dateStr,
}: Pick<
  ArticleFamilyCardContext,
  | "article"
  | "label"
  | "sponsorName"
  | "thumbnail"
  | "thumbLayout"
  | "showAnalysisFocus"
  | "showDate"
  | "dateStr"
>) {
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
          <ArticleCardSearchMetadata
            article={article}
            dateStr={dateStr}
            showDate={showDate}
            showAnalysisFocus={showAnalysisFocus}
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
  showAnalysisFocus,
  showDate,
  dateStr,
  hidePostTypeBadgeOnMobile,
}: Pick<
  ArticleFamilyCardContext,
  | "article"
  | "label"
  | "sponsorName"
  | "kickerMode"
  | "editorialK"
  | "thumbnail"
  | "thumbLayout"
  | "showAnalysisFocus"
  | "showDate"
  | "dateStr"
  | "hidePostTypeBadgeOnMobile"
>) {
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
          <ArticleCardDefaultMetadata
            article={article}
            dateStr={dateStr}
            showDate={showDate}
            showAnalysisFocus={showAnalysisFocus}
            hidePostTypeBadgeOnMobile={hidePostTypeBadgeOnMobile}
          />
        </div>
      </Link>
    </article>
  );
}

export default function ArticleFamilyCard(props: {
  article: CardModel;
  layout?: ArticleFamilyCardLayout;
  variant?: "default" | "search";
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
