"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../../ui/section-header";
import ArticleFamilyCard from "@/app/components/article-family/ArticleFamilyCard";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt?: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
  date: string;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  readTime?: number | null;
}

interface CategoryData {
  slug: string | null;
  name: string | null;
  thirdArticle: Post | null;
}

interface SeventhSectionProps {
  categoriesData?: CategoryData[];
}

function postToCard(post: Post, categoryLabel: string): CardModel {
  const slug = post.slug || "";
  const catTitle = post.category?.title?.trim() || categoryLabel;
  const catSlug = post.category?.slug?.trim() || "news";
  return {
    _id: post._id,
    _type: "post",
    title: post.title || "Untitled",
    tickerTitle: post.title || "Untitled",
    excerpt: post.excerpt ?? null,
    slug,
    href: slug ? articleFamilyHref("post", slug) : "#",
    cover: post.cover ?? null,
    body: null,
    author: post.author
      ? { name: post.author.name, picture: post.author.picture }
      : null,
    publishedAt: post.date || null,
    updatedAt: null,
    date: post.date,
    seo: null,
    category: { title: catTitle, slug: catSlug },
    tags: null,
  };
}

function fallbackCard(): CardModel {
  return {
    _id: "fallback-1",
    _type: "post",
    title: "Sample Article Title",
    tickerTitle: "Sample Article Title",
    excerpt:
      "This is a sample article description to test the component rendering.",
    slug: "",
    href: "#",
    cover: null,
    body: null,
    author: { name: "Sample Author" },
    publishedAt: null,
    updatedAt: null,
    date: new Date().toISOString(),
    seo: null,
    category: { title: "Sample Category", slug: "sample" },
    tags: null,
  };
}

export default function SeventhSection({
  categoriesData,
}: SeventhSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const rows =
    categoriesData?.flatMap((category) => {
      if (!category.thirdArticle || !category.thirdArticle.slug) {
        return [];
      }
      return [
        {
          id: category.thirdArticle._id,
          categoryName: category.name || "Uncategorized",
          post: category.thirdArticle,
          readTime: category.thirdArticle.readTime || 5,
        },
      ];
    }) ?? [];

  const displayRows =
    rows.length > 0
      ? rows
      : [
          {
            id: "fallback-1",
            categoryName: "Sample Category",
            post: null as Post | null,
            readTime: 5,
          },
        ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -344,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 344,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-news-surface">
      <SectionHeader
        title="Featured Stories"
        variant="news"
        accentStyle="minimal"
      />

      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          aria-label="Scroll left"
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-news-surface shadow-lg hover:bg-news-background"
          onClick={scrollLeft}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          aria-label="Scroll right"
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-news-surface shadow-lg hover:bg-news-background"
          onClick={scrollRight}
        >
          <ChevronRight className="size-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-6 overflow-x-auto px-12"
        >
          {displayRows.map((row) => {
            const card = row.post
              ? postToCard(row.post, row.categoryName)
              : fallbackCard();
            return (
              <div key={row.id} className="w-[300px] flex-shrink-0">
                <ArticleFamilyCard
                  article={card}
                  layout="heroTile"
                  readTimeMinutes={row.readTime}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
