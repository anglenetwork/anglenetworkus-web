import { Tweet } from "react-tweet";
import { regularPostBodyVideoCaption } from "@/app/lib/typography/posts";

const NUMERIC_TWEET_ID = /^\d+$/;

export function isValidTweetId(id: string | null | undefined): id is string {
  return typeof id === "string" && NUMERIC_TWEET_ID.test(id);
}

type TweetEmbedBlockProps = {
  tweetId?: string | null;
  caption?: string | null;
};

export function TweetEmbedBlock({ tweetId, caption }: TweetEmbedBlockProps) {
  if (!isValidTweetId(tweetId)) return null;

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
