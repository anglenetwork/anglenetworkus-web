import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  postArticleDek,
  postArticleKicker,
  postArticleTitle,
} from "@/app/lib/typography/post-standard";
import { REGULAR_POST_BYLINE_ROW_CLASS } from "../PostBody/constants";
import ArticleActions from "../PostBody/ArticleActions";
import { formatArticleTimestamp } from "../PostBody/date-utils";
import { authorAvatarUrl } from "../PostBody/media-utils";
import type { ArticleAuthor } from "../PostBody/types";
import { ImageRenderer } from "../../ui/image-renderer";

interface PostArticleHeaderProps {
  category?: { title: string; slug: string };
  title: string;
  excerpt?: string;
  date: string;
  updatedAt?: string | null;
  author?: ArticleAuthor;
  readTime?: number | null;
  slug?: string;
  articleId?: string;
  sharePath?: string;
}

export default function PostArticleHeader({
  category,
  title,
  excerpt,
  date,
  updatedAt,
  author,
  readTime,
  slug,
  articleId,
  sharePath,
}: PostArticleHeaderProps) {
  const shareUrl = sharePath ?? (slug ? `/post/${slug}` : "");
  const authorName = author?.name || "Unknown Author";
  const avatarUrl = authorAvatarUrl(author?.picture);
  const authorInitial = authorName.charAt(0).toUpperCase();
  const displayDate = updatedAt || date;
  const dateLabel = updatedAt && updatedAt !== date ? "Updated" : "Published";
  const readTimeLabel = `${readTime || 3} min read`;

  return (
    <header className="not-prose pb-6">
      {category && (
        <Link
          href={`/category/${category.slug}`}
          className={cn(
            "group mb-4 inline-flex items-center gap-[7px]",
            postArticleKicker,
          )}
        >
          <span
            className="size-[7px] shrink-0 rounded-full bg-news-primary"
            aria-hidden
          />
          <span className="group-hover:underline">{category.title}</span>
        </Link>
      )}

      <h1 className={cn(postArticleTitle, "mb-5 text-start")}>{title}</h1>

      {excerpt && <p className={cn(postArticleDek, "mb-6")}>{excerpt}</p>}

      <div
        className={cn(
          REGULAR_POST_BYLINE_ROW_CLASS,
          "border-news-border border-t pt-5",
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="relative size-[38px] shrink-0 overflow-hidden rounded-full bg-news-text">
            {avatarUrl ? (
              <ImageRenderer
                src={avatarUrl}
                alt={authorName}
                width={38}
                height={38}
                fill
                sizes="38px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center font-display font-semibold text-sm text-white">
                {authorInitial}
              </span>
            )}
          </span>

          <div className="min-w-0">
            <p className="font-display font-semibold text-news-primary-hover text-sm">
              By {authorName}
            </p>
            <p className="mt-0.5 font-sans text-[13px] text-news-muted">
              {dateLabel} {formatArticleTimestamp(displayDate)} ·{" "}
              {readTimeLabel}
            </p>
          </div>
        </div>
        <ArticleActions
          articleId={articleId}
          slug={slug}
          title={title}
          shareUrl={shareUrl}
        />
      </div>
    </header>
  );
}
