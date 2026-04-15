import type React from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categoriesByViewsQuery,
  topTagsByViewsQuery,
  showsTagsByViewsQuery,
} from "@/sanity/lib/queries";
import { MainLayoutWrapper } from "./main-layout-wrapper";

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

const CATEGORY_NAV_ORDER = [
  "us",
  "world",
  "politics",
  "business",
  "science",
  "entertainment",
  "tech",
  "lifestyle",
] as const;

const CATEGORY_NAV_ORDER_INDEX: Map<string, number> = new Map(
  CATEGORY_NAV_ORDER.map((slug, index) => [slug, index]),
);

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

  const categoriesWithOrder = categoriesData
    .filter((cat) => cat.slug !== null && cat.name !== null)
    .map((cat) => {
      const orderValue = (cat as any).order;
      let order = 999;

      if (typeof orderValue === "number" && !isNaN(orderValue)) {
        order = orderValue;
      } else if (typeof orderValue === "string" && orderValue.trim() !== "") {
        const parsed = parseInt(orderValue, 10);
        if (!isNaN(parsed)) {
          order = parsed;
        }
      }

      return {
        slug: cat.slug!,
        name: cat.name!,
        views: cat.views ?? undefined,
        order,
      };
    });

  categoriesWithOrder.sort((a, b) => {
    const preferredA =
      CATEGORY_NAV_ORDER_INDEX.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const preferredB =
      CATEGORY_NAV_ORDER_INDEX.get(b.slug) ?? Number.MAX_SAFE_INTEGER;

    if (preferredA !== preferredB) {
      return preferredA - preferredB;
    }

    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.name || "").localeCompare(b.name || "");
  });

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
