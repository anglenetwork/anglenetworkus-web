import Link from "next/link";
import { ExcerptCreditCaption } from "@/app/helpers";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";

interface FeatureHeroProps {
  article: Article;
  variant?: "light" | "dark";
}

export function FeatureHero({ article, variant = "light" }: FeatureHeroProps) {
  const textColor = variant === "dark" ? "text-white" : "text-neutral-900";

  return (
    <article className="group">
      <Link
        href={article.href ?? `/post/${article.slug}`}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        <div
          className={`relative mb-4 aspect-[16/9] overflow-hidden rounded-lg ${variant === "dark" ? "bg-black" : "bg-muted"}`}
        >
          <ImageRenderer
            src={
              article.imageUrl ||
              "/placeholder.svg?height=400&width=700&query=featured news story"
            }
            alt={article.imageAlt?.trim() || article.title}
            width={1200}
            height={675}
            fill
            sizes="(max-width: 1024px) 60vw, 100vw"
            unoptimized={article.imageUnoptimized}
            className="object-cover"
            priority
          />
        </div>
        <ExcerptCreditCaption
          credit={article.imageCredit}
          align="right"
          variant="compact"
        />
        <h2
          className={`font-sans font-semibold text-2xl md:text-3xl lg:text-3xl ${textColor} text-start leading-snug tracking-tight`}
        >
          {article.title}
        </h2>
      </Link>
    </article>
  );
}
