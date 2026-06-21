import { describe, expect, it } from "vitest";
import { extractTweetId, isTweetUrl } from "../tweets";

describe("extractTweetId", () => {
  it("extracts ID from a valid twitter.com URL", () => {
    expect(
      extractTweetId("https://twitter.com/jack/status/1629307668568633344"),
    ).toBe("1629307668568633344");
  });

  it("extracts ID from a valid x.com URL", () => {
    expect(
      extractTweetId("https://x.com/elonmusk/status/1629307668568633344"),
    ).toBe("1629307668568633344");
  });

  it("extracts ID from a URL with query params", () => {
    expect(
      extractTweetId(
        "https://twitter.com/jack/status/1629307668568633344?s=20&t=abc",
      ),
    ).toBe("1629307668568633344");
  });

  it("extracts ID from mobile.twitter.com URL", () => {
    expect(
      extractTweetId(
        "https://mobile.twitter.com/jack/status/1629307668568633344",
      ),
    ).toBe("1629307668568633344");
  });

  it("returns null for an invalid URL", () => {
    expect(extractTweetId("not a url")).toBeNull();
    expect(extractTweetId("https://example.com/status/123")).toBeNull();
  });

  it("returns null for a non-numeric ID", () => {
    expect(
      extractTweetId("https://twitter.com/jack/status/not-a-number"),
    ).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractTweetId("")).toBeNull();
    expect(extractTweetId("   ")).toBeNull();
  });
});

describe("isTweetUrl", () => {
  it("returns true for supported status URLs", () => {
    expect(
      isTweetUrl("https://twitter.com/jack/status/1629307668568633344"),
    ).toBe(true);
    expect(isTweetUrl("https://x.com/jack/status/1629307668568633344")).toBe(
      true,
    );
  });

  it("returns false for unsupported URLs", () => {
    expect(isTweetUrl("https://example.com/status/123")).toBe(false);
    expect(isTweetUrl("")).toBe(false);
  });
});
