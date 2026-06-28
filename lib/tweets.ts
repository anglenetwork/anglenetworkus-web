function safeParseUrl(input: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

const ALLOWED_TWEET_HOSTS = new Set([
  "twitter.com",
  "mobile.twitter.com",
  "x.com",
]);

/**
 * Extracts the numeric tweet/status ID from a Twitter/X status URL.
 * Returns null for invalid or unsupported URLs.
 */
export function extractTweetId(input: string): string | null {
  if (!input?.trim()) return null;

  const parsed = safeParseUrl(input);
  if (!parsed) return null;

  const normalizedHost = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (!ALLOWED_TWEET_HOSTS.has(normalizedHost)) return null;

  const match = parsed.pathname.match(/\/status\/(\d+)/);
  if (!match?.[1]) return null;

  const id = match[1];
  if (!/^\d+$/.test(id)) return null;

  return id;
}

/**
 * Returns true when the input is a supported Twitter/X status URL.
 */
export function isTweetUrl(input: string): boolean {
  return extractTweetId(input) !== null;
}

export function getTweetEmbedSrc(input: string): string | null {
  const tweetId = extractTweetId(input);
  if (!tweetId) return null;

  const params = new URLSearchParams({
    dnt: "true",
    id: tweetId,
    theme: "light",
    width: "550",
    frame: "false",
    hideThread: "false",
  });

  return `https://platform.twitter.com/embed/Tweet.html?${params.toString()}`;
}

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
