/**
 * Shared shapes for the site shell (header + footer + chrome).
 * Re-exported by `navbar/types.ts` so existing imports keep working.
 */

export interface Category {
  slug: string;
  name: string;
  views?: number;
}

interface Tag {
  slug: string;
  title: string;
  views?: number;
}

export type { NavMenuCategory } from "@/app/lib/nav/menu-columns";

export interface TickerPost {
  tickerTitle: string;
  slug: string;
}

export interface SiteShellNav {
  categories: Category[];
  menuCategories: import("@/app/lib/nav/menu-columns").NavMenuCategory[];
  tickerPosts: TickerPost[];
}
