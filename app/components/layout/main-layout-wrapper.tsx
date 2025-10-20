import type React from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import { MainLayoutWrapper } from "./content-layout-wrapper";

interface Category {
  slug: string;
  name: string;
}

interface ContentLayoutWrapperProps {
  children: React.ReactNode;
}

export async function ContentLayoutWrapper({
  children,
}: ContentLayoutWrapperProps) {
  const categoriesData = await sanityFetchStatic({ query: allCategoriesQuery });
  const categories: Category[] = categoriesData.filter(
    (cat): cat is { slug: string; name: string } =>
      cat.slug !== null && cat.name !== null
  );

  return (
    <MainLayoutWrapper categories={categories}>{children}</MainLayoutWrapper>
  );
}
