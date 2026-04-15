import * as demo from "@/sanity/lib/demo";
import { resolveSiteName, type SiteSettingsForSeo } from "./metadata-builders";

const DEFAULT_PUBLICATION_LANGUAGE = "en";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * Google News sitemap language (ISO 639-1). Prefer settings when present; otherwise "en".
 */
export function resolvePublicationLanguage(
  settings: SiteSettingsForSeo | Record<string, unknown> | null | undefined
): string {
  const s = settings as Record<string, unknown> | null | undefined;
  const raw = s?.locale ?? s?.language;
  if (isNonEmptyString(raw)) {
    const t = raw.trim().toLowerCase();
    if (t.length >= 2) return t.slice(0, 2);
    return t;
  }
  return DEFAULT_PUBLICATION_LANGUAGE;
}

/**
 * Publication / site name for Google News — same rules as sitewide metadata.
 */
export function resolvePublicationName(
  settings: SiteSettingsForSeo | null | undefined
): string {
  return resolveSiteName(settings, demo.title);
}
