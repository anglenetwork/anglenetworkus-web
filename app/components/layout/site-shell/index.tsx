import type { ReactNode } from "react";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categoriesByViewsQuery,
  topTagsByViewsQuery,
  showsTagsByViewsQuery,
} from "@/sanity/lib/queries";
import { buildNavCategories } from "@/app/lib/nav/category-order";
import { SiteShellFrame } from "./site-shell-frame";
import type { Tag } from "./types";

interface SiteShellProps {
  children: ReactNode;
}

/**
 * Server half of the site shell. Loads the nav data (categories, top tags,
 * shows tags) from Sanity in parallel and passes it down to the client
 * frame which renders the global header/footer.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const [categoriesData, tagsData, showsTagsData] = await Promise.all([
    sanityFetchStatic({ query: categoriesByViewsQuery }),
    sanityFetchStatic({ query: topTagsByViewsQuery }),
    sanityFetchStatic({ query: showsTagsByViewsQuery }),
  ]);

  const categories = buildNavCategories(categoriesData);
  const tags = mapTags(tagsData);
  const showsTags = mapTags(showsTagsData);

  return (
    <SiteShellFrame
      categories={categories}
      tags={tags}
      showsTags={showsTags}
    >
      {children}
    </SiteShellFrame>
  );
}

type TagRow = { slug: string | null; title: string | null; views: number | null };

function mapTags(rows: TagRow[]): Tag[] {
  return rows
    .filter(
      (tag): tag is TagRow & { slug: string; title: string } =>
        tag.slug !== null && tag.title !== null,
    )
    .map((tag) => ({
      slug: tag.slug,
      title: tag.title,
      views: tag.views ?? undefined,
    }));
}
