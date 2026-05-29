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
  next.searchParams.set("w", String(Math.max(1, Math.round(maxWidth))));

  if (url.hostname === "images.unsplash.com" && !next.searchParams.has("q")) {
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
