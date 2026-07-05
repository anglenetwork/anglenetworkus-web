import "server-only";

import { unstable_cache } from "next/cache";
import { normalizeExternalImageUrl } from "./normalize";

export function isUnsplashNonCdnHostname(hostname: string): boolean {
  return hostname.replace(/^www\./, "") === "unsplash.com";
}

export function isUnsplashNonCdnUrl(href: string): boolean {
  const url = normalizeExternalImageUrl(href);
  return url ? isUnsplashNonCdnHostname(url.hostname) : false;
}

const redirectToImagesUnsplash = unstable_cache(
  async (href: string): Promise<string> => {
    const response = await fetch(href, {
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
  },
  ["editorial-unsplash-cdn-redirect"],
  { revalidate: 604800 },
);

/** Resolve `unsplash.com/photos/.../download` links to a stable `images.unsplash.com` URL. */
export async function canonicalizeUnsplashUrl(href: string): Promise<string> {
  const url = normalizeExternalImageUrl(href);
  if (!url || !isUnsplashNonCdnHostname(url.hostname)) {
    return href;
  }

  try {
    return await redirectToImagesUnsplash(url.href);
  } catch (error) {
    console.warn("Failed to resolve Unsplash CDN URL:", href, error);
    return href;
  }
}
