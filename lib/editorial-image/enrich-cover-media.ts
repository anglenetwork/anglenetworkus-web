import "server-only";

import { canonicalizeUnsplashUrl, isUnsplashNonCdnUrl } from "./unsplash-cdn";
import type { EditorialImageInput } from "./resolve";

function coverExternalUrl(
  cover: EditorialImageInput | null | undefined,
): string | null {
  if (!cover || typeof cover !== "object") return null;
  const externalUrl = cover.externalUrl?.trim();
  return externalUrl || null;
}

function collectUnsplashCoverUrls(value: unknown, urls: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectUnsplashCoverUrls(item, urls);
    }
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;

  for (const [key, child] of Object.entries(record)) {
    if (key === "cover") {
      const externalUrl = coverExternalUrl(
        child as EditorialImageInput | null | undefined,
      );
      if (externalUrl && isUnsplashNonCdnUrl(externalUrl)) {
        urls.add(externalUrl);
      }
      continue;
    }

    if (key === "imageGallery" && Array.isArray(child)) {
      for (const item of child) {
        const externalUrl = coverExternalUrl(
          item as EditorialImageInput | null | undefined,
        );
        if (externalUrl && isUnsplashNonCdnUrl(externalUrl)) {
          urls.add(externalUrl);
        }
      }
      continue;
    }

    collectUnsplashCoverUrls(child, urls);
  }
}

function enrichCoverMediaFieldWithMap(
  cover: EditorialImageInput | null | undefined,
  resolved: Map<string, string>,
): EditorialImageInput | null | undefined {
  if (!cover || typeof cover !== "object") return cover;

  const externalUrl = cover.externalUrl?.trim();
  if (!externalUrl) return cover;

  const canonical = resolved.get(externalUrl) ?? externalUrl;
  if (canonical === externalUrl) return cover;

  return {
    ...cover,
    externalUrl: canonical,
    source: "external",
  };
}

function applyCoverEnrichment(
  value: unknown,
  resolved: Map<string, string>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => applyCoverEnrichment(item, resolved));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;
  const enriched: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(record)) {
    if (key === "cover") {
      enriched[key] = enrichCoverMediaFieldWithMap(
        child as EditorialImageInput | null | undefined,
        resolved,
      );
      continue;
    }

    if (key === "imageGallery" && Array.isArray(child)) {
      enriched[key] = child.map((item) =>
        enrichCoverMediaFieldWithMap(
          item as EditorialImageInput | null | undefined,
          resolved,
        ),
      );
      continue;
    }

    enriched[key] = applyCoverEnrichment(child, resolved);
  }

  return enriched;
}

export async function enrichCoverMediaField(
  cover: EditorialImageInput | null | undefined,
): Promise<EditorialImageInput | null | undefined> {
  if (!cover || typeof cover !== "object") return cover;

  const externalUrl = cover.externalUrl?.trim();
  if (!externalUrl) return cover;

  const canonical = await canonicalizeUnsplashUrl(externalUrl);
  if (canonical === externalUrl) return cover;

  return {
    ...cover,
    externalUrl: canonical,
    source: "external",
  };
}

/** Walk homepage payloads and canonicalize non-CDN Unsplash cover URLs. */
export async function enrichCoverMediaInTree(value: unknown): Promise<unknown> {
  const urls = new Set<string>();
  collectUnsplashCoverUrls(value, urls);

  if (urls.size === 0) {
    return value;
  }

  const resolved = new Map<string, string>();
  await Promise.all(
    [...urls].map(async (href) => {
      resolved.set(href, await canonicalizeUnsplashUrl(href));
    }),
  );

  return applyCoverEnrichment(value, resolved);
}
