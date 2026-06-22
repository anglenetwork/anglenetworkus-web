import type { ReactNode } from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categoriesByViewsQuery,
  navTagsWithCategoryQuery,
} from "@/sanity/lib/queries";
import { buildNavCategories } from "@/app/lib/nav/category-order";
import {
  buildNavMenuColumns,
  type NavTagWithCategory,
} from "@/app/lib/nav/menu-columns";
import { SiteShellFrame } from "./site-shell-frame";

interface SiteShellProps {
  children: ReactNode;
}

/**
 * Server half of the site shell. Loads nav categories and category-scoped
 * tags from Sanity, then builds four menu columns for the full-screen menu.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const [categoriesData, tagsData] = await Promise.all([
    sanityFetchStatic({ query: categoriesByViewsQuery }),
    sanityFetchStatic({ query: navTagsWithCategoryQuery }),
  ]);

  const categories = buildNavCategories(categoriesData);
  const tagRows = mapNavTags(tagsData);
  const menuColumns = buildNavMenuColumns(categories, tagRows);

  return (
    <SiteShellFrame categories={categories} menuColumns={menuColumns}>
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
    (tag): tag is NavTagRow & { slug: string; title: string; categorySlug: string } =>
      tag.slug !== null && tag.title !== null && tag.categorySlug !== null,
  );
}
