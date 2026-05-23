import { ImageRenderer } from "../../ui/image-renderer";
import {
  ARTICLE_META_PRIMARY_CLASS,
  ARTICLE_META_SECONDARY_CLASS,
  ARTICLE_META_TIMESTAMP_CLASS,
} from "./constants";
import { formatArticleTimestamp } from "./date-utils";
import { authorAvatarUrl } from "./media-utils";
import type { ArticleAuthor } from "./types";
import { cn } from "@/lib/utils";

interface ArticleBylineProps {
  author?: ArticleAuthor;
  date: string;
  updatedAt?: string | null;
  layout?: "stacked" | "inline";
  showAvatar?: false | "xl";
}

export default function ArticleByline({
  author,
  date,
  updatedAt,
  layout = "stacked",
  showAvatar = false,
}: ArticleBylineProps) {
  const authorName = author?.name || "Unknown Author";
  const avatarUrl = authorAvatarUrl(author?.picture);
  const authorInitial = authorName.charAt(0).toUpperCase();
  const displayDate = updatedAt || date;
  const dateLabel =
    updatedAt && updatedAt !== date ? "Updated" : "Published";
  const avatarClassName = cn(
    "h-9 w-9 shrink-0 overflow-hidden rounded-full",
    showAvatar === "xl" && "hidden xl:block",
  );

  const authorAvatar =
    showAvatar === "xl" ? (
      avatarUrl ? (
        <span className={cn("relative bg-neutral-200", avatarClassName)}>
          <ImageRenderer
            src={avatarUrl}
            alt={authorName}
            width={36}
            height={36}
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
      ) : (
        <span
          className={cn(
            "flex items-center justify-center bg-neutral-900 font-sans text-xs font-semibold text-white",
            avatarClassName,
            "hidden xl:flex",
          )}
        >
          {authorInitial}
        </span>
      )
    ) : null;

  if (layout === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans">
        <span className={ARTICLE_META_TIMESTAMP_CLASS}>
          {dateLabel} {formatArticleTimestamp(displayDate)}
        </span>
        <span className="text-neutral-400" aria-hidden>
          •
        </span>
        <span className={ARTICLE_META_SECONDARY_CLASS}>By</span>
        {authorAvatar}
        <span className={ARTICLE_META_PRIMARY_CLASS}>{authorName}</span>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <p className={ARTICLE_META_TIMESTAMP_CLASS}>
        {dateLabel} {formatArticleTimestamp(displayDate)}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <span className={ARTICLE_META_SECONDARY_CLASS}>By</span>
        {authorAvatar}
        <span className={ARTICLE_META_PRIMARY_CLASS}>{authorName}</span>
      </div>
    </div>
  );
}
