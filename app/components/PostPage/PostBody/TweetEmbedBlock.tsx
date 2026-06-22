import { Tweet } from "react-tweet";
import { regularPostBodyVideoCaption } from "@/app/lib/typography/posts";
import { extractTweetId } from "@/lib/tweets";

type TweetEmbedBlockProps = {
  url?: string | null;
  caption?: string | null;
};

export function TweetEmbedBlock({ url, caption }: TweetEmbedBlockProps) {
  const tweetId = url ? extractTweetId(url) : null;
  if (!tweetId) return null;

  const trimmedCaption = caption?.trim();

  return (
    <figure className="my-8 text-left" aria-label="Embedded post from X">
      <div className="mx-auto w-full max-w-[550px] overflow-hidden [&_.react-tweet]:mx-auto">
        <Tweet id={tweetId} />
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
