import { getPublicSiteUrl } from "./site-url";

const TRACKING_PARAM_PREFIXES = ["utm_"] as const;
const TRACKING_PARAM_NAMES = new Set([
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "msclkid",
  "mc_eid",
  "_ga",
  "yclid",
  "wbraid",
  "gbraid",
]);

function isTrackingParam(key: string): boolean {
  if (TRACKING_PARAM_NAMES.has(key)) return true;
  return TRACKING_PARAM_PREFIXES.some((p) => key.startsWith(p));
}

/**
 * Builds an absolute canonical URL. Strips tracking params; keeps only allowed query keys when provided.
 */
export function buildCanonicalUrl(
  pathname: string,
  searchParams?:
    | URLSearchParams
    | Record<string, string | string[] | undefined>,
  options?: { allowedKeys?: string[] },
): string {
  const base = getPublicSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = new URL(path, base.endsWith("/") ? base : `${base}/`);

  if (!searchParams) {
    return url.toString();
  }

  const allowed = options?.allowedKeys ? new Set(options.allowedKeys) : null;

  const sp =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams();

  if (!(searchParams instanceof URLSearchParams)) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v === undefined) continue;
      const val = Array.isArray(v) ? v[0] : v;
      if (val === undefined) continue;
      sp.set(k, val);
    }
  }

  const next = new URLSearchParams();
  for (const [key, value] of sp.entries()) {
    if (isTrackingParam(key)) continue;
    if (allowed && !allowed.has(key)) continue;
    next.set(key, value);
  }

  const qs = next.toString();
  if (!qs) return url.toString();
  return `${url.origin}${url.pathname}?${qs}`;
}
