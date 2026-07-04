"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ImageRenderer } from "../ui/image-renderer";
import type { Article } from "./types";
import { categoryLatestArticleTitle } from "@/app/lib/typography/category-page";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface LatestArticlesSectionProps {
  latestArticles: Article[];
  layout: "mobile" | "desktop";
}

function LatestArticleItem({ article }: { article: Article }) {
  const href = article.href ?? `/post/${article.slug}`;
  const imageSrc =
    article.imageUrl ||
    "/placeholder.svg?height=200&width=300&query=news article";

  return (
    <article className="group">
      <Link
        href={href}
        className="flex items-start gap-3"
        aria-label={`Read article: ${article.title}`}
      >
        {article.imageUrl ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
            <ImageRenderer
              src={imageSrc}
              alt={article.imageAlt?.trim() || article.title}
              width={80}
              height={80}
              fill
              sizes="80px"
              unoptimized={article.imageUnoptimized}
              className="object-cover object-center"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className={categoryLatestArticleTitle}>{article.title}</h3>
          {article.excerpt ? (
            <p className="mt-2 line-clamp-2 text-pretty font-sans text-news-muted text-sm leading-relaxed">
              {article.excerpt}
            </p>
          ) : null}
          <ReadTimeLabel minutes={article.readTime} variant="news" />
        </div>
      </Link>
    </article>
  );
}

export function LatestArticlesSection({
  latestArticles,
  layout,
}: LatestArticlesSectionProps) {
  const [displayedArticles, setDisplayedArticles] = useState(10);

  if (latestArticles.length === 0) {
    return null;
  }

  const articlesToShow = latestArticles.slice(0, displayedArticles);
  const hasMoreArticles = displayedArticles < latestArticles.length;

  const handleShowMore = () => {
    setDisplayedArticles((prev) => Math.min(prev + 10, latestArticles.length));
  };

  const content = (
    <>
      <SectionHeader
        title="Latest Articles"
        accentStyle="modern"
        variant="news"
      />

      <div className="flex flex-col divide-y divide-dotted divide-news-border">
        {articlesToShow.map((article, index) => (
          <div
            key={article.id}
            className={cn(
              "py-4",
              index === 0 && "pt-0",
              !hasMoreArticles && index === articlesToShow.length - 1 && "pb-0",
            )}
          >
            <LatestArticleItem article={article} />
          </div>
        ))}
      </div>

      {hasMoreArticles ? (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleShowMore}
            variant="outline"
            className="font-sans"
          >
            Show More
          </Button>
        </div>
      ) : null}
    </>
  );

  if (layout === "mobile") {
    return <section>{content}</section>;
  }

  return <section>{content}</section>;
}
