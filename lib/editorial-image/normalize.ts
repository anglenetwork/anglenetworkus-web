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
