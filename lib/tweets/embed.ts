import { extractTweetId } from "./url";

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
