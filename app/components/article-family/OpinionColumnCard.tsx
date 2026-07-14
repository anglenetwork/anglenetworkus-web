import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { getCoverImage } from "@/sanity/lib/utils";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";
import { AnalysisAuthorLine } from "./AnalysisRowCard";

function ArticleImage({
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

export function OpinionColumnCard({
  article,
  padded = true,
  layout = "row",
}: {
  article: CardModel;
  padded?: boolean;
  layout?: "featured" | "row";
}) {
  const isFeatured = layout === "featured";

  return (
    <article
      className={cn("py-6 first:pt-0 last:pb-0", padded && "lg:px-6 lg:py-0")}
    >
      <Link
        href={article.href}
        className={cn(
          "group flex items-start gap-3",
          isFeatured && "flex-col gap-4",
        )}
        aria-label={`Read article: ${article.title || "Opinion article"}`}
      >
        <ArticleImage
          article={article}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-sm bg-news-secondary",
            isFeatured ? "aspect-[16/9] w-full" : "h-20 w-28",
          )}
          sizes={isFeatured ? "(max-width: 1024px) 100vw, 33vw" : "112px"}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className={categorySecondaryRowTitle.light}>
            {article.title || "Untitled"}
          </h3>
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
    </article>
  );
}
