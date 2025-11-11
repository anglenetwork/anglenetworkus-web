"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { SectionHeader } from "@/app/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
}

interface LatestArticlesSectionProps {
  latestArticles: Article[];
  layout: "mobile" | "desktop";
}

function LatestArticleItem({ article }: { article: Article }) {
  return (
    <article className="group">
      <Card className="border-0 shadow-none bg-transparent transition-colors duration-200">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image (optional) */}
            {article.imageUrl && (
              <div className="md:col-span-1">
                <Link 
                  href={`/post/${article.slug}`} 
                  className="block"
                  aria-label={`View image for article: ${article.title}`}
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative rounded-lg">
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      unoptimized={article.imageUnoptimized}
                      placeholder={article.imageBlurDataURL ? "blur" : "empty"}
                      blurDataURL={article.imageBlurDataURL}
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
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-secondary">
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <div className="flex items-center gap-1 text-neutral-500 font-secondary">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h3 className="font-sans text-xl md:text-2xl font-semibold text-foreground text-balance leading-tight">
                <Link
                  href={`/post/${article.slug}`}
                  className="hover:underline"
                >
                  {article.title}
                </Link>
              </h3>

              <p className="text-muted-foreground leading-relaxed text-pretty font-secondary text-sm">
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
  const articlesToShow = latestArticles.slice(0, displayedArticles);
  const hasMoreArticles = displayedArticles < latestArticles.length;

  const handleShowMore = () => {
    setDisplayedArticles((prev) => Math.min(prev + 5, latestArticles.length));
  };

  // Shared content block
  const content = (
    <>
      <SectionHeader title="Latest Articles" variant="gradient" />

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
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleShowMore}
            variant="outline"
            className="font-secondary"
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
