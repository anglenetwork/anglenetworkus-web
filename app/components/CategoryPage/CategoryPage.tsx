"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
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
  slug: string;
}

interface CategoryPageProps {
  categoryName: string;
  categoryDescription?: string;
  latestArticles: Article[];
  mostReadArticles: Article[];
  featuredArticles?: {
    leftColumn: Article[];
    centerArticle: Article;
    rightColumn: Article[];
  };
}

function FeatureHero({ article }: { article: Article }) {
  return (
    <article className="group">
      <Link href={`/post/${article.slug}`} className="block">
        <div className="aspect-[16/9] bg-muted overflow-hidden mb-4 relative rounded-lg">
          <Image
            src={
              article.imageUrl ||
              "/placeholder.svg?height=400&width=700&query=featured news story"
            }
            alt={article.title}
            fill
            unoptimized={article.imageUnoptimized}
            className="object-cover"
            priority
          />
        </div>
        <h2 className="font-sans text-2xl md:text-3xl font-semibold text-foreground leading-tight mb-3 w-full">
          {article.title}
        </h2>
      </Link>
    </article>
  );
}

function FeatureSideItem({ article }: { article: Article }) {
  // Used in both mobile (list style) and desktop (card style) columns
  return (
    <article className="group">
      <Link href={`/post/${article.slug}`} className="block">
        {/* Mobile row style, Desktop card style handled by container classes */}
        <div className="md:hidden flex gap-4">
          <div className="flex-shrink-0 w-24 h-16 bg-muted overflow-hidden relative rounded-lg">
            <Image
              src={
                article.imageUrl ||
                "/placeholder.svg?height=200&width=300&query=news article"
              }
              alt={article.title}
              fill
              unoptimized={article.imageUnoptimized}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-sans text-base font-medium tracking-wide leading-tight">
              {article.title}
            </h3>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="aspect-[4/3] bg-muted overflow-hidden mb-3 relative rounded-lg">
            <Image
              src={
                article.imageUrl ||
                "/placeholder.svg?height=200&width=300&query=news article"
              }
              alt={article.title}
              fill
              unoptimized={article.imageUnoptimized}
              className="object-cover"
            />
          </div>
          <h3 className="font-sans text-base font-medium tracking-wide leading-tight mb-2">
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

function MostReadItem({ article, index }: { article: Article; index: number }) {
  return (
    <article className="group">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 font-secondary bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-sans font-medium text-foreground text-balance leading-tight">
            <Link href={`/post/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-secondary">
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
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
                <Link href={`/post/${article.slug}`} className="block">
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative rounded-lg">
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
                      alt={article.title}
                      fill
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

/* ------------------- Page ---------------------- */

export default function CategoryPage({
  categoryName,
  categoryDescription,
  latestArticles,
  mostReadArticles,
  featuredArticles,
}: CategoryPageProps) {
  const [displayedArticles, setDisplayedArticles] = useState(5);
  const articlesToShow = latestArticles.slice(0, displayedArticles);
  const hasMoreArticles = displayedArticles < latestArticles.length;

  const handleShowMore = () => {
    setDisplayedArticles((prev) => Math.min(prev + 5, latestArticles.length));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl">
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance capitalize">
              {categoryName}
            </h1>
          </div>
        </div>
      </header>

      {/* Featured Articles Module */}
      {featuredArticles && (
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-12">
            {/* Mobile: center hero, then left, then right (stacked) */}
            <div className="block md:hidden space-y-8">
              <FeatureHero article={featuredArticles.centerArticle} />

              <div className="space-y-6">
                {featuredArticles.leftColumn.map((a) => (
                  <FeatureSideItem key={a.id} article={a} />
                ))}
              </div>

              <div className="space-y-6">
                {featuredArticles.rightColumn.map((a) => (
                  <FeatureSideItem key={a.id} article={a} />
                ))}
              </div>
            </div>

            {/* Desktop: 20% - 60% - 20% */}
            <div className="hidden md:grid grid-cols-5 gap-8">
              <div className="col-span-1 space-y-6">
                {featuredArticles.leftColumn.map((a) => (
                  <FeatureSideItem key={a.id} article={a} />
                ))}
              </div>

              <div className="col-span-3">
                <FeatureHero article={featuredArticles.centerArticle} />
              </div>

              <div className="col-span-1 space-y-6">
                {featuredArticles.rightColumn.map((a) => (
                  <FeatureSideItem key={a.id} article={a} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Mobile: Most Read + Latest */}
        <div className="block lg:hidden space-y-12">
          {/* Most Read */}
          <section>
            <h2 className="font-sans text-2xl font-semibold text-foreground mb-6">
              Most Read
            </h2>
            <div className="space-y-6">
              {mostReadArticles.map((article, index) => (
                <div key={article.id}>
                  <MostReadItem article={article} index={index} />
                  {index < mostReadArticles.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Latest Articles */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-sans text-2xl font-semibold text-foreground">
                Latest Articles
              </h2>
            </div>
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
          </section>
        </div>

        {/* Desktop: Latest (main) + Most Read (sidebar) */}
        <div className="hidden lg:grid grid-cols-3 gap-12">
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-sans text-2xl font-semibold text-foreground">
                Latest Articles
              </h2>
            </div>

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
          </div>

          <aside className="col-span-1">
            <div className="sticky top-8">
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-6">
                Most Read
              </h2>
              <div className="space-y-6">
                {mostReadArticles.map((article, index) => (
                  <div key={article.id}>
                    <MostReadItem article={article} index={index} />
                    {index < mostReadArticles.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
