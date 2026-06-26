"use client";

import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import EditorialListMoreSection from "./EditorialListMoreSection";

type OpinionMoreSectionProps = {
  initialArticles: CardModel[];
  total: number;
};

export default function OpinionMoreSection({
  initialArticles,
  total,
}: OpinionMoreSectionProps) {
  return (
    <EditorialListMoreSection
      initialArticles={initialArticles}
      total={total}
      apiPath="/api/opinion"
    />
  );
}
