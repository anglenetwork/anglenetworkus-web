import type { ArticleFamily } from "./types";
import { articleFamilyHref } from "./routes";
import { isArticleFamilyDocType } from "./normalize-doc-type";
import {
  nullableString,
  normalizeTags,
  parseSponsorAttribution,
  resolveArticleFamilyDate,
  toSeo,
} from "./normalize-helpers";

export function normalizeArticleFamily(raw: unknown): ArticleFamily | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const _type = r._type;
  if (typeof _type !== "string" || !isArticleFamilyDocType(_type)) {
    return null;
  }
  const slug = typeof r.slug === "string" ? r.slug : "";
  if (!slug) return null;
  const _id = typeof r._id === "string" ? r._id : "";
  if (!_id) return null;

  const publishedAt = typeof r.publishedAt === "string" ? r.publishedAt : null;
  const updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : null;
  const date = resolveArticleFamilyDate(r);

  const title = typeof r.title === "string" ? r.title : "Untitled";
  const tickerTitle = typeof r.tickerTitle === "string" ? r.tickerTitle : "";
  const excerpt =
    r.excerpt === null || r.excerpt === undefined ? null : String(r.excerpt);

  const sponsorAttribution = parseSponsorAttribution(r.sponsorAttribution);

  return {
    _id,
    _type,
    title,
    tickerTitle,
    excerpt,
    slug,
    href: articleFamilyHref(_type, slug, { id: _id }),
    cover: r.cover ?? null,
    body: Array.isArray(r.body) ? (r.body as unknown[]) : null,
    author: (r.author as ArticleFamily["author"]) ?? null,
    publishedAt,
    updatedAt,
    date,
    readTime: typeof r.readTime === "number" ? r.readTime : null,
    seo: toSeo(r.seo),
    imageGallery: Array.isArray(r.imageGallery)
      ? (r.imageGallery as unknown[])
      : null,
    category: (r.category as ArticleFamily["category"]) ?? null,
    tags: normalizeTags(r.tags),
    disclosure: nullableString(r.disclosure),
    analysisFocus: nullableString(r.analysisFocus),
    methodologyNote: nullableString(r.methodologyNote),
    sourcesNote: nullableString(r.sourcesNote),
    sponsorAttribution,
  };
}
