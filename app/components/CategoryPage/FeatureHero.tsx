import Link from "next/link";
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
        <div className="aspect-[16/9] bg-muted overflow-hidden mb-4 relative rounded-lg">
          <ImageRenderer
            src={
              article.imageUrl ||
              "/placeholder.svg?height=400&width=700&query=featured news story"
            }
            alt=""
            width={1200}
            height={675}
            fill
            sizes="(max-width: 1024px) 60vw, 100vw"
            unoptimized={article.imageUnoptimized}
            className="object-cover"
            priority
          />
        </div>
        <h2
          className={`text-2xl md:text-3xl lg:text-3xl font-sans font-semibold ${textColor} leading-snug tracking-tight text-start`}
        >
          {article.title}
        </h2>
      </Link>
    </article>
  );
}
