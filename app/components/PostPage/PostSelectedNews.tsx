import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";
import { postSidebarListTitle } from "@/app/lib/typography/post-page";
import { postSidebarEyebrow } from "@/app/lib/typography/post-standard";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface PostSelectedNewsProps {
  latestNews: ArticleSidebarPost[];
  title: string;
}

export default function PostSelectedNews({
  latestNews,
  title,
}: PostSelectedNewsProps) {
  if (!latestNews || latestNews.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        className={cn(
          "mb-1.5 flex items-center gap-1.5 border-news-text border-b-2 pb-3.5",
          postSidebarEyebrow,
        )}
      >
        <ArrowUpRight
          className="size-3.5 shrink-0"
          strokeWidth={3}
          aria-hidden
        />
        <span>{title}</span>
      </div>

      <div className="flex flex-col">
        {latestNews.slice(0, 4).map((post: ArticleSidebarPost, index) => {
          const coverData = getCoverImage(
            post.cover as Parameters<typeof getCoverImage>[0],
            post.title || "Article image",
          );
          const imgUrl = coverData?.src ?? null;
          const rankLabel = String(index + 1).padStart(2, "0");

          return (
            <article
              key={post._id}
              className={cn(
                "py-4",
                index === 0 && "pt-0",
                index === Math.min(latestNews.length, 4) - 1 && "pb-0",
              )}
            >
              <Link
                href={post.href}
                className="group flex items-start gap-3 xl:flex-row-reverse"
                aria-label={`Read article: ${post.title}`}
              >
                <div className="min-w-0 flex-1">
                  <h3 className={postSidebarListTitle}>{post.title}</h3>
                  <ReadTimeLabel minutes={post.readTime} />
                </div>
                {imgUrl ? (
                  <div className="relative size-[76px] shrink-0 overflow-hidden bg-news-surface">
                    <ImageRenderer
                      src={imgUrl}
                      alt={coverData?.alt || post.title || "Article image"}
                      unoptimized={coverData?.unoptimized}
                      className="object-cover object-center"
                      width={76}
                      height={76}
                      quality={50}
                      sizes="76px"
                      fill
                    />
                    <span
                      className="pointer-events-none absolute right-1 bottom-0.5 font-display font-bold text-[40px] text-news-primary-soft leading-none drop-shadow-sm"
                      aria-hidden
                    >
                      {rankLabel}
                    </span>
                  </div>
                ) : (
                  <div className="relative flex size-[76px] shrink-0 items-center justify-center bg-news-border font-sans text-[10px] text-news-muted">
                    <span
                      className="pointer-events-none absolute right-1 bottom-0.5 font-display font-bold text-[40px] text-news-primary-soft leading-none"
                      aria-hidden
                    >
                      {rankLabel}
                    </span>
                  </div>
                )}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
