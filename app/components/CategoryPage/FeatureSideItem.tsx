import Link from "next/link";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";
import {
  categoryFeatureSideDesktopTitle,
  categoryFeatureSideTitle,
} from "@/app/lib/typography/category-page";

interface FeatureSideItemProps {
  article: Article;
  variant?: "light" | "dark";
}

export function FeatureSideItem({
  article,
  variant = "light",
}: FeatureSideItemProps) {
  const textColor = variant === "dark" ? "text-white" : "";
  const desktopTextColor =
    variant === "dark" ? "text-white" : "text-neutral-900";
  const imageFrameClass =
    variant === "dark"
      ? "overflow-hidden rounded-lg bg-black"
      : "overflow-hidden rounded-lg bg-muted";

  return (
    <article className="group">
      <Link
        href={article.href ?? `/post/${article.slug}`}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        {/* Mobile row style */}
        <div className="flex gap-4 md:hidden">
          <div className={`relative h-16 w-24 shrink-0 ${imageFrameClass}`}>
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
            <h3 className={`${categoryFeatureSideTitle} ${textColor}`}>
              {article.title}
            </h3>
          </div>
        </div>

        {/* Desktop card style */}
        <div className="hidden md:block">
          <div className={`relative mb-3 aspect-[4/3] ${imageFrameClass}`}>
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
          <h3
            className={`${categoryFeatureSideDesktopTitle} ${desktopTextColor}`}
          >
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
