import type {
  ArticleFamily,
  ArticleFamilySeo,
  ArticleFamilyTag,
} from "./types";

export function nullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

export function parseSponsorAttribution(
  sponsorRaw: unknown,
): ArticleFamily["sponsorAttribution"] {
  if (!sponsorRaw || typeof sponsorRaw !== "object") {
    return undefined;
  }

  const sp = sponsorRaw as Record<string, unknown>;
  const name = typeof sp.sponsorName === "string" ? sp.sponsorName : "";
  const disc = typeof sp.disclosure === "string" ? sp.disclosure : "";

  if (!name && !disc) {
    return undefined;
  }

  return {
    sponsorName: name || "Sponsor",
    sponsorUrl: typeof sp.sponsorUrl === "string" ? sp.sponsorUrl : null,
    disclosure: disc,
  };
}

export function toSeo(raw: unknown): ArticleFamilySeo | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  return {
    title: typeof s.title === "string" ? s.title : null,
    description: typeof s.description === "string" ? s.description : null,
    canonicalUrl: typeof s.canonicalUrl === "string" ? s.canonicalUrl : null,
    ogImage: s.ogImage ?? null,
  };
}

export function resolveArticleFamilyDate(raw: Record<string, unknown>): string {
  const publishedAt =
    typeof raw.publishedAt === "string" ? raw.publishedAt : null;
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : null;
  const dateRaw = raw.date;
  if (typeof dateRaw === "string") {
    return dateRaw;
  }
  return publishedAt ?? updatedAt ?? new Date().toISOString();
}

export function normalizeTags(raw: unknown): ArticleFamilyTag[] | null {
  if (!Array.isArray(raw)) return null;

  const tags = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const tag = entry as Record<string, unknown>;
    const title = typeof tag.title === "string" ? tag.title : "";
    const slug = typeof tag.slug === "string" ? tag.slug : "";
    if (!title || !slug) return [];
    return [{ title, slug }];
  });

  return tags.length > 0 ? tags : null;
}
