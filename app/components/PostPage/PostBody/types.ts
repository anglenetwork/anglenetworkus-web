import type { ArticleSidebarPost } from "@/app/lib/article-family/types";
import type { ImageMetaInput } from "@/sanity/lib/utils";

export interface ArticleImageSource extends ImageMetaInput {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: unknown;
  alt?: string | null;
  lqip?: string | null;
}

export interface ResolvedArticleImage {
  src: string;
  alt: string;
  unoptimized: boolean;
  blurDataURL?: string | null;
  caption?: string | null;
  credit?: string | null;
  licenseOrRights?: string | null;
}

export interface ArticleAuthor {
  name: string;
  picture?: unknown;
}

export interface PostBodyProps {
  /** Public path for sharing (e.g. /opinion/slug). Defaults to /post/{slug} when omitted. */
  sharePath?: string;
  variant?: "default" | "editorial" | "post";
  /** Cover/carousel sizing; defaults from variant (editorial → smaller non-regular hero). */
  mediaPresentation?: MediaPresentation;
  body?: unknown[] | null;
  cover?: ArticleImageSource | null;
  imageGallery?: ArticleImageSource[] | null;
  title: string;
  author?: ArticleAuthor;
  date: string;
  updatedAt?: string | null;
  slug?: string;
  articleId?: string;
  readTime?: number | null;
  insetPopularReads?: ArticleSidebarPost[];
}

export type MediaPresentation =
  | "default"
  | "editorial"
  | "nonRegularCover"
  | "postStandard";

export type PortableTextBlockValue = {
  [key: string]: unknown;
};
