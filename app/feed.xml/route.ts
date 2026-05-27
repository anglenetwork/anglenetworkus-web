import { client } from "@/sanity/lib/client";
import { feedEditorialEntriesQuery } from "@/sanity/lib/article-family-queries";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { resolvePublicationName } from "@/app/lib/seo/publication";
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

function toRfc822(dateIso: string): string {
  return new Date(dateIso).toUTCString();
}

type FeedRow = {
  _type?: ArticleFamilyDocType;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  author?: { name?: string } | null;
};

export async function GET() {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const [rows, settings] = await Promise.all([
    client.fetch(feedEditorialEntriesQuery),
    client.fetch<Record<string, unknown> | null>(
      settingsQuery,
      {},
      {
        stega: false,
      },
    ),
  ]);
  const siteName = resolvePublicationName(settings ?? undefined);
  const list = Array.isArray(rows) ? rows : [];

  const items = list
    .map((row) => {
      const slug = row.slug;
      const t = row._type;
      if (!slug || !t) return "";
      const link = `${base}${articleFamilyCanonicalHref(t, slug)}`;
      const title = row.title?.trim() || "Untitled";
      const description = row.excerpt?.trim() || "";
      const pubDate = row.publishedAt
        ? toRfc822(row.publishedAt)
        : toRfc822(new Date().toISOString());
      const creator = row.author?.name?.trim();
      const creatorXml = creator
        ? `<dc:creator>${escapeXml(creator)}</dc:creator>`
        : "";

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(pubDate)}</pubDate>
      <description>${escapeXml(description)}</description>
      ${creatorXml}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml("Latest news, opinion, and analysis.")}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
