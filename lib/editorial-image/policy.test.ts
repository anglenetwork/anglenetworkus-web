import { describe, expect, it } from "vitest";

import {
  isOptimizableRemoteHost,
  isWikimediaHostname,
  isWikimediaUrl,
  shouldUnoptimizeExternalUrl,
} from "./policy";

describe("editorial-image policy", () => {
  it("detects Wikimedia upload hostnames", () => {
    expect(isWikimediaHostname("upload.wikimedia.org")).toBe(true);
    expect(
      isWikimediaUrl(
        "https://upload.wikimedia.org/wikipedia/commons/a/ab/File.jpg",
      ),
    ).toBe(true);
    expect(isWikimediaHostname("images.unsplash.com")).toBe(false);
  });

  it("marks optimizable remote hosts", () => {
    expect(isOptimizableRemoteHost("cdn.sanity.io")).toBe(true);
    expect(isOptimizableRemoteHost("pixabay.com")).toBe(false);
    expect(isOptimizableRemoteHost("cdn.example-wire.com")).toBe(false);
  });

  it("keeps unknown wire-style hosts unoptimized under auto policy", () => {
    const wire = new URL("https://cdn.example-wire.com/photo.jpg");
    expect(shouldUnoptimizeExternalUrl(wire, "auto")).toBe(true);
  });

  it("shouldUnoptimizeExternalUrl preserves auto vs boolean policies", () => {
    const wiki = new URL(
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/File.jpg",
    );
    const unsplash = new URL("https://images.unsplash.com/photo-1");
    const unknown = new URL("https://example.com/photo.jpg");

    expect(shouldUnoptimizeExternalUrl(wiki, "auto")).toBe(true);
    expect(shouldUnoptimizeExternalUrl(unsplash, "auto")).toBe(false);
    expect(shouldUnoptimizeExternalUrl(unknown, "auto")).toBe(true);
    expect(shouldUnoptimizeExternalUrl(unknown, false)).toBe(false);
    expect(shouldUnoptimizeExternalUrl(unknown, true)).toBe(true);
  });
});
