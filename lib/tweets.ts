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

  return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true`;
}
