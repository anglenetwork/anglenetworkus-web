import "server-only";

import { canonicalizeUnsplashUrl } from "./unsplash-cdn";
import type { EditorialImageInput } from "./resolve";

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
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => enrichCoverMediaInTree(item)));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;
  const enriched: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(record)) {
    if (key === "cover") {
      enriched[key] = await enrichCoverMediaField(
        child as EditorialImageInput | null | undefined,
      );
      continue;
    }

    if (key === "imageGallery" && Array.isArray(child)) {
      enriched[key] = await Promise.all(
        child.map((item) =>
          enrichCoverMediaField(item as EditorialImageInput | null | undefined),
        ),
      );
      continue;
    }

    enriched[key] = await enrichCoverMediaInTree(child);
  }

  return enriched;
}
