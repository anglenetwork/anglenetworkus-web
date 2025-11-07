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

  const categories: Category[] = categoriesData
    .filter((cat) => cat.slug !== null && cat.name !== null)
    .map((cat) => ({
      slug: cat.slug!,
      name: cat.name!,
      views: cat.views ?? undefined,
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
