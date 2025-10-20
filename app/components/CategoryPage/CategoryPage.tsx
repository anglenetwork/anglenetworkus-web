"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl?: string;
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

// Helper function to format relative time
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const publishedDate = new Date(dateString);
  const diffInHours = Math.floor(
    (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(
      (now.getTime() - publishedDate.getTime()) / (1000 * 60)
    );
    return diffInMinutes <= 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }
}

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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance capitalize">
              {categoryName}
            </h1>
          </div>
        </div>
      </header>

      {/* Featured Articles Module - 3 columns (20% - 60% - 20%) */}
      {featuredArticles && (
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-12">
            {/* Mobile Layout: Center, Left, Right */}
            <div className="block md:hidden space-y-8">
              {/* 1. Center Column - Mobile */}
              <article className="group">
                <a
                  href={`/post/${featuredArticles.centerArticle.slug}`}
                  className="block"
                >
                  <div className="aspect-[16/9] bg-muted overflow-hidden mb-4 relative">
                    <Image
                      src={
                        featuredArticles.centerArticle.imageUrl ||
                        "/placeholder.svg?height=400&width=700&query=featured news story" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={featuredArticles.centerArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h2 className="font-outfit text-2xl font-semibold text-foreground leading-tight mb-3 w-full">
                    {featuredArticles.centerArticle.title}
                  </h2>
                  {featuredArticles.centerArticle.excerpt && (
                    <p className="text-muted-foreground leading-relaxed text-sm mb-3 font-inter">
                      {featuredArticles.centerArticle.excerpt}
                    </p>
                  )}
                </a>
              </article>

              {/* 2. Left Column - Mobile */}
              <div className="space-y-6">
                {featuredArticles.leftColumn.map((article) => (
                  <article key={article.id} className="group">
                    <a href={`/post/${article.slug}`} className="block">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 h-16 bg-muted overflow-hidden relative">
                          <Image
                            src={
                              article.imageUrl ||
                              "/placeholder.svg?height=200&width=300&query=news article"
                            }
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-outfit text-sm font-semibold tracking-wide leading-tight">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>

              {/* 3. Right Column - Mobile */}
              <div className="space-y-6">
                {featuredArticles.rightColumn.map((article) => (
                  <article key={article.id} className="group">
                    <a href={`/post/${article.slug}`} className="block">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 h-16 bg-muted overflow-hidden relative">
                          <Image
                            src={
                              article.imageUrl ||
                              "/placeholder.svg?height=200&width=300&query=news article"
                            }
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-outfit text-sm font-semibold tracking-wide leading-tight">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </div>

            {/* Desktop Layout: Left, Center, Right */}
            <div className="hidden md:grid grid-cols-5 gap-8">
              {/* Left Column - 20% */}
              <div className="col-span-1 space-y-6">
                {featuredArticles.leftColumn.map((article) => (
                  <article key={article.id} className="group">
                    <a href={`/post/${article.slug}`} className="block">
                      <div className="aspect-[4/3] bg-muted  overflow-hidden mb-3 relative">
                        <Image
                          src={
                            article.imageUrl ||
                            "/placeholder.svg?height=200&width=300&query=news article"
                          }
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-outfit text-sm font-semibold tracking-wide leading-tight mb-2">
                        {article.title}
                      </h3>
                    </a>
                  </article>
                ))}
              </div>

              {/* Center Column - 60% */}
              <div className="col-span-3">
                <article className="group">
                  <a
                    href={`/post/${featuredArticles.centerArticle.slug}`}
                    className="block"
                  >
                    <div className="aspect-[16/9] bg-muted  overflow-hidden mb-4 relative">
                      <Image
                        src={
                          featuredArticles.centerArticle.imageUrl ||
                          "/placeholder.svg?height=400&width=700&query=featured news story" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={featuredArticles.centerArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h2 className="font-outfit text-2xl md:text-3xl font-semibold text-foreground leading-tight mb-3 w-full">
                      {featuredArticles.centerArticle.title}
                    </h2>
                    {featuredArticles.centerArticle.excerpt && (
                      <p className="text-muted-foreground leading-relaxed text-sm mb-3 font-inter">
                        {featuredArticles.centerArticle.excerpt}
                      </p>
                    )}
                  </a>
                </article>
              </div>

              {/* Right Column - 20% */}
              <div className="col-span-1 space-y-6">
                {featuredArticles.rightColumn.map((article) => (
                  <article key={article.id} className="group">
                    <a href={`/post/${article.slug}`} className="block">
                      <div className="aspect-[4/3] bg-muted  overflow-hidden mb-3 relative">
                        <Image
                          src={
                            article.imageUrl ||
                            "/placeholder.svg?height=200&width=300&query=news article"
                          }
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-outfit text-sm font-semibold  tracking-wide leading-tight mb-2">
                        {article.title}
                      </h3>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Mobile Layout: Most Read, Latest Articles */}
        <div className="block lg:hidden space-y-12">
          {/* 4. Most Read - Mobile */}
          <section>
            <h2 className="font-outfit text-2xl font-semibold text-foreground mb-6">
              Most Read
            </h2>
            <div className="space-y-6">
              {mostReadArticles.map((article, index) => (
                <article key={article.id} className="group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-outfit font-medium text-foreground text-balance leading-tight">
                        <a
                          href={`/post/${article.slug}`}
                          className="hover:underline"
                        >
                          {article.title}
                        </a>
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-inter">
                        <span>{article.author}</span>
                        <span>•</span>
                        <time dateTime={article.publishedAt}>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </time>
                      </div>
                    </div>
                  </div>
                  {index < mostReadArticles.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* 5. Latest Articles - Mobile */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-outfit text-2xl font-semibold text-foreground">
                Latest Articles
              </h2>
            </div>
            <div className="space-y-8">
              {articlesToShow.map((article, index) => (
                <article key={article.id} className="group">
                  <Card className="border-0 shadow-none bg-transparent transition-colors duration-200">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Article Image */}
                        {article.imageUrl && (
                          <div className="md:col-span-1">
                            <a href={`/post/${article.slug}`} className="block">
                              <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                                <Image
                                  src={article.imageUrl || "/placeholder.svg"}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </a>
                          </div>
                        )}

                        {/* Article Content */}
                        <div
                          className={`${article.imageUrl ? "md:col-span-2" : "md:col-span-3"} space-y-3`}
                        >
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter">
                            <time dateTime={article.publishedAt}>
                              {new Date(article.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </time>
                            <div className="flex items-center gap-1 text-neutral-500 font-inter">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>

                          <h3 className="font-outfit text-xl md:text-2xl font-semibold text-foreground text-balance leading-tight">
                            <a
                              href={`/post/${article.slug}`}
                              className="hover:underline"
                            >
                              {article.title}
                            </a>
                          </h3>

                          <p className="text-muted-foreground leading-relaxed text-pretty font-inter">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-inter">
                              <span>by {article.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {index < articlesToShow.length - 1 && (
                    <Separator className="mt-8" />
                  )}
                </article>
              ))}
            </div>

            {/* Show More Button */}
            {hasMoreArticles && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleShowMore}
                  variant="outline"
                  className="font-inter"
                >
                  Show More
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Desktop Layout: Latest Articles, Most Read */}
        <div className="hidden lg:grid grid-cols-3 gap-12">
          {/* Latest Articles - Main Column */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-outfit text-2xl font-semibold text-foreground">
                Latest Articles
              </h2>
            </div>

            <div className="space-y-8">
              {articlesToShow.map((article, index) => (
                <article key={article.id} className="group">
                  <Card className="border-0 shadow-none bg-transparent transition-colors duration-200">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Article Image */}
                        {article.imageUrl && (
                          <div className="md:col-span-1">
                            <a href={`/post/${article.slug}`} className="block">
                              <div className="aspect-[4/3] bg-muted  overflow-hidden relative">
                                <Image
                                  src={article.imageUrl || "/placeholder.svg"}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </a>
                          </div>
                        )}

                        {/* Article Content */}
                        <div
                          className={`${article.imageUrl ? "md:col-span-2" : "md:col-span-3"} space-y-3`}
                        >
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter">
                            <time dateTime={article.publishedAt}>
                              {new Date(article.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </time>
                            <div className="flex items-center gap-1 text-neutral-500 font-inter">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>

                          <h3 className="font-outfit text-xl md:text-2xl font-semibold text-foreground text-balance leading-tight">
                            <a
                              href={`/post/${article.slug}`}
                              className="hover:underline"
                            >
                              {article.title}
                            </a>
                          </h3>

                          <p className="text-muted-foreground leading-relaxed text-pretty font-inter text-sm">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-muted-foreground font-inter text-xs">
                              <span>by {article.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {index < articlesToShow.length - 1 && (
                    <Separator className="mt-8" />
                  )}
                </article>
              ))}
            </div>

            {/* Show More Button */}
            {hasMoreArticles && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleShowMore}
                  variant="outline"
                  className="font-inter"
                >
                  Show More
                </Button>
              </div>
            )}
          </div>

          {/* Most Read Sidebar */}
          <aside className="col-span-1">
            <div className="sticky top-8">
              <h2 className="font-outfit text-2xl font-semibold text-foreground mb-6">
                Most Read
              </h2>

              <div className="space-y-6">
                {mostReadArticles.map((article, index) => (
                  <article key={article.id} className="group">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="font-outfit font-medium text-foreground text-balance leading-tight">
                          <a
                            href={`/post/${article.slug}`}
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-inter">
                          <span>{article.author}</span>
                          <span>•</span>
                          <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </time>
                        </div>
                      </div>
                    </div>

                    {index < mostReadArticles.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
