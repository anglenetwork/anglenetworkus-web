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
import { mapTickerPosts } from "./map-ticker-posts";

interface SiteShellProps {
  children: ReactNode;
  pathname?: string;
}

function isHomepagePath(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

/**
 * Server half of the site shell. Loads nav categories and category-scoped
 * tags from Sanity, then builds four menu columns for the full-screen menu.
 */
export async function SiteShell({ children, pathname = "" }: SiteShellProps) {
  const isHomepage = isHomepagePath(pathname);

  const shellQueries: [
    ReturnType<typeof sanityFetchStatic>,
    ReturnType<typeof sanityFetchStatic>,
    ReturnType<typeof sanityFetchStatic> | Promise<null>,
  ] = [
    sanityFetchStatic({ query: categoriesByViewsQuery }),
    sanityFetchStatic({ query: navTagsWithCategoryQuery }),
    isHomepage
      ? Promise.resolve(null)
      : sanityFetchStatic({ query: newsTickerQuery }),
  ];

  const [categoriesData, tagsData, tickerData] =
    await Promise.all(shellQueries);

  const categories = buildNavCategories(categoriesData);
  const tagRows = mapNavTags(tagsData);
  const menuCategories = buildNavMenuCategories(categories, tagRows);
  const tickerPosts =
    tickerData == null ? undefined : mapTickerPosts(tickerData);

  return (
    <SiteShellFrame
      categories={categories}
      menuCategories={menuCategories}
      tickerPosts={tickerPosts ?? []}
      isHomepage={isHomepage}
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
