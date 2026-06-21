/** Hosts where Next.js image optimization is allowed at runtime (external URLs). */
export const OPTIMIZABLE_REMOTE_HOSTS = [
  "cdn.sanity.io",
  "images.unsplash.com",
  "images.pexels.com",
] as const;

/** All hostnames allowed in next.config `remotePatterns` (includes non-optimizable hosts). */
export const REMOTE_PATTERN_HOSTS = [
  ...OPTIMIZABLE_REMOTE_HOSTS,
  "upload.wikimedia.org",
  "commons.wikimedia.org",
  "pixabay.com",
  "cdn.pixabay.com",
  "zmpglszxzgwsnvwhsxiv.supabase.co",
] as const;

const WIKIMEDIA_HOST_RE = /(^|\.)upload\.wikimedia\.org$/;

export function isWikimediaHostname(hostname: string): boolean {
  return WIKIMEDIA_HOST_RE.test(hostname);
}

export function isWikimediaUrl(url: string | URL): boolean {
  try {
    const parsed = typeof url === "string" ? new URL(url) : url;
    return isWikimediaHostname(parsed.hostname);
  } catch {
    return false;
  }
}

export function isOptimizableRemoteHost(hostname: string): boolean {
  return (OPTIMIZABLE_REMOTE_HOSTS as readonly string[]).includes(hostname);
}

export function isOptimizableRemoteUrl(url: string | URL): boolean {
  try {
    const parsed = typeof url === "string" ? new URL(url) : url;
    return isOptimizableRemoteHost(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Whether next/image should use unoptimized mode for an external URL.
 * Wikimedia is always unoptimized (rate limits); "auto" follows optimizable host list.
 */
export function shouldUnoptimizeExternalUrl(
  url: URL,
  policy: boolean | "auto",
): boolean {
  if (isWikimediaHostname(url.hostname)) {
    return true;
  }
  if (policy === "auto") {
    return !isOptimizableRemoteHost(url.hostname);
  }
  return policy;
}

/** @deprecated Use isOptimizableRemoteUrl — kept for isWhitelistedDomain name in sanity/lib/utils */
export function isWhitelistedDomain(url: string): boolean {
  return isOptimizableRemoteUrl(url);
}
