const DEFAULT_ALLOWED_PREFIXES = [
  "/myprofile",
  "/signin",
  "/pricing",
  "/studio",
] as const;

type SafeRedirectOptions = {
  defaultPath?: string;
  allowedPrefixes?: readonly string[];
};

/**
 * Accept only same-origin relative paths from untrusted sources (URL params).
 * Rejects protocol-relative, absolute, and off-allowlist destinations.
 */
export function safeRelativeRedirectPath(
  candidate: string | null | undefined,
  options: SafeRedirectOptions = {},
): string {
  const defaultPath =
    options.defaultPath ?? "/myprofile/profile-details?post_login=1";

  if (candidate == null || candidate.trim() === "") {
    return defaultPath;
  }

  const trimmed = candidate.trim();

  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://") ||
    trimmed.includes("\\")
  ) {
    return defaultPath;
  }

  const pathOnly = trimmed.split(/[?#]/, 1)[0] ?? trimmed;
  const allowedPrefixes = options.allowedPrefixes ?? DEFAULT_ALLOWED_PREFIXES;

  const isAllowed = allowedPrefixes.some(
    (prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`),
  );

  if (!isAllowed) {
    return defaultPath;
  }

  return trimmed;
}

/** Append post_login=1 for auth callback destinations when missing. */
export function withPostLoginFlag(path: string): string {
  if (path.includes("post_login")) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}post_login=1`;
}
