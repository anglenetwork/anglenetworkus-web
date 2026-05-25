"use client";

import { useRef } from "react";
import ArticleCard from "./article-card";
import ArticleCardAlternative from "./articleCardAlternative";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCoverImage, formatImageCredit } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";

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
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
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

interface SixthSectionProps {
  categoriesData?: CategoryData[];
}

export default function SixthSection({ categoriesData }: SixthSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Transform the data into the format expected by ArticleCard
  const stories =
    categoriesData?.flatMap((category) => {
      // Skip categories that don't have a 3rd article
      if (!category.thirdArticle || !category.thirdArticle.slug) {
        return [];
      }

      return [
        {
          id: category.thirdArticle._id,
          category: category.name || "Uncategorized",
          title: category.thirdArticle.title || "Untitled",
          description: category.thirdArticle.excerpt || "",
          author: category.thirdArticle.author?.name || "Anonymous",
          image: category.thirdArticle.cover
            ? getCoverImage(
                category.thirdArticle.cover,
                category.thirdArticle.title || "Article image",
              )?.src
            : undefined,
          imageAlt: category.thirdArticle.cover
            ? getCoverImage(
                category.thirdArticle.cover,
                category.thirdArticle.title || "Article image",
              )?.alt ||
              category.thirdArticle.title ||
              "Article image"
            : "Article image",
          imageUnoptimized: category.thirdArticle.cover
            ? getCoverImage(
                category.thirdArticle.cover,
                category.thirdArticle.title || "Article image",
              )?.unoptimized || false
            : false,
          imageSource:
            formatImageCredit(category.thirdArticle.cover) || undefined,
          isDecorative: !category.thirdArticle.cover,
          slug: category.thirdArticle.slug,
          readTime: category.thirdArticle.readTime || 5,
        },
      ];
    }) || [];

  // Fallback content if no stories are available
  const displayStories =
    stories.length > 0
      ? stories
      : [
          {
            id: "fallback-1",
            category: "Sample Category",
            title: "Sample Article Title",
            description:
              "This is a sample article description to test the component rendering.",
            author: "Sample Author",
            image: undefined,
            imageAlt: "Sample image",
            imageUnoptimized: false,
            imageSource: undefined,
            isDecorative: true,
            slug: "#",
            readTime: 5,
          },
        ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -344, // Card width (320px) + gap (24px)
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 344, // Card width (320px) + gap (24px)
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="px-6">
        {/* Title Section */}
        <SectionHeader
          title="Featured Stories"
          variant="light"
          accentStyle="geometric-square"
          size="large"
        />

        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            aria-label="Scroll left"
            className="absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            aria-label="Scroll right"
            className="absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Horizontal Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto px-12"
          >
            {displayStories.map((story) => (
              <div key={story.id} className="w-[300px] flex-shrink-0">
                <ArticleCardAlternative
                  category={story.category}
                  title={story.title}
                  description={story.description}
                  author={story.author}
                  image={story.image}
                  imageAlt={story.imageAlt}
                  imageUnoptimized={story.imageUnoptimized}
                  imageSource={story.imageSource}
                  isDecorative={story.isDecorative}
                  slug={story.slug}
                  readTime={story.readTime}
                />
              </div>
            ))}
            {/* Original ArticleCard (commented out for now)
            {displayStories.map((story) => (
              <ArticleCard
                key={story.id}
                category={story.category}
                title={story.title}
                description={story.description}
                author={story.author}
                image={story.image}
                imageAlt={story.imageAlt}
                isDecorative={story.isDecorative}
              />
            ))}
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
