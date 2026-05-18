import { ImageRenderer } from "../../ui/image-renderer";
import {
  ARTICLE_META_PRIMARY_CLASS,
  ARTICLE_META_SECONDARY_CLASS,
  ARTICLE_META_TIMESTAMP_CLASS,
} from "./constants";
import { formatArticleTimestamp } from "./date-utils";
import { authorAvatarUrl } from "./media-utils";
import type { ArticleAuthor } from "./types";

interface ArticleBylineProps {
  author?: ArticleAuthor;
  date: string;
  updatedAt?: string | null;
}

export default function ArticleByline({
  author,
  date,
  updatedAt,
}: ArticleBylineProps) {
  const authorName = author?.name || "Unknown Author";
  const avatarUrl = authorAvatarUrl(author?.picture);
  const authorInitial = authorName.charAt(0).toUpperCase();
  const displayDate = updatedAt || date;

  return (
    <div className="font-sans">
      <p className={ARTICLE_META_TIMESTAMP_CLASS}>
        {updatedAt && updatedAt !== date ? "Updated" : "Published"}{" "}
        {formatArticleTimestamp(displayDate)}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className={ARTICLE_META_SECONDARY_CLASS}>By</span>
        {avatarUrl ? (
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-200">
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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-sans text-xs font-semibold text-white">
            {authorInitial}
          </span>
        )}
        <span className={ARTICLE_META_PRIMARY_CLASS}>{authorName}</span>
      </div>
    </div>
  );
}
