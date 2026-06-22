import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  opinionIndexQuery,
  opinionIndexCountQuery,
} from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import ArticleFamilyIndexPage from "@/app/components/article-family/ArticleFamilyIndexPage";
import { OPINION_INITIAL_FETCH_SIZE } from "@/app/components/article-family/opinion-index-constants";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildOpinionIndexMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, totalRaw] = await Promise.all([
    getCachedSettings(),
    sanityFetch({
      query: opinionIndexCountQuery,
    }),
  ]);
  const total = typeof totalRaw === "number" ? totalRaw : 0;
  return finalizePublicMetadata(
    buildOpinionIndexMetadata(1, total, settings, demo.title),
  );
}

export default async function OpinionIndexPage() {
  const pageSize = OPINION_INITIAL_FETCH_SIZE;

  const [rows, totalRaw] = await Promise.all([
    sanityFetch({
      query: opinionIndexQuery,
      params: { start: 0, end: pageSize },
    }),
    sanityFetch({
      query: opinionIndexCountQuery,
    }),
  ]);

  const total = typeof totalRaw === "number" ? totalRaw : 0;
  const articles = (Array.isArray(rows) ? rows : [])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Opinion", path: "/opinion" },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <ArticleFamilyIndexPage
        title="Opinion"
        articles={articles}
        page={1}
        total={total}
        basePath="/opinion"
        variant="opinion"
      />
    </>
  );
}
