import { NewsTicker } from "@/app/components/Landing/NewsTicker/NewsTicker";
import type { CategoryTickerPost } from "./types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription?: string;
  categoryTickerPosts?: CategoryTickerPost[];
}

export function CategoryHeader({
  categoryName,
  categoryDescription,
  categoryTickerPosts,
}: CategoryHeaderProps) {
  return (
    <header className="border-news-border border-b bg-news-surface">
      <SitePageWidth className="py-4">
        <div className="">
          <h1 className="text-center font-bold font-display text-4xl text-news-text capitalize md:text-5xl lg:text-6xl">
            {categoryName}
          </h1>
        </div>
      </SitePageWidth>
      {categoryTickerPosts && categoryTickerPosts.length > 0 && (
        <NewsTicker posts={categoryTickerPosts} />
      )}
    </header>
  );
}
