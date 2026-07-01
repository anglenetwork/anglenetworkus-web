import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TweetEmbedBlock } from "../TweetEmbedBlock";

const VALID_TWEET_URL = "https://twitter.com/jack/status/1629307668568633344";
const EMBED_SRC =
  "https://platform.twitter.com/embed/Tweet.html?dnt=true&id=1629307668568633344&theme=light&width=550&frame=false&hideThread=false";

afterEach(() => {
  cleanup();
});

describe("TweetEmbedBlock", () => {
  it("renders a tweet embed for a valid URL", () => {
    render(<TweetEmbedBlock url={VALID_TWEET_URL} />);

    expect(screen.getByLabelText("Embedded post from X")).toBeInTheDocument();
    const iframe = screen.getByTitle(
      "Embedded post 1629307668568633344 from X",
    );
    expect(iframe).toHaveAttribute("src", EMBED_SRC);
    expect(iframe).toHaveAttribute(
      "sandbox",
      "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms",
    );
  });

  it("extracts the ID from a URL with query params", () => {
    render(<TweetEmbedBlock url={`${VALID_TWEET_URL}?s=20&t=abc`} />);

    const iframe = screen.getByTitle(
      "Embedded post 1629307668568633344 from X",
    );
    expect(iframe).toHaveAttribute("src", EMBED_SRC);
  });

  it("resizes the iframe when Twitter posts twttr.private.resize", () => {
    render(<TweetEmbedBlock url={VALID_TWEET_URL} />);

    const iframe = screen.getByTitle(
      "Embedded post 1629307668568633344 from X",
    ) as HTMLIFrameElement;

    expect(iframe.style.height).toBe("0px");
    expect(iframe).toHaveAttribute("scrolling", "no");

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://platform.twitter.com",
          data: {
            "twttr.embed": {
              method: "twttr.private.resize",
              params: [{ height: 283, width: 550 }],
            },
          },
        }),
      );
    });

    expect(iframe.style.height).toBe("283px");
  });

  it("uses the tallest resize height when Twitter sends multiple events", () => {
    render(<TweetEmbedBlock url={VALID_TWEET_URL} />);

    const iframe = screen.getByTitle(
      "Embedded post 1629307668568633344 from X",
    ) as HTMLIFrameElement;

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://platform.twitter.com",
          data: {
            "twttr.embed": {
              method: "twttr.private.resize",
              params: [{ height: 280, width: 550 }],
            },
          },
        }),
      );
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://platform.twitter.com",
          data: {
            "twttr.embed": {
              method: "twttr.private.resize",
              params: [{ height: 286, width: 550 }],
            },
          },
        }),
      );
    });

    expect(iframe.style.height).toBe("286px");
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
