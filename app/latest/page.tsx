import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  latestEditorialIndexQuery,
  latestEditorialIndexCountQuery,
} from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import ArticleFamilyIndexPage, {
  articleFamilyIndexPageSize,
} from "@/app/components/article-family/ArticleFamilyIndexPage";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildLatestPageMetadata,
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
  const settings = await getCachedSettings();
  return finalizePublicMetadata(
    buildLatestPageMetadata(page, settings, demo.title),
  );
}

export default async function LatestEditorialPage({
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
      query: latestEditorialIndexQuery,
      params: { start, end },
    }),
    sanityFetch({
      query: latestEditorialIndexCountQuery,
    }),
  ]);

  const total = typeof totalRaw === "number" ? totalRaw : 0;
  const articles = (Array.isArray(rows) ? rows : [])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null);

  return (
    <ArticleFamilyIndexPage
      title="Latest"
      description="Mixed feed of the newest reporting, opinion, and analysis."
      articles={articles}
      page={page}
      total={total}
      basePath="/latest"
    />
  );
}
