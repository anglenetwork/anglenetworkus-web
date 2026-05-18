/**
 * Shared shapes for the site shell (header + footer + chrome).
 * Re-exported by `navbar/types.ts` so existing imports keep working.
 */

export interface Category {
  slug: string;
  name: string;
  views?: number;
}

export interface Tag {
  slug: string;
  title: string;
  views?: number;
}

export interface SiteShellNav {
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
}
