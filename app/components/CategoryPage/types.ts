export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl?: string;
  imageUnoptimized?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageBlurDataURL?: string;
  slug: string;
  href?: string;
}

export interface CategoryTickerPost {
  tickerTitle: string;
  slug: string;
}

export interface CategoryPageProps {
  categoryName: string;
  hasPosts: boolean;
  categoryDescription?: string;
  latestArticles: Article[];
  mostReadArticles: Article[];
  featuredArticles?: {
    leftColumn: Article[];
    centerArticle: Article;
    rightColumn: Article[];
  };
  categoryTickerPosts?: CategoryTickerPost[];
}

