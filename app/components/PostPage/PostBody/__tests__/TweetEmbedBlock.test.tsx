import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-tweet", () => ({
  Tweet: ({ id }: { id: string }) => (
    <div data-testid="mock-tweet">Tweet {id}</div>
  ),
}));

import { TweetEmbedBlock } from "../TweetEmbedBlock";

const VALID_TWEET_URL = "https://twitter.com/jack/status/1629307668568633344";

afterEach(() => {
  cleanup();
});

describe("TweetEmbedBlock", () => {
  it("renders a tweet embed for a valid URL", () => {
    render(<TweetEmbedBlock url={VALID_TWEET_URL} />);

    expect(screen.getByLabelText("Embedded post from X")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tweet")).toHaveTextContent(
      "Tweet 1629307668568633344",
    );
  });

  it("extracts the ID from a URL with query params", () => {
    render(<TweetEmbedBlock url={`${VALID_TWEET_URL}?s=20&t=abc`} />);

    expect(screen.getByTestId("mock-tweet")).toHaveTextContent(
      "Tweet 1629307668568633344",
    );
  });

  it("renders an optional caption below the embed", () => {
    render(
      <TweetEmbedBlock
        url={VALID_TWEET_URL}
        caption="  Editor note about this post.  "
      />,
    );

    expect(
      screen.getByText("Editor note about this post."),
    ).toBeInTheDocument();
  });

  it("renders nothing when URL is missing", () => {
    const { container } = render(<TweetEmbedBlock url={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for an invalid URL and does not crash", () => {
    const { container } = render(
      <TweetEmbedBlock url="https://example.com/not-a-tweet" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
