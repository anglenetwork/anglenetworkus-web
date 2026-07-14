import { cn } from "@/lib/utils";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import {
  searchResultAuthor,
  searchResultDate,
  searchResultExcerpt,
} from "@/app/lib/typography/search-page";

export function ArticleCardSearchMetadata({
  article,
  dateStr,
  showDate,
  showAnalysisFocus,
}: {
  article: CardModel;
  dateStr: string;
  showDate: boolean;
  showAnalysisFocus: boolean | "" | null | undefined;
}) {
  return (
    <>
      {article.excerpt ? (
        <p className={cn(searchResultExcerpt, "max-md:hidden")}>
          {article.excerpt}
        </p>
      ) : null}
      {article.author?.name ? (
        <p className={cn(searchResultAuthor, "max-md:hidden")}>
          {article.author.name}
        </p>
      ) : null}
      {showAnalysisFocus ? (
        <p className="mb-1 line-clamp-2 text-news-muted text-xs">
          {article.analysisFocus}
        </p>
      ) : null}
      {showDate && dateStr ? (
        <p className={searchResultDate}>{dateStr}</p>
      ) : null}
    </>
  );
}

export function ArticleCardDefaultMetadata({
  article,
  dateStr,
  showDate,
  showAnalysisFocus,
  hidePostTypeBadgeOnMobile,
}: {
  article: CardModel;
  dateStr: string;
  showDate: boolean;
  showAnalysisFocus: boolean | "" | null | undefined;
  hidePostTypeBadgeOnMobile: boolean;
}) {
  return (
    <>
      {showAnalysisFocus ? (
        <p
          className={cn(
            "mb-1 line-clamp-2 text-news-muted text-xs",
            hidePostTypeBadgeOnMobile && "max-md:hidden",
          )}
        >
          {article.analysisFocus}
        </p>
      ) : null}
      {showDate && dateStr ? (
        <p className="mt-1 font-sans text-news-muted text-xs">{dateStr}</p>
      ) : null}
    </>
  );
}
