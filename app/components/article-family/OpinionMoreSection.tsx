"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import {
  OPINION_CONTENT_OFFSET,
  OPINION_MORE_BATCH_SIZE,
} from "./opinion-index-constants";
import { OpinionGridModule } from "./OpinionGridModule";

type OpinionMoreSectionProps = {
  initialArticles: CardModel[];
  total: number;
};

export default function OpinionMoreSection({
  initialArticles,
  total,
}: OpinionMoreSectionProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = OPINION_CONTENT_OFFSET + articles.length < total;

  const handleSeeMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const start = OPINION_CONTENT_OFFSET + articles.length;
      const response = await fetch(
        `/api/opinion?start=${start}&limit=${OPINION_MORE_BATCH_SIZE}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load more opinion articles");
      }

      const data = (await response.json()) as { articles?: CardModel[] };
      const nextArticles = Array.isArray(data.articles) ? data.articles : [];

      if (nextArticles.length > 0) {
        setArticles((current) => [...current, ...nextArticles]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (articles.length === 0 && !hasMore) {
    return null;
  }

  return (
    <div>
      <OpinionGridModule articles={articles} />
      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={handleSeeMore}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2 font-sans"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                See more
                <ChevronDown className="size-4" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
