import Image from "next/image";
import Link from "next/link";
import type { Article } from "./types";

interface FeatureSideItemProps {
  article: Article;
}

export function FeatureSideItem({ article }: FeatureSideItemProps) {
  return (
    <article className="group">
      <Link 
        href={`/post/${article.slug}`} 
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        {/* Mobile row style */}
        <div className="md:hidden flex gap-4">
          <div className="flex-shrink-0 w-24 h-16 bg-muted overflow-hidden relative rounded-lg">
            <Image
              src={
                article.imageUrl ||
                "/placeholder.svg?height=200&width=300&query=news article"
              }
              alt=""
              fill
              sizes="96px"
              unoptimized={article.imageUnoptimized}
              placeholder={article.imageBlurDataURL ? "blur" : "empty"}
              blurDataURL={article.imageBlurDataURL}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-sans text-lg sm:text-base font-normal tracking-wide leading-normal">
              {article.title}
            </h3>
          </div>
        </div>

        {/* Desktop card style */}
        <div className="hidden md:block">
          <div className="aspect-[4/3] bg-muted overflow-hidden mb-3 relative rounded-lg">
            <Image
              src={
                article.imageUrl ||
                "/placeholder.svg?height=200&width=300&query=news article"
              }
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, 50vw"
              unoptimized={article.imageUnoptimized}
              placeholder={article.imageBlurDataURL ? "blur" : "empty"}
              blurDataURL={article.imageBlurDataURL}
              className="object-cover"
            />
          </div>
          <h3 className="font-sans text-lg font-normal tracking-wide leading-tight mb-2">
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
