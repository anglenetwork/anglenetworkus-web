import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  postAuthorCardBio,
  postAuthorCardName,
} from "@/app/lib/typography/post-standard";
import { POST_ARTICLE_BODY_MAX_WIDTH_CLASS } from "../PostBody/constants";
import { authorAvatarUrl } from "../PostBody/media-utils";
import { ImageRenderer } from "../../ui/image-renderer";
import type { ArticleFamilyAuthor } from "@/app/lib/article-family/types";

const AUTHOR_BIO_PLACEHOLDER =
  "Author biography not yet available.";

interface PostAuthorCardProps {
  author?: ArticleFamilyAuthor | null;
}

export default function PostAuthorCard({ author }: PostAuthorCardProps) {
  if (!author?.name) return null;

  const avatarUrl = authorAvatarUrl(author.picture);
  const authorInitial = author.name.charAt(0).toUpperCase();
  const bioText = author.shortBio?.trim() || AUTHOR_BIO_PLACEHOLDER;
  const isPlaceholder = !author.shortBio?.trim();
  const nameEl = (
    <span className={postAuthorCardName}>{author.name}</span>
  );

  return (
    <div
      className={cn(
        "mt-3 flex gap-4 border border-neutral-200 bg-stone-50 p-[22px]",
        POST_ARTICLE_BODY_MAX_WIDTH_CLASS,
      )}
    >
      <span className="relative size-[52px] shrink-0 overflow-hidden rounded-full bg-neutral-900">
        {avatarUrl ? (
          <ImageRenderer
            src={avatarUrl}
            alt={author.name}
            width={52}
            height={52}
            fill
            sizes="52px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center font-display font-semibold text-sm text-white">
            {authorInitial}
          </span>
        )}
      </span>
      <div className="min-w-0">
        <p className="mb-1">
          {author.slug ? (
            <Link href={`/author/${author.slug}`} className="hover:underline">
              {nameEl}
            </Link>
          ) : (
            nameEl
          )}
        </p>
        <p
          className={cn(
            postAuthorCardBio,
            isPlaceholder && "italic text-neutral-400",
          )}
        >
          {bioText}
        </p>
      </div>
    </div>
  );
}
