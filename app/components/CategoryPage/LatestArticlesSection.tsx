"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { SectionHeader } from "@/app/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";
import { ImageRenderer } from "../ui/image-renderer";
import { categoryLatestStoryLink } from "@/app/lib/typography/category-page";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl?: string;
  imageUnoptimized?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageBlurDataURL?: string;
  slug: string;
  href?: string;
}

interface LatestArticlesSectionProps {
  latestArticles: Article[];
  layout: "mobile" | "desktop";
}

function formatArticleDateLabel(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function LatestArticleItem({ article }: { article: Article }) {
  const dateLabel = formatArticleDateLabel(article.publishedAt);

  return (
    <article className="group">
      <Card className="border-0 bg-transparent shadow-none transition-colors duration-200">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Image (optional) */}
            {article.imageUrl && (
              <div className="md:col-span-1">
                <Link
                  href={article.href ?? `/post/${article.slug}`}
                  className="block"
                  aria-label={`View image for article: ${article.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    <ImageRenderer
                      src={article.imageUrl || "/placeholder.svg"}
                      alt=""
                      width={600}
                      height={450}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      unoptimized={article.imageUnoptimized}
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
            )}

            {/* Content */}
            <div
              className={`${
                article.imageUrl ? "md:col-span-2" : "md:col-span-3"
              } space-y-3`}
            >
              <div className="flex items-center gap-4 font-sans text-muted-foreground text-sm">
                {dateLabel ? (
                  <time dateTime={article.publishedAt}>{dateLabel}</time>
                ) : null}
                <div className="flex items-center gap-1 font-sans text-neutral-500">
                  <Clock className="size-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h3 className="font-sans font-semibold text-2xl text-neutral-900 leading-snug tracking-tight">
                <Link
                  href={article.href ?? `/post/${article.slug}`}
                  className={categoryLatestStoryLink}
                >
                  {article.title}
                </Link>
              </h3>

              <p className="text-pretty font-sans text-muted-foreground text-sm leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

export function LatestArticlesSection({
  latestArticles,
  layout,
}: LatestArticlesSectionProps) {
  const [displayedArticles, setDisplayedArticles] = useState(5);

  if (latestArticles.length === 0) {
    return null;
  }

  const articlesToShow = latestArticles.slice(0, displayedArticles);
  const hasMoreArticles = displayedArticles < latestArticles.length;

  const handleShowMore = () => {
    setDisplayedArticles((prev) => Math.min(prev + 5, latestArticles.length));
  };

  // Shared content block
  const content = (
    <>
      <SectionHeader
        title="Latest Articles"
        variant="light"
        accentStyle="geometric-square"
        size="large"
      />

      <div className="space-y-8">
        {articlesToShow.map((article, index) => (
          <div key={article.id}>
            <LatestArticleItem article={article} />
            {index < articlesToShow.length - 1 && (
              <Separator className="mt-8" />
            )}
          </div>
        ))}
      </div>

      {hasMoreArticles && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleShowMore}
            variant="outline"
            className="font-sans"
          >
            Show More
          </Button>
        </div>
      )}
    </>
  );

  if (layout === "mobile") {
    return <section>{content}</section>;
  }

  // desktop: content is wrapped by col-span-2 in parent
  return <section>{content}</section>;
}
