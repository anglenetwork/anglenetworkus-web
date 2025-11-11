import Image from "next/image";
import Link from "next/link";
import type { Article } from "./types";

interface FeatureHeroProps {
  article: Article;
}

export function FeatureHero({ article }: FeatureHeroProps) {
  return (
    <article className="group">
      <Link 
        href={`/post/${article.slug}`} 
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        <div className="aspect-[16/9] bg-muted overflow-hidden mb-4 relative rounded-lg">
          <Image
            src={
              article.imageUrl ||
              "/placeholder.svg?height=400&width=700&query=featured news story"
            }
            alt=""
            fill
            sizes="(max-width: 1024px) 60vw, 100vw"
            unoptimized={article.imageUnoptimized}
            placeholder={article.imageBlurDataURL ? "blur" : "empty"}
            blurDataURL={article.imageBlurDataURL}
            className="object-cover"
            priority
          />
        </div>
        <h2 className="font-sans text-2xl font-medium sm:text-3xl sm:font-semibold text-foreground leading-tight mb-3 w-full">
          {article.title}
        </h2>
      </Link>
    </article>
  );
}
