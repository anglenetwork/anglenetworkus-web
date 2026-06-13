import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  analysisIndexQuery,
  analysisIndexCountQuery,
} from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import ArticleFamilyIndexPage, {
  articleFamilyIndexPageSize,
} from "@/app/components/article-family/ArticleFamilyIndexPage";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildAnalysisIndexMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, totalRaw] = await Promise.all([
    getCachedSettings(),
    sanityFetch({
      query: analysisIndexCountQuery,
    }),
  ]);
  const total = typeof totalRaw === "number" ? totalRaw : 0;
  return finalizePublicMetadata(
    buildAnalysisIndexMetadata(1, total, settings, demo.title),
  );
}

export default async function AnalysisIndexPage() {
  const pageSize = articleFamilyIndexPageSize;

  const [rows, totalRaw] = await Promise.all([
    sanityFetch({
      query: analysisIndexQuery,
      params: { start: 0, end: pageSize },
    }),
    sanityFetch({
      query: analysisIndexCountQuery,
    }),
  ]);

  const total = typeof totalRaw === "number" ? totalRaw : 0;
  const articles = (Array.isArray(rows) ? rows : [])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Analysis", path: "/analysis" },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <ArticleFamilyIndexPage
        title="Analysis"
        articles={articles}
        page={1}
        total={total}
        basePath="/analysis"
        variant="analysis"
      />
    </>
  );
}
