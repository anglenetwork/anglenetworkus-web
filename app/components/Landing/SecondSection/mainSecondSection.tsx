"use client";

import { useRef } from "react";
import ArticleCard from "./article-card";
import ArticleCardAlternative from "./articleCardAlternative";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
  date: string;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  views7d?: number | null;
  readTime?: number | null;
}

interface CategoryData {
  slug: string | null;
  name: string | null;
  thirdArticle: Post | null;
}

interface MainSecondSectionProps {
  categoriesData?: CategoryData[];
}

export default function MainSecondSection({
  categoriesData,
}: MainSecondSectionProps) {
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
          image: category.thirdArticle.coverImage
            ? urlForImage(category.thirdArticle.coverImage)?.url()
            : undefined,
          imageAlt: category.thirdArticle.title || "Article image",
          isDecorative: !category.thirdArticle.coverImage,
          slug: category.thirdArticle.slug,
          views7d: category.thirdArticle.views7d || 0,
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
            isDecorative: true,
            slug: "#",
            views7d: 0,
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
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-secondary">
            Featured Stories
          </h2>
        </div>

        <div className="border-b border-gray-300 mb-6"></div>

        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Horizontal Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayStories.map((story) => (
              <div key={story.id} className="flex-shrink-0 w-[300px]">
                <ArticleCardAlternative
                  category={story.category}
                  title={story.title}
                  description={story.description}
                  author={story.author}
                  image={story.image}
                  imageAlt={story.imageAlt}
                  isDecorative={story.isDecorative}
                  slug={story.slug}
                  views7d={story.views7d}
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
