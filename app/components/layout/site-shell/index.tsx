import type { ReactNode } from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categoriesByViewsQuery,
  navTagsWithCategoryQuery,
  newsTickerQuery,
} from "@/sanity/lib/queries";
import { buildNavCategories } from "@/app/lib/nav/category-order";
import { buildNavMenuCategories } from "@/app/lib/nav/menu-columns";
import { SiteShellFrame } from "./site-shell-frame";
import { mapNavTags } from "./map-nav-tags";
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

  const [categoriesData, tagsData, tickerData] = await Promise.all([
    sanityFetchStatic({ query: categoriesByViewsQuery }),
    isHomepage
      ? Promise.resolve(null)
      : sanityFetchStatic({ query: navTagsWithCategoryQuery }),
    isHomepage
      ? Promise.resolve(null)
      : sanityFetchStatic({ query: newsTickerQuery }),
  ]);

  const categories = buildNavCategories(categoriesData);
  const tagRows =
    tagsData == null
      ? []
      : mapNavTags(tagsData as Parameters<typeof mapNavTags>[0]);
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
