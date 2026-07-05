import { isOptimizableRemoteHost } from "./policy";

/**
 * Clamp width (and default quality for Unsplash) on optimizable CDNs so listing
 * cards do not fetch desktop-sized originals on mobile.
 */
export function clampOptimizableExternalUrl(url: URL, maxWidth: number): URL {
  if (!isOptimizableRemoteHost(url.hostname)) {
    return url;
  }

  const next = new URL(url.toString());
  const clampedWidth = Math.max(1, Math.round(maxWidth));
  next.searchParams.set("w", String(clampedWidth));

  if (url.hostname === "images.unsplash.com") {
    next.searchParams.set("q", next.searchParams.get("q") ?? "75");
    if (!next.searchParams.has("auto")) {
      next.searchParams.set("auto", "format");
    }
    if (!next.searchParams.has("fit")) {
      next.searchParams.set("fit", "crop");
    }
    // Drop Unsplash ixlib params that fight our width clamp on direct fetches.
    next.searchParams.delete("ixlib");
    next.searchParams.delete("ixid");
  } else if (!next.searchParams.has("q")) {
    next.searchParams.set("q", "80");
  }

  return next;
}

export function normalizeExternalImageUrl(
  value: string | null | undefined,
): URL | null {
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
