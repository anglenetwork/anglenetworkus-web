/**
 * Resolve non-CDN Unsplash page/download URLs to images.unsplash.com via HEAD redirect.
 */

export function isUnsplashNonCdnHostname(hostname) {
  return hostname.replace(/^www\./, "") === "unsplash.com";
}

export function normalizeExternalImageUrl(value) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const normalized = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : /^https?:\/\//.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  try {
    return new URL(normalized);
  } catch {
    return null;
  }
}

export function isUnsplashNonCdnUrl(href) {
  const url = normalizeExternalImageUrl(href);
  return url ? isUnsplashNonCdnHostname(url.hostname) : false;
}

/**
 * Follow Unsplash redirect chain and return the final images.unsplash.com URL.
 */
export async function resolveUnsplashCdnUrl(href) {
  const url = normalizeExternalImageUrl(href);
  if (!url || !isUnsplashNonCdnHostname(url.hostname)) {
    return href;
  }

  const response = await fetch(url.href, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });
  const finalUrl = response.url;
  if (!finalUrl.includes("images.unsplash.com")) {
    throw new Error(
      `Unsplash redirect did not reach images.unsplash.com: ${finalUrl}`,
    );
  }
  return finalUrl;
}

/** Apply publish-engine defaults for stored cover URLs. */
export function normalizePublishedUnsplashUrl(
  href,
  { width = 800, quality = 80 } = {},
) {
  const url = normalizeExternalImageUrl(href);
  if (!url || url.hostname !== "images.unsplash.com") {
    return href;
  }

  const next = new URL(url.toString());
  next.searchParams.set("w", String(width));
  next.searchParams.set("q", String(quality));
  next.searchParams.set("auto", "format");
  next.searchParams.set("fit", "crop");
  next.searchParams.delete("ixlib");
  next.searchParams.delete("ixid");
  return next.toString();
}

/**
 * Resolve and normalize a legacy Unsplash URL for CMS storage.
 */
export async function canonicalizeUnsplashCoverUrl(href) {
  const resolved = await resolveUnsplashCdnUrl(href);
  return normalizePublishedUnsplashUrl(resolved);
}

/**
 * Run async tasks with a concurrency cap.
 */
export async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await fn(items[current], current);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}
