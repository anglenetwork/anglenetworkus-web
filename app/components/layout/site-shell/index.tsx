import type { ReactNode } from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categoriesByViewsQuery,
  navTagsWithCategoryQuery,
  newsTickerQuery,
} from "@/sanity/lib/queries";
import { buildNavCategories } from "@/app/lib/nav/category-order";
import {
  buildNavMenuCategories,
  type NavTagWithCategory,
} from "@/app/lib/nav/menu-columns";
import { SiteShellFrame } from "./site-shell-frame";
import type { TickerPost } from "./types";

interface SiteShellProps {
  children: ReactNode;
}

/**
 * Server half of the site shell. Loads nav categories and category-scoped
 * tags from Sanity, then builds four menu columns for the full-screen menu.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const [categoriesData, tagsData, tickerData] = await Promise.all([
    sanityFetchStatic({ query: categoriesByViewsQuery }),
    sanityFetchStatic({ query: navTagsWithCategoryQuery }),
    sanityFetchStatic({ query: newsTickerQuery }),
  ]);

  const categories = buildNavCategories(categoriesData);
  const tagRows = mapNavTags(tagsData);
  const menuCategories = buildNavMenuCategories(categories, tagRows);
  const tickerPosts = mapTickerPosts(tickerData);

  return (
    <SiteShellFrame
      categories={categories}
      menuCategories={menuCategories}
      tickerPosts={tickerPosts}
    >
      {children}
    </SiteShellFrame>
  );
}

type NavTagRow = {
  slug: string | null;
  title: string | null;
  categorySlug: string | null;
};

function mapTickerPosts(rows: unknown): TickerPost[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter(
      (row): row is { tickerTitle: string; slug: string } =>
        !!row &&
        typeof row === "object" &&
        "tickerTitle" in row &&
        typeof row.tickerTitle === "string" &&
        row.tickerTitle.length > 0 &&
        "slug" in row &&
        typeof row.slug === "string" &&
        row.slug.length > 0,
    )
    .map((row) => ({
      tickerTitle: row.tickerTitle,
      slug: row.slug,
    }));
}

function mapNavTags(rows: NavTagRow[]): NavTagWithCategory[] {
  return rows.filter(
    (
      tag,
    ): tag is NavTagRow & {
      slug: string;
      title: string;
      categorySlug: string;
    } => tag.slug !== null && tag.title !== null && tag.categorySlug !== null,
  );
}
