import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  sitemapArticleFamilyEntriesQuery,
  sitemapCategorySlugsWithArticlesQuery,
  sitemapTagSlugsWithArticlesQuery,
} from "@/sanity/lib/article-family-queries";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

function lastMod(d?: string | null): Date {
  if (d) {
    const t = Date.parse(d);
    if (!Number.isNaN(t)) return new Date(t);
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getPublicSiteUrl().replace(/\/$/, "");

  const [articles, categoryRows, tagRows] = await Promise.all([
    client.fetch(sitemapArticleFamilyEntriesQuery),
    client.fetch(sitemapCategorySlugsWithArticlesQuery),
    client.fetch(sitemapTagSlugsWithArticlesQuery),
  ]);

  const list = Array.isArray(articles) ? articles : [];
  const hasOpinion = list.some(
    (a: { _type?: string }) => a._type === "opinion",
  );
  const hasAnalysis = list.some(
    (a: { _type?: string }) => a._type === "analysis",
  );

  const out: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  if (hasOpinion) {
    out.push({
      url: `${base}/opinion`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.85,
    });
  }

  if (hasAnalysis) {
    out.push({
      url: `${base}/analysis`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.85,
    });
  }

  for (const row of list) {
    const t = row._type as ArticleFamilyDocType;
    const slug = row.slug as string | undefined;
    if (!slug) continue;
    out.push({
      url: `${base}${articleFamilyHref(t, slug)}`,
      lastModified: lastMod(
        (row as { _updatedAt?: string; publishedAt?: string })._updatedAt ??
          (row as { publishedAt?: string }).publishedAt,
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const c of Array.isArray(categoryRows) ? categoryRows : []) {
    const slug = (c as { slug?: string }).slug;
    if (!slug) continue;
    out.push({
      url: `${base}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.65,
    });
  }

  for (const t of Array.isArray(tagRows) ? tagRows : []) {
    const slug = (t as { slug?: string }).slug;
    if (!slug) continue;
    out.push({
      url: `${base}/tag/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    });
  }

  return out;
}
