import Link from "next/link";
import { postTagPill } from "@/app/lib/typography/post-standard";
import { POST_ARTICLE_BODY_MAX_WIDTH_CLASS } from "../PostBody/constants";
import { cn } from "@/lib/utils";

interface PostTagsRowProps {
  tags: Array<{ name: string; slug: string }>;
}

/**
 * Standard post redesign — outline pill tags row.
 * Scoped to the `post` type; the shared `SuggestedTags` component (used by
 * `sponsored`/`opinion`/`analysis`) is left untouched.
 */
export default function PostTagsRow({ tags }: PostTagsRowProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-9 mb-8 flex flex-wrap gap-2.5",
        POST_ARTICLE_BODY_MAX_WIDTH_CLASS,
      )}
    >
      {tags.map((tag) => (
        <Link key={tag.slug} href={`/tag/${tag.slug}`} className={postTagPill}>
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
