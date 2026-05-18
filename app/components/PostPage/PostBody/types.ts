export interface ArticleImageSource {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: unknown;
  alt?: string | null;
  epigraph?: string | null;
  creditProvider?: string | null;
  creditAuthor?: string | null;
  creditSourceUrl?: string | null;
  creditLicense?: string | null;
}

export interface ResolvedArticleImage {
  src: string;
  alt: string;
  unoptimized: boolean;
  epigraph?: string | null;
  credit?: string | null;
}

export interface ArticleAuthor {
  name: string;
  picture?: unknown;
}

export interface PostBodyProps {
  /** Public path for sharing (e.g. /opinion/slug). Defaults to /post/{slug} when omitted. */
  sharePath?: string;
  variant?: "default" | "editorial";
  body?: unknown[] | null;
  cover?: ArticleImageSource | null;
  imageGallery?: ArticleImageSource[] | null;
  title: string;
  author?: ArticleAuthor;
  date: string;
  updatedAt?: string | null;
  slug?: string;
  articleId?: string;
}

export type MediaPresentation = "default" | "editorial";

export type PortableTextBlockValue = {
  [key: string]: unknown;
};
