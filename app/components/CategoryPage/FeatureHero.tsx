import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";
import {
  categoryFeaturedDek,
  categoryHeroHeadline,
  categoryHeroReadTime,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface FeatureHeroProps {
  article: Article;
  variant?: "light" | "news" | "dark";
}

export function FeatureHero({ article, variant = "light" }: FeatureHeroProps) {
  const href = article.href ?? `/post/${article.slug}`;
  const imageSrc =
    article.imageUrl ||
    "/placeholder.svg?height=400&width=700&query=featured news story";

  return (
    <article className="group">
      <Link
        href={href}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        <div
          className={cn(
            "relative aspect-[16/10] w-full overflow-hidden",
            "bg-news-secondary",
          )}
        >
          <ImageRenderer
            src={imageSrc}
            alt={article.imageAlt?.trim() || article.title}
            width={1200}
            height={675}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            unoptimized={article.imageUnoptimized}
            className="object-cover object-center"
            priority
          />
        </div>
      </Link>
      <div className="relative max-sm:-mt-[30px] max-sm:mr-[15%] max-sm:bg-news-background max-sm:pt-4 max-sm:pr-4">
        <Link href={href} className="group block">
          <h2
            className={cn(
              "mt-0 max-w-full sm:mt-[26px] lg:max-w-[94%]",
              categoryHeroHeadline,
            )}
          >
            {article.title}
          </h2>
        </Link>
        <ReadTimeLabel
          minutes={article.readTime}
          variant={variant}
          className={categoryHeroReadTime}
        />
      </div>
      {article.excerpt ? (
        <p
          className={cn(
            categoryFeaturedDek,
            "hidden lg:block",
            variant === "dark" && "text-news-muted",
          )}
        >
          {article.excerpt}
        </p>
      ) : null}
    </article>
  );
}
