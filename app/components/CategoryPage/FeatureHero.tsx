import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExcerptCreditCaption } from "@/app/helpers";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";
import {
  categoryFeaturedDek,
  categoryFeaturedTitle,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface FeatureHeroProps {
  article: Article;
  variant?: "light" | "news" | "dark";
  emphasizeTitleOnXl?: boolean;
}

export function FeatureHero({
  article,
  variant = "light",
  emphasizeTitleOnXl = false,
}: FeatureHeroProps) {
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
            "relative aspect-[16/9] w-full overflow-hidden rounded-sm",
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
      <ExcerptCreditCaption
        credit={article.imageCredit}
        align="right"
        variant="compact"
        className={variant === "dark" ? "text-neutral-400" : undefined}
      />
      <Link href={href} className="group block">
        <h2
          className={cn(
            "mt-4",
            categoryFeaturedTitle[variant],
            emphasizeTitleOnXl && "xl:text-2xl xl:leading-snug",
          )}
        >
          {article.title}
        </h2>
      </Link>
      {article.excerpt ? (
        <p
          className={cn(
            categoryFeaturedDek,
            variant === "dark" && "text-neutral-400",
          )}
        >
          {article.excerpt}
        </p>
      ) : null}
      <ReadTimeLabel
        minutes={article.readTime}
        variant={variant}
        className={variant === "news" ? "text-neutral-600" : undefined}
      />
    </article>
  );
}
