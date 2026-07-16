import { cn } from "@/lib/utils";
import ArticleActions from "../PostBody/ArticleActions";
import { formatArticleTimestamp } from "../PostBody/date-utils";
import type { ArticleAuthor } from "../PostBody/types";

export interface PostArticleBylineProps {
  date: string;
  updatedAt?: string | null;
  author?: ArticleAuthor;
  readTime?: number | null;
  slug?: string;
  articleId?: string;
  title: string;
  sharePath?: string;
  className?: string;
}

export default function PostArticleByline({
  date,
  updatedAt,
  author,
  readTime,
  slug,
  articleId,
  title,
  sharePath,
  className,
}: PostArticleBylineProps) {
  const shareUrl = sharePath ?? (slug ? `/post/${slug}` : "");
  const authorName = author?.name || "Unknown Author";
  const displayDate = updatedAt || date;
  const dateLabel = updatedAt && updatedAt !== date ? "Updated" : "Published";
  const readTimeLabel = `${readTime || 3} min read`;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 font-sans",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="font-display font-semibold text-news-primary-hover text-sm">
          By {authorName}
        </p>
        <p className="mt-0.5 font-sans text-[13px] text-news-muted">
          {dateLabel} {formatArticleTimestamp(displayDate)} · {readTimeLabel}
        </p>
      </div>
      <ArticleActions
        articleId={articleId}
        slug={slug}
        title={title}
        shareUrl={shareUrl}
        shareInDialogBelowLg
      />
    </div>
  );
}
