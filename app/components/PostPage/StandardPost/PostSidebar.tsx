import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../../ui/image-renderer";
import { ReadTimeLabel } from "../../ui/read-time-label";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";
import {
  postSidebarEyebrow,
  postSidebarRankedTitle,
  postSidebarRankNumber,
  postSidebarThumbTitle,
} from "@/app/lib/typography/post-standard";
import NewsletterSignup from "./NewsletterSignup";

interface PostSidebarProps {
  popularReads: ArticleSidebarPost[];
  newsForYou: ArticleSidebarPost[];
}

const SIDEBAR_ITEM_LIMIT = 4;

export default function PostSidebar({
  popularReads,
  newsForYou,
}: PostSidebarProps) {
  const hasPopular = popularReads.length > 0;
  const hasNewsForYou = newsForYou.length > 0;

  if (!hasPopular && !hasNewsForYou) return null;

  return (
    <aside className="lg:sticky lg:top-6">
      {hasPopular && (
        <div
          className="mb-11 hidden lg:block"
          data-testid="sidebar-popular-reads"
        >
          <SidebarEyebrow label="Popular Reads" />
          <div className="flex flex-col">
            {popularReads.slice(0, SIDEBAR_ITEM_LIMIT).map((post, index) => (
              <PopularReadItem key={post._id} post={post} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {hasNewsForYou && (
        <div className="mb-11">
          <SidebarEyebrow label="News for You" />
          <div className="flex flex-col">
            {newsForYou.slice(0, SIDEBAR_ITEM_LIMIT).map((post) => (
              <NewsForYouItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}

      <NewsletterSignup />
    </aside>
  );
}

function SidebarEyebrow({ label }: { label: string }) {
  return (
    <div
      className={cn(
        "mb-1.5 flex items-center gap-1.5 border-neutral-900 border-b-2 pb-3.5",
        postSidebarEyebrow,
      )}
    >
      <ArrowUpRight className="size-3.5 shrink-0" strokeWidth={3} aria-hidden />
      <span>{label}</span>
    </div>
  );
}

function PopularReadItem({
  post,
  rank,
}: {
  post: ArticleSidebarPost;
  rank: number;
}) {
  return (
    <Link
      href={post.href}
      className="group flex items-center gap-3.5 border-neutral-200 border-b py-4 first:pt-0"
      aria-label={`Read article: ${post.title}`}
    >
      <span className={cn(postSidebarRankNumber, "w-8 shrink-0")}>
        {String(rank).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={postSidebarRankedTitle}>{post.title}</h3>
        <ReadTimeLabel
          minutes={post.readTime}
          variant="inline"
          className="mt-1.5"
        />
      </div>
    </Link>
  );
}

function NewsForYouItem({ post }: { post: ArticleSidebarPost }) {
  const coverData = getCoverImage(
    post.cover as Parameters<typeof getCoverImage>[0],
    post.title || "Article image",
  );
  const imgUrl = coverData?.src ?? null;

  return (
    <Link
      href={post.href}
      className="group flex items-start gap-3.5 border-neutral-200 border-b py-4 first:pt-0"
      aria-label={`Read article: ${post.title}`}
    >
      {imgUrl ? (
        <div className="relative size-[76px] shrink-0 overflow-hidden bg-neutral-100">
          <ImageRenderer
            src={imgUrl}
            alt={coverData?.alt || post.title || "Article image"}
            unoptimized={coverData?.unoptimized}
            className="object-cover"
            width={76}
            height={76}
            quality={55}
            sizes="76px"
            fill
          />
        </div>
      ) : (
        <div className="flex size-[76px] shrink-0 items-center justify-center bg-neutral-100 font-sans text-[10px] text-neutral-400">
          No Image
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className={postSidebarThumbTitle}>{post.title}</h3>
        <ReadTimeLabel
          minutes={post.readTime}
          variant="inline"
          className="mt-1.5"
        />
      </div>
    </Link>
  );
}
