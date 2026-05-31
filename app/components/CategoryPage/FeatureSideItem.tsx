import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface FeatureSideItemProps {
  article: Article;
  variant?: "light" | "dark";
}

export function FeatureSideItem({
  article,
  variant = "light",
}: FeatureSideItemProps) {
  const href = article.href ?? `/post/${article.slug}`;
  const imageSrc =
    article.imageUrl ||
    "/placeholder.svg?height=200&width=300&query=news article";

  return (
    <article className="group">
      <Link
        href={href}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-sm",
            variant === "dark" ? "bg-black" : "bg-neutral-950",
          )}
        >
          <ImageRenderer
            src={imageSrc}
            alt={article.imageAlt?.trim() || article.title}
            width={400}
            height={300}
            fill
            sizes="(max-width: 1024px) 100vw, 20vw"
            unoptimized={article.imageUnoptimized}
            className="object-cover object-center"
          />
        </div>
      </Link>
      <Link href={href} className="group block">
        <h3 className={cn("mt-2", categorySecondaryRowTitle[variant])}>
          {article.title}
        </h3>
      </Link>
      <ReadTimeLabel minutes={article.readTime} variant={variant} />
    </article>
  );
}
