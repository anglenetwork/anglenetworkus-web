import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-tweet", () => ({
  Tweet: ({ id }: { id: string }) => (
    <div data-testid="mock-tweet">Tweet {id}</div>
  ),
}));

import { TweetEmbedBlock, isValidTweetId } from "../TweetEmbedBlock";

afterEach(() => {
  cleanup();
});

describe("isValidTweetId", () => {
  it("accepts numeric tweet IDs", () => {
    expect(isValidTweetId("1629307668568633344")).toBe(true);
  });

  it("rejects missing or non-numeric IDs", () => {
    expect(isValidTweetId(null)).toBe(false);
    expect(isValidTweetId(undefined)).toBe(false);
    expect(isValidTweetId("")).toBe(false);
    expect(isValidTweetId("abc123")).toBe(false);
  });
});

describe("TweetEmbedBlock", () => {
  it("renders a tweet embed for a valid ID", () => {
    render(<TweetEmbedBlock tweetId="1629307668568633344" />);

    expect(screen.getByLabelText("Embedded post from X")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tweet")).toHaveTextContent(
      "Tweet 1629307668568633344",
    );
  });

  it("renders an optional caption below the embed", () => {
    render(
      <TweetEmbedBlock
        tweetId="1629307668568633344"
        caption="  Editor note about this post.  "
      />,
    );

    expect(screen.getByText("Editor note about this post.")).toBeInTheDocument();
  });

  it("renders nothing when tweet ID is missing or invalid", () => {
    const { container: missing } = render(<TweetEmbedBlock tweetId={null} />);
    expect(missing.firstChild).toBeNull();

    const { container: invalid } = render(
      <TweetEmbedBlock tweetId="not-numeric" />,
    );
    expect(invalid.firstChild).toBeNull();
  });
});
