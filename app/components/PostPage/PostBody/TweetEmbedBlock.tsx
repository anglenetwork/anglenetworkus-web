"use client";

import { useEffect, useRef, useState } from "react";
import { regularPostBodyVideoCaption } from "@/app/lib/typography/posts";
import {
  extractTweetId,
  getTweetEmbedSrc,
  parseTweetResizeHeight,
} from "@/lib/tweets";

type TweetEmbedBlockProps = {
  url?: string | null;
  caption?: string | null;
};

const TWITTER_EMBED_ORIGINS = new Set([
  "https://platform.twitter.com",
  "https://platform.x.com",
]);

export function TweetEmbedBlock({ url, caption }: TweetEmbedBlockProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const tweetId = url ? extractTweetId(url) : null;
  const src = url ? getTweetEmbedSrc(url) : null;

  useEffect(() => {
    if (!src) return;

    function onMessage(event: MessageEvent) {
      if (!TWITTER_EMBED_ORIGINS.has(event.origin)) return;

      const nextHeight = parseTweetResizeHeight(event.data);
      if (!nextHeight) return;

      // Twitter may send several resize events; keep the tallest to avoid clipping.
      setHeight((current) =>
        current == null ? nextHeight : Math.max(current, nextHeight),
      );
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [src]);

  if (!tweetId || !src) return null;

  const trimmedCaption = caption?.trim();

  return (
    <figure className="my-8 text-left" aria-label="Embedded post from X">
      <div className="mx-auto w-full max-w-[550px] overflow-hidden">
        <iframe
          ref={iframeRef}
          src={src}
          title={`Embedded post ${tweetId} from X`}
          className="mx-auto block w-full max-w-[550px] border-0"
          style={{
            height: height ?? 0,
            overflow: "hidden",
          }}
          scrolling="no"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="encrypted-media; fullscreen"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
      {trimmedCaption ? (
        <figcaption
          className={`mt-2 text-center ${regularPostBodyVideoCaption}`}
        >
          {trimmedCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
