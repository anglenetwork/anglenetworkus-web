let missingEnvWarned = false;

/**
 * Absolute site origin for canonicals, OG, JSON-LD, and sitemaps.
 * Uses NEXT_PUBLIC_SITE_URL; falls back to localhost in development only (safe build).
 */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!raw) {
    if (process.env.NODE_ENV === "development" && !missingEnvWarned) {
      missingEnvWarned = true;
      console.warn(
        "[seo] NEXT_PUBLIC_SITE_URL is not set; using http://localhost:3000 for absolute URLs.",
      );
    }
    return "http://localhost:3000";
  }
  return raw;
}
