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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const raw = parseInt(sp.page || "1", 10);
  const page = Number.isFinite(raw) && raw >= 1 ? raw : 1;
  const [settings, totalRaw] = await Promise.all([
    getCachedSettings(),
    sanityFetch({
      query: analysisIndexCountQuery,
    }),
  ]);
  const total = typeof totalRaw === "number" ? totalRaw : 0;
  return finalizePublicMetadata(
    buildAnalysisIndexMetadata(page, total, settings, demo.title),
  );
}

export default async function AnalysisIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const raw = parseInt(sp.page || "1", 10);
  const page = Number.isFinite(raw) && raw >= 1 ? raw : 1;
  const pageSize = articleFamilyIndexPageSize;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const [rows, totalRaw] = await Promise.all([
    sanityFetch({
      query: analysisIndexQuery,
      params: { start, end },
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
        description="Deep dives, data, and context on the stories that matter."
        articles={articles}
        page={page}
        total={total}
        basePath="/analysis"
      />
    </>
  );
}
