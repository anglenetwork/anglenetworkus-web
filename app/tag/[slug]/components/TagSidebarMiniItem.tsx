import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import {
  tagSidebarItemNumber,
  tagSidebarMiniHeadline,
  tagSidebarMiniReadTime,
} from "@/app/lib/typography/tag-page";
import type { TagPost } from "./types";

interface TagSidebarMiniItemProps {
  post: TagPost;
  number: string;
}

export function TagSidebarMiniItem({ post, number }: TagSidebarMiniItemProps) {
  const href = post.href;

  return (
    <article className="group">
      <Link
        href={href}
        className="flex items-start gap-[18px] border-news-border border-t border-dotted pt-[18px] sm:mt-[22px] sm:pt-[22px]"
        aria-label={`Read article: ${post.title}`}
      >
        <span className={cn(tagSidebarItemNumber, "shrink-0 pt-0.5")}>
          {number}
        </span>
        <div className="min-w-0">
          <h3 className={tagSidebarMiniHeadline}>{post.title}</h3>
          <ReadTimeLabel
            minutes={post.readTime}
            variant="news"
            className={tagSidebarMiniReadTime}
          />
        </div>
      </Link>
    </article>
  );
}
