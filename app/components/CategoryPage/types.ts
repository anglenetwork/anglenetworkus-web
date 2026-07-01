import type { TagsGlimpseItem } from "@/app/components/tags-glimpse";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime?: number | null;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageUnoptimized?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageBlurDataURL?: string;
  slug: string;
  href?: string;
}

export interface CategoryPageProps {
  categoryName: string;
  hasPosts: boolean;
  categoryDescription?: string;
  latestArticles: Article[];
  mostReadArticles: Article[];
  headlineRowArticles?: Article[];
  missedItArticles?: Article[];
  tagsGlimpse?: TagsGlimpseItem[];
  featuredArticles?: {
    leftColumn: Article[];
    centerArticle: Article;
    rightColumn: Article[];
  };
}
