"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { AnalysisListSection } from "./AnalysisRowCard";
import {
  ANALYSIS_HERO_COUNT,
  ANALYSIS_MORE_BATCH_SIZE,
} from "./analysis-index-constants";

type AnalysisMoreSectionProps = {
  initialArticles: CardModel[];
  total: number;
};

export default function AnalysisMoreSection({
  initialArticles,
  total,
}: AnalysisMoreSectionProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = ANALYSIS_HERO_COUNT + articles.length < total;

  const handleSeeMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const start = ANALYSIS_HERO_COUNT + articles.length;
      const response = await fetch(
        `/api/analysis?start=${start}&limit=${ANALYSIS_MORE_BATCH_SIZE}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load more analysis articles");
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
      <AnalysisListSection articles={articles} />
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
