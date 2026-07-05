import Link from "next/link";
import { cn } from "@/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { categoryFeatureHeadline } from "@/app/lib/typography/second-section";
import {
  tagSidebarFeatureReadTime,
  tagSidebarItemNumber,
} from "@/app/lib/typography/tag-page";
import type { TagPost } from "./types";

interface TagSidebarFeatureItemProps {
  post: TagPost;
  number: string;
}

export function TagSidebarFeatureItem({
  post,
  number,
}: TagSidebarFeatureItemProps) {
  const href = post.href;
  const imageSrc = post.imageUrl || "/placeholder.svg";
  const imageAlt = post.imageAlt?.trim() || post.title;

  return (
    <article className="group">
      <div className="sm:hidden">
        <TagSidebarFeatureMobile post={post} number={number} />
      </div>
      <div className="hidden sm:block">
        <span className={cn(tagSidebarItemNumber, "mb-3.5 block")}>
          {number}
        </span>
        <Link
          href={href}
          className="block"
          aria-label={`Read article: ${post.title}`}
        >
          <div
            className={cn(
              "relative aspect-[16/11] w-full overflow-hidden rounded-sm",
              "bg-news-secondary",
            )}
          >
            <ImageRenderer
              src={imageSrc}
              alt={imageAlt}
              width={700}
              height={480}
              fill
              sizes="(max-width: 1279px) 100vw, 25vw"
              unoptimized={post.imageUnoptimized}
              className="object-cover object-center"
            />
          </div>
        </Link>
        <Link href={href} className="group block">
          <h3 className={cn("mt-5", categoryFeatureHeadline)}>{post.title}</h3>
        </Link>
        <ReadTimeLabel
          minutes={post.readTime}
          variant="news"
          className={tagSidebarFeatureReadTime}
        />
      </div>
    </article>
  );
}

function TagSidebarFeatureMobile({ post, number }: TagSidebarFeatureItemProps) {
  const href = post.href;
  const imageSrc = post.imageUrl || "/placeholder.svg";
  const imageAlt = post.imageAlt?.trim() || post.title;

  return (
    <div className="flex flex-row-reverse items-start justify-between gap-[18px] border-news-border border-t border-dotted pt-[18px]">
      <Link
        href={href}
        className={cn(
          "relative size-[76px] shrink-0 overflow-hidden rounded-sm",
          "bg-news-secondary",
        )}
        aria-label={`Read article: ${post.title}`}
      >
        <ImageRenderer
          src={imageSrc}
          alt={imageAlt}
          width={76}
          height={76}
          fill
          sizes="76px"
          unoptimized={post.imageUnoptimized}
          className="object-cover object-center"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <span className={cn(tagSidebarItemNumber, "mb-0 block")}>{number}</span>
        <Link href={href} className="group block">
          <h3 className={categoryFeatureHeadline}>{post.title}</h3>
        </Link>
        <ReadTimeLabel
          minutes={post.readTime}
          variant="news"
          className={tagSidebarFeatureReadTime}
        />
      </div>
    </div>
  );
}
