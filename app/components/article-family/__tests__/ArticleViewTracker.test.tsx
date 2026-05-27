import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import ArticleViewTracker from "../ArticleViewTracker";

vi.mock("@/app/lib/schedule-idle", () => ({
  scheduleIdleTask: (task: () => void) => {
    task();
    return () => {};
  },
}));

describe("ArticleViewTracker", () => {
  const originalSendBeacon = navigator.sendBeacon;
  const originalWebdriver = Object.getOwnPropertyDescriptor(
    Navigator.prototype,
    "webdriver",
  );

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    // Force fetch path (sendBeacon would skip fetch mock)
    navigator.sendBeacon = vi
      .fn()
      .mockReturnValue(false) as typeof navigator.sendBeacon;
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    navigator.sendBeacon = originalSendBeacon;
    if (originalWebdriver) {
      Object.defineProperty(
        Navigator.prototype,
        "webdriver",
        originalWebdriver,
      );
    }
  });

  it("skips when navigator.webdriver is true", () => {
    Object.defineProperty(Navigator.prototype, "webdriver", {
      configurable: true,
      get: () => true,
    });
    render(<ArticleViewTracker articleId="a1" articleType="post" />);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("skips when same article was viewed within 30 minutes", () => {
    Object.defineProperty(Navigator.prototype, "webdriver", {
      configurable: true,
      get: () => false,
    });
    localStorage.setItem("article-viewed:a1", String(Date.now()));

    render(<ArticleViewTracker articleId="a1" articleType="post" />);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends a request when outside the dedupe window", async () => {
    Object.defineProperty(Navigator.prototype, "webdriver", {
      configurable: true,
      get: () => false,
    });
    localStorage.setItem(
      "article-viewed:a1",
      String(Date.now() - 31 * 60 * 1000),
    );

    await act(async () => {
      render(<ArticleViewTracker articleId="a1" articleType="post" />);
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/article-view",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ articleId: "a1", articleType: "post" }),
        keepalive: true,
      }),
    );
  });

  it("uses localStorage key article-viewed:${articleId}", async () => {
    Object.defineProperty(Navigator.prototype, "webdriver", {
      configurable: true,
      get: () => false,
    });

    await act(async () => {
      render(<ArticleViewTracker articleId="my-id" articleType="opinion" />);
    });

    expect(localStorage.getItem("article-viewed:my-id")).toBeTruthy();
  });
});
