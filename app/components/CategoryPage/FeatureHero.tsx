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
        <h2 className="text-2xl md:text-3xl lg:text-3xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight text-start">
          {article.title}
        </h2>
      </Link>
    </article>
  );
}
