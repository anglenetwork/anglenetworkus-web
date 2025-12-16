import type React from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categoriesByViewsQuery,
  topTagsByViewsQuery,
  showsTagsByViewsQuery,
} from "@/sanity/lib/queries";
import { MainLayoutWrapper } from "./content-layout-wrapper";

interface Category {
  slug: string;
  name: string;
  views?: number;
  order?: number;
}

interface Tag {
  slug: string;
  title: string;
  views?: number;
}

interface ContentLayoutWrapperProps {
  children: React.ReactNode;
}

export async function ContentLayoutWrapper({
  children,
}: ContentLayoutWrapperProps) {
  const [categoriesData, tagsData, showsTagsData] = await Promise.all([
    sanityFetchStatic({
      query: categoriesByViewsQuery,
    }),
    sanityFetchStatic({
      query: topTagsByViewsQuery,
    }),
    sanityFetchStatic({
      query: showsTagsByViewsQuery,
    }),
  ]);

  // Map categories with order field preserved
  const categoriesWithOrder = categoriesData
    .filter((cat) => cat.slug !== null && cat.name !== null)
    .map((cat) => {
      // Extract order field - handle null, undefined, string, or number
      const orderValue = (cat as any).order;
      let order = 999; // Default to 999 (appears last)

      if (typeof orderValue === "number" && !isNaN(orderValue)) {
        order = orderValue;
      } else if (typeof orderValue === "string" && orderValue.trim() !== "") {
        // Handle string numbers
        const parsed = parseInt(orderValue, 10);
        if (!isNaN(parsed)) {
          order = parsed;
        }
      }

      return {
        slug: cat.slug!,
        name: cat.name!,
        views: cat.views ?? undefined,
        order, // Preserve order for sorting
      };
    });

  // Sort by order (ascending), but treat 0 as "no priority" (appears last)
  // Categories with order > 0 appear first (sorted by order), then order 0 categories (sorted alphabetically)
  categoriesWithOrder.sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;

    // Treat 0 as "no priority" - it should appear after all numbered priorities
    const effectiveOrderA = orderA === 0 ? 999 : orderA;
    const effectiveOrderB = orderB === 0 ? 999 : orderB;

    if (effectiveOrderA !== effectiveOrderB) {
      return effectiveOrderA - effectiveOrderB;
    }
    // If orders are equal, sort by name
    return (a.name || "").localeCompare(b.name || "");
  });

  // Remove order field from final output
  const categories: Category[] = categoriesWithOrder.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    views: cat.views,
  }));

  const tags: Tag[] = tagsData
    .filter((tag) => tag.slug !== null && tag.title !== null)
    .map((tag) => ({
      slug: tag.slug!,
      title: tag.title!,
      views: tag.views ?? undefined,
    }));

  const showsTags: Tag[] = showsTagsData
    .filter((tag) => tag.slug !== null && tag.title !== null)
    .map((tag) => ({
      slug: tag.slug!,
      title: tag.title!,
      views: tag.views ?? undefined,
    }));

  return (
    <MainLayoutWrapper
      categories={categories}
      tags={tags}
      showsTags={showsTags}
    >
      {children}
    </MainLayoutWrapper>
  );
}
