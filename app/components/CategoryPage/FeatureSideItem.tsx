import Link from "next/link";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";

interface FeatureSideItemProps {
  article: Article;
  variant?: "light" | "dark";
}

export function FeatureSideItem({ article, variant = "light" }: FeatureSideItemProps) {
  const textColor = variant === "dark" ? "text-white" : "";
  const desktopTextColor = variant === "dark" ? "text-white" : "text-neutral-900";
  
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
            <ImageRenderer
              src={
                article.imageUrl ||
                "/placeholder.svg?height=200&width=300&query=news article"
              }
              alt=""
              width={96}
              height={64}
              fill
              sizes="96px"
              unoptimized={article.imageUnoptimized}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className={`font-sans text-lg sm:text-base font-normal tracking-wide leading-normal ${textColor}`}>
              {article.title}
            </h3>
          </div>
        </div>

        {/* Desktop card style */}
        <div className="hidden md:block">
          <div className="aspect-[4/3] bg-muted overflow-hidden mb-3 relative rounded-lg">
            <ImageRenderer
              src={
                article.imageUrl ||
                "/placeholder.svg?height=200&width=300&query=news article"
              }
              alt=""
              width={400}
              height={300}
              fill
              sizes="(min-width: 1024px) 20vw, 50vw"
              unoptimized={article.imageUnoptimized}
              className="object-cover"
            />
          </div>
          <h3 className={`text-lg font-sans font-normal ${desktopTextColor} leading-snug tracking-normal mb-2`}>
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
