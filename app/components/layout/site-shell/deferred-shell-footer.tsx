import "server-only";

import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { navTagsWithCategoryQuery } from "@/sanity/lib/queries";
import { buildNavMenuCategories } from "@/app/lib/nav/menu-columns";
import { Footer } from "../footer";
import type { Category } from "./types";
import { mapNavTags } from "./map-nav-tags";
import { MenuCategoriesSync } from "./menu-categories-sync";

export async function DeferredShellFooter({
  categories,
}: {
  categories: Category[];
}) {
  const tagsData = await sanityFetchStatic({
    query: navTagsWithCategoryQuery,
  });
  const tagRows = Array.isArray(tagsData)
    ? mapNavTags(tagsData as Parameters<typeof mapNavTags>[0])
    : [];
  const menuCategories = buildNavMenuCategories(categories, tagRows);

  return (
    <>
      <MenuCategoriesSync menuCategories={menuCategories} />
      <Footer menuCategories={menuCategories} />
    </>
  );
}
