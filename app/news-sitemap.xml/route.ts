import { client } from "@/sanity/lib/client";
import { newsSitemapEntriesQuery } from "@/sanity/lib/article-family-queries";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import {
  resolvePublicationLanguage,
  resolvePublicationName,
} from "@/app/lib/seo/publication";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";
import { settingsQuery } from "@/sanity/lib/queries";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const [rows, settings] = await Promise.all([
    client.fetch(newsSitemapEntriesQuery, { since }),
    client.fetch<Record<string, unknown> | null>(settingsQuery, {}, { stega: false }),
  ]);

  const publicationName = resolvePublicationName(settings ?? undefined);
  const publicationLanguage = resolvePublicationLanguage(settings ?? undefined);

  const list = Array.isArray(rows) ? rows : [];

  const items = list
    .map((row) => {
        const slug = row.slug ?? undefined;
        const t = row._type as ArticleFamilyDocType | undefined;
        if (!slug || (t !== "post" && t !== "analysis")) return "";
        const loc = `${base}${articleFamilyHref(t, slug)}`;
        const pub = row.publishedAt
          ? new Date(row.publishedAt).toISOString()
          : new Date().toISOString();
        const headline = row.title?.trim() || "Untitled";
        return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>${escapeXml(publicationLanguage)}</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(pub)}</news:publication_date>
      <news:title>${escapeXml(headline)}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
