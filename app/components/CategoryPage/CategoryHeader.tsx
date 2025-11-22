import { NewsTicker } from "@/app/components/Landing/NewsTicker/NewsTicker";
import type { CategoryTickerPost } from "./types";

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
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="">
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold capitalize text-center">
            {categoryName}
          </h1>
        </div>
      </div>
      {categoryTickerPosts && categoryTickerPosts.length > 0 && (
        <NewsTicker posts={categoryTickerPosts} />
      )}
    </header>
  );
}
