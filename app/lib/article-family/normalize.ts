import type {
  ArticleFamily,
  ArticleFamilyCard,
  ArticleFamilyDocType,
  ArticleFamilySeo,
} from "./types";
import { articleFamilyHref } from "./routes";

export function isArticleFamilyDocType(t: string): t is ArticleFamilyDocType {
  return (
    t === "post" ||
    t === "opinion" ||
    t === "analysis" ||
    t === "sponsored"
  );
}

function toSeo(raw: unknown): ArticleFamilySeo | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  return {
    title: typeof s.title === "string" ? s.title : null,
    description: typeof s.description === "string" ? s.description : null,
    canonicalUrl: typeof s.canonicalUrl === "string" ? s.canonicalUrl : null,
    ogImage: s.ogImage ?? null,
  };
}

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

  const publishedAt =
    typeof r.publishedAt === "string" ? r.publishedAt : null;
  const updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : null;
  const dateRaw = r.date;
  const date =
    typeof dateRaw === "string"
      ? dateRaw
      : publishedAt ?? updatedAt ?? new Date().toISOString();

  const title =
    typeof r.title === "string" ? r.title : "Untitled";
  const tickerTitle =
    typeof r.tickerTitle === "string" ? r.tickerTitle : "";
  const excerpt =
    r.excerpt === null || r.excerpt === undefined
      ? null
      : String(r.excerpt);

  const sponsorRaw = r.sponsorAttribution;
  let sponsorAttribution = undefined;
  if (sponsorRaw && typeof sponsorRaw === "object") {
    const sp = sponsorRaw as Record<string, unknown>;
    const name = typeof sp.sponsorName === "string" ? sp.sponsorName : "";
    const disc = typeof sp.disclosure === "string" ? sp.disclosure : "";
    if (name || disc) {
      sponsorAttribution = {
        sponsorName: name || "Sponsor",
        sponsorUrl:
          typeof sp.sponsorUrl === "string" ? sp.sponsorUrl : null,
        disclosure: disc,
      };
    }
  }

  return {
    _id,
    _type,
    title,
    tickerTitle,
    excerpt,
    slug,
    href: articleFamilyHref(_type, slug),
    cover: r.cover ?? null,
    body: Array.isArray(r.body) ? (r.body as unknown[]) : null,
    author: (r.author as ArticleFamily["author"]) ?? null,
    publishedAt,
    updatedAt,
    date,
    seo: toSeo(r.seo),
    imageGallery: Array.isArray(r.imageGallery)
      ? (r.imageGallery as unknown[])
      : null,
    category: (r.category as ArticleFamily["category"]) ?? null,
    tags: (r.tags as ArticleFamily["tags"]) ?? null,
    opinionFormat:
      r.opinionFormat === null || r.opinionFormat === undefined
        ? null
        : String(r.opinionFormat),
    disclosure:
      r.disclosure === null || r.disclosure === undefined
        ? null
        : String(r.disclosure),
    analysisFocus:
      r.analysisFocus === null || r.analysisFocus === undefined
        ? null
        : String(r.analysisFocus),
    methodologyNote:
      r.methodologyNote === null || r.methodologyNote === undefined
        ? null
        : String(r.methodologyNote),
    sourcesNote:
      r.sourcesNote === null || r.sourcesNote === undefined
        ? null
        : String(r.sourcesNote),
    sponsorAttribution,
  };
}

export function normalizeArticleFamilyCard(raw: unknown): ArticleFamilyCard | null {
  return normalizeArticleFamily(raw) as ArticleFamilyCard | null;
}
