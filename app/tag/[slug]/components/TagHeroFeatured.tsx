import Link from "next/link";
import { cn } from "@/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import {
  categoryHeroHeadline,
  categoryHeroReadTime,
} from "@/app/lib/typography/second-section";
import type { TagPost } from "./types";

interface TagHeroFeaturedProps {
  post: TagPost;
}

export function TagHeroFeatured({ post }: TagHeroFeaturedProps) {
  const href = post.href;
  const imageSrc = post.imageUrl || "/placeholder.svg";
  const imageAlt = post.imageAlt?.trim() || post.title;

  return (
    <article className="group">
      <Link
        href={href}
        className="block"
        aria-label={`Read article: ${post.title}`}
      >
        <div
          className={cn(
            "relative aspect-[16/10] w-full overflow-hidden rounded-sm",
            "bg-news-secondary",
          )}
        >
          <ImageRenderer
            src={imageSrc}
            alt={imageAlt}
            width={1200}
            height={750}
            fill
            sizes="(max-width: 1280px) 100vw, 60vw"
            unoptimized={post.imageUnoptimized}
            className="object-cover object-center"
            priority
            fetchPriority="high"
          />
        </div>
      </Link>
      <div className="relative max-sm:-mt-[30px] max-sm:mr-[15%] max-sm:bg-news-surface max-sm:pt-4 max-sm:pr-4">
        <Link href={href} className="group block">
          <h2
            className={cn(
              "mt-0 max-w-full sm:mt-[26px] xl:max-w-[94%]",
              categoryHeroHeadline,
            )}
          >
            {post.title}
          </h2>
        </Link>
        <ReadTimeLabel
          minutes={post.readTime}
          variant="news"
          className={cn(categoryHeroReadTime, "font-mono")}
        />
      </div>
    </article>
  );
}
