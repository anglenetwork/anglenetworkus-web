import { afterEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (href: string) => Promise<string>) => fn,
}));

describe("canonicalizeUnsplashUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    fetchMock.mockReset();
  });

  it("returns input unchanged in development without network", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { canonicalizeUnsplashUrl } = await import("./unsplash-cdn");
    const href = "https://unsplash.com/photos/abc/download";

    await expect(canonicalizeUnsplashUrl(href)).resolves.toBe(href);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("resolves non-CDN URLs in production via HEAD redirect", async () => {
    vi.stubEnv("NODE_ENV", "production");
    fetchMock.mockResolvedValue({
      url: "https://images.unsplash.com/photo-123?ixlib=rb-4.0.3",
    });

    const { canonicalizeUnsplashUrl } = await import("./unsplash-cdn");
    const href = "https://unsplash.com/photos/abc/download";

    await expect(canonicalizeUnsplashUrl(href)).resolves.toBe(
      "https://images.unsplash.com/photo-123?ixlib=rb-4.0.3",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      href,
      expect.objectContaining({ method: "HEAD", redirect: "follow" }),
    );
  });

  it("passes through images.unsplash.com URLs", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { canonicalizeUnsplashUrl } = await import("./unsplash-cdn");
    const href =
      "https://images.unsplash.com/photo-123?w=800&q=80&auto=format&fit=crop";

    await expect(canonicalizeUnsplashUrl(href)).resolves.toBe(href);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
