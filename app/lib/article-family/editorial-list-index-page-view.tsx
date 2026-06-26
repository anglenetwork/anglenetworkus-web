import { sanityFetch } from "@/sanity/lib/fetch";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import ArticleFamilyIndexPage from "@/app/components/article-family/ArticleFamilyIndexPage";
import { EDITORIAL_LIST_INITIAL_FETCH_SIZE } from "@/app/components/article-family/editorial-list-index-constants";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import type { EditorialListIndexConfig } from "./editorial-list-index-config";

export async function EditorialListIndexPageView({
  config,
}: {
  config: EditorialListIndexConfig;
}) {
  const pageSize = EDITORIAL_LIST_INITIAL_FETCH_SIZE;

  const [rows, totalRaw] = await Promise.all([
    sanityFetch({
      query: config.indexQuery,
      params: { start: 0, end: pageSize },
    }),
    sanityFetch({
      query: config.countQuery,
    }),
  ]);

  const total = typeof totalRaw === "number" ? totalRaw : 0;
  const articles = (Array.isArray(rows) ? rows : [])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: config.breadcrumbLabel, path: config.basePath },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <ArticleFamilyIndexPage
        title={config.title}
        articles={articles}
        page={1}
        total={total}
        basePath={config.basePath}
        variant="editorial-list"
        editorialList={{
          sidebarTitle: config.sidebarTitle,
          featuredLabel: config.featuredLabel,
          loadMoreApiPath: config.loadMoreApiPath,
        }}
      />
    </>
  );
}
