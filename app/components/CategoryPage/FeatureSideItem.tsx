import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";
import {
  categoryFeatureHeadline,
  categoryFeatureReadTime,
  categorySecondaryRowTitle,
  categoryTextItemReadTime,
  categoryTextItemTitle,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface FeatureSideItemProps {
  article: Article;
  variant?: "light" | "news" | "dark";
  layout?: "stacked" | "compact" | "mini" | "feature";
}

function MiniRow({
  href,
  title,
  imageSrc,
  imageAlt,
  imageUnoptimized,
  readTime,
  variant,
}: {
  href: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  readTime?: number | null;
  variant: "light" | "news" | "dark";
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_4.75rem] items-start gap-x-6">
      <div className="min-w-0">
        <Link href={href} className="block">
          <h3 className={categoryTextItemTitle}>{title}</h3>
        </Link>
        <ReadTimeLabel
          minutes={readTime}
          variant={variant}
          className={categoryTextItemReadTime}
        />
      </div>
      <Link
        href={href}
        className={cn(
          "relative aspect-square w-full shrink-0 overflow-hidden",
          "bg-news-secondary",
        )}
        aria-label={`Read article: ${title}`}
      >
        <ImageRenderer
          src={imageSrc}
          alt={imageAlt}
          width={76}
          height={76}
          fill
          sizes="76px"
          unoptimized={imageUnoptimized}
          className="object-cover object-center"
        />
      </Link>
    </div>
  );
}

export function FeatureSideItem({
  article,
  variant = "light",
  layout = "stacked",
}: FeatureSideItemProps) {
  const href = article.href ?? `/post/${article.slug}`;
  const imageSrc =
    article.imageUrl ||
    "/placeholder.svg?height=200&width=300&query=news article";
  const imageAlt = article.imageAlt?.trim() || article.title;
  const readTimeClassName = variant === "news" ? "text-news-muted" : undefined;

  if (layout === "mini") {
    return (
      <article className="group">
        <MiniRow
          href={href}
          title={article.title}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          imageUnoptimized={article.imageUnoptimized}
          readTime={article.readTime}
          variant={variant}
        />
      </article>
    );
  }

  if (layout === "feature") {
    return (
      <article className="group">
        <div className="lg:hidden">
          <MiniRow
            href={href}
            title={article.title}
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            imageUnoptimized={article.imageUnoptimized}
            readTime={article.readTime}
            variant={variant}
          />
        </div>
        <div className="hidden lg:block">
          <Link
            href={href}
            className="block"
            aria-label={`Read article: ${article.title}`}
          >
            <div
              className={cn(
                "relative aspect-[16/11] w-full overflow-hidden",
                "bg-news-secondary",
              )}
            >
              <ImageRenderer
                src={imageSrc}
                alt={imageAlt}
                width={700}
                height={480}
                fill
                sizes="(max-width: 1279px) 100vw, 25vw"
                unoptimized={article.imageUnoptimized}
                className="object-cover object-center"
              />
            </div>
          </Link>
          <Link href={href} className="group block">
            <h3 className={cn("mt-5", categoryFeatureHeadline)}>
              {article.title}
            </h3>
          </Link>
          <ReadTimeLabel
            minutes={article.readTime}
            variant={variant}
            className={categoryFeatureReadTime}
          />
        </div>
      </article>
    );
  }

  if (layout === "compact") {
    return (
      <article className="group">
        <div className="flex items-start gap-3">
          <Link
            href={href}
            className={cn(
              "relative h-20 w-28 shrink-0 overflow-hidden",
              "bg-news-secondary",
            )}
            aria-label={`Read article: ${article.title}`}
          >
            <ImageRenderer
              src={imageSrc}
              alt={article.imageAlt?.trim() || article.title}
              width={112}
              height={80}
              fill
              sizes="112px"
              unoptimized={article.imageUnoptimized}
              className="object-cover object-center"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={href} className="block">
              <h3 className={categorySecondaryRowTitle[variant]}>
                {article.title}
              </h3>
            </Link>
            <ReadTimeLabel
              minutes={article.readTime}
              variant={variant}
              className={readTimeClassName}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group">
      <Link
        href={href}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden",
            "bg-news-secondary",
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
      <ReadTimeLabel
        minutes={article.readTime}
        variant={variant}
        className={readTimeClassName}
      />
    </article>
  );
}
