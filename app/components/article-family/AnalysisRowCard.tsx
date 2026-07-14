import Link from "next/link";
import { cn } from "@/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { authorAvatarUrl } from "@/app/components/PostPage/PostBody/media-utils";
import { getCoverImage } from "@/sanity/lib/utils";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";

export function AnalysisAuthorLine({
  author,
  variant = "default",
}: {
  author: CardModel["author"];
  variant?: "default" | "overlay";
}) {
  const authorName = author?.name?.trim() || "Unknown Author";
  const avatarUrl = authorAvatarUrl(author?.picture);
  const initial = authorName.charAt(0).toUpperCase();
  const isOverlay = variant === "overlay";

  return (
    <p
      className={cn(
        "flex items-center gap-2 font-sans text-xs",
        isOverlay ? "text-white/80" : "text-news-muted",
      )}
    >
      {avatarUrl ? (
        <span
          className={cn(
            "relative size-6 shrink-0 overflow-hidden rounded-full",
            isOverlay ? "bg-white/20" : "bg-news-border",
          )}
        >
          <ImageRenderer
            src={avatarUrl}
            alt={authorName}
            width={24}
            height={24}
            fill
            sizes="24px"
            className="object-cover"
          />
        </span>
      ) : (
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full font-sans text-[10px] text-white",
            isOverlay ? "bg-white/20" : "bg-news-text",
          )}
        >
          {initial}
        </span>
      )}
      <span>
        By{" "}
        <span
          className={cn(
            "font-semibold italic",
            isOverlay ? "text-white" : "text-news-text",
          )}
        >
          {authorName}
        </span>
      </span>
    </p>
  );
}

function AnalysisArticleImage({
  article,
  className,
  sizes,
}: {
  article: CardModel;
  className: string;
  sizes: string;
}) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  if (!coverData?.src) {
    return <div className={cn(className, "bg-news-secondary")} aria-hidden />;
  }

  return (
    <div className={cn(className, "bg-news-secondary")}>
      <ImageRenderer
        src={coverData.src}
        alt={coverData.alt}
        width={800}
        height={450}
        fill
        unoptimized={coverData.unoptimized}
        sizes={sizes}
        className="object-cover object-center"
      />
    </div>
  );
}

function AnalysisRowCard({
  article,
  variant = "default",
}: {
  article: CardModel;
  variant?: "default" | "sidebar";
}) {
  const isSidebar = variant === "sidebar";

  return (
    <Link
      href={article.href}
      className="group flex items-start gap-3"
      aria-label={`Read article: ${article.title || "Analysis article"}`}
    >
      <AnalysisArticleImage
        article={article}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-sm",
          isSidebar ? "h-14 w-[4.5rem]" : "h-20 w-28",
        )}
        sizes={isSidebar ? "72px" : "112px"}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className={categorySecondaryRowTitle.light}>
          {article.title || "Untitled"}
        </h3>
        {!isSidebar && article.excerpt ? (
          <p className="line-clamp-2 font-sans text-news-muted text-sm leading-relaxed">
            {article.excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <AnalysisAuthorLine author={article.author} />
          <ReadTimeLabel
            minutes={article.readTime}
            variant="default"
            className="mt-0"
            as="span"
          />
        </div>
      </div>
    </Link>
  );
}

export function AnalysisListSection({
  articles,
  variant = "default",
}: {
  articles: CardModel[];
  variant?: "default" | "sidebar";
}) {
  if (articles.length === 0) return null;

  if (variant === "sidebar") {
    return (
      <div className="flex flex-col divide-y divide-dotted divide-neutral-300">
        {articles.map((article, index) => (
          <div
            key={article._id}
            className={cn(
              "py-5 md:py-6",
              index === 0 && "pt-0",
              index === articles.length - 1 && "pb-0",
            )}
          >
            <AnalysisRowCard article={article} variant={variant} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-dotted divide-neutral-300">
      {articles.map((article) => (
        <div key={article._id} className="py-4">
          <AnalysisRowCard article={article} variant={variant} />
        </div>
      ))}
    </div>
  );
}
