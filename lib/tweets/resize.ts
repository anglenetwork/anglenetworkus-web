/** Parses Twitter embed resize postMessage payloads into iframe height (px). */
export function parseTweetResizeHeight(data: unknown): number | null {
  if (typeof data === "string") {
    try {
      return parseTweetResizeHeight(JSON.parse(data));
    } catch {
      return null;
    }
  }

  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const embed = record["twttr.embed"];
  if (!embed || typeof embed !== "object") return null;

  const method = (embed as Record<string, unknown>).method;
  if (typeof method !== "string" || !method.includes("resize")) return null;

  const params = (embed as Record<string, unknown>).params;
  if (!Array.isArray(params) || params.length === 0) return null;

  const first = params[0];
  if (typeof first === "number" && Number.isFinite(first) && first > 0) {
    return Math.ceil(first);
  }

  if (first && typeof first === "object" && "height" in first) {
    const height = (first as { height?: unknown }).height;
    if (typeof height === "number" && Number.isFinite(height) && height > 0) {
      return Math.ceil(height);
    }
  }

  return null;
}
