import {
  opinionIndexCountQuery,
  opinionIndexQuery,
  sponsoredIndexCountQuery,
  sponsoredIndexQuery,
} from "@/sanity/lib/article-family-queries";

export type EditorialListFamily = "opinion" | "sponsored";

export type EditorialListIndexConfig = {
  family: EditorialListFamily;
  title: string;
  basePath: string;
  breadcrumbLabel: string;
  sidebarTitle: string;
  featuredLabel: string;
  loadMoreApiPath: string;
  indexQuery: string;
  countQuery: string;
};

export const OPINION_EDITORIAL_LIST_CONFIG: EditorialListIndexConfig = {
  family: "opinion",
  title: "Opinion",
  basePath: "/opinion",
  breadcrumbLabel: "Opinion",
  sidebarTitle: "Latest Opinion",
  featuredLabel: "Featured opinion",
  loadMoreApiPath: "/api/opinion",
  indexQuery: opinionIndexQuery,
  countQuery: opinionIndexCountQuery,
};

export const SPONSORED_EDITORIAL_LIST_CONFIG: EditorialListIndexConfig = {
  family: "sponsored",
  title: "Sponsored",
  basePath: "/sponsored",
  breadcrumbLabel: "Sponsored",
  sidebarTitle: "More Sponsored",
  featuredLabel: "Featured sponsored",
  loadMoreApiPath: "/api/sponsored",
  indexQuery: sponsoredIndexQuery,
  countQuery: sponsoredIndexCountQuery,
};
