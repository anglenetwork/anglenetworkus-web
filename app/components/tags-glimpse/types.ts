import type { FeaturedStoryArticle } from "@/app/components/ui/featured-story-column";

export type TagsGlimpseItem = {
  tagSlug: string;
  tagTitle: string;
  article: FeaturedStoryArticle;
};

export type TagsGlimpseProps = {
  items: TagsGlimpseItem[];
  variant?: "news" | "dark";
};
