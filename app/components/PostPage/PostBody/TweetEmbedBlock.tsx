import { regularPostBodyVideoCaption } from "@/app/lib/typography/posts";
import { extractTweetId, getTweetEmbedSrc } from "@/lib/tweets";

type TweetEmbedBlockProps = {
  url?: string | null;
  caption?: string | null;
};

export function TweetEmbedBlock({ url, caption }: TweetEmbedBlockProps) {
  const tweetId = url ? extractTweetId(url) : null;
  const src = url ? getTweetEmbedSrc(url) : null;
  if (!tweetId || !src) return null;

  const trimmedCaption = caption?.trim();

  return (
    <figure className="my-8 text-left" aria-label="Embedded post from X">
      <div className="mx-auto w-full max-w-[550px] overflow-hidden">
        <div className="relative w-full overflow-hidden rounded-lg">
          <iframe
            src={src}
            title={`Embedded post ${tweetId} from X`}
            className="mx-auto block w-full max-w-[550px] border-0"
            style={{ minHeight: 400 }}
            loading="lazy"
            sandbox="allow-scripts allow-presentation allow-popups"
          />
        </div>
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
