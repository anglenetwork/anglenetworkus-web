import { describe, it, expect } from "vitest";
import { initialViewsAllFromDoc } from "../../scripts/lib/backfill-article-metrics-logic.mjs";

describe("initialViewsAllFromDoc", () => {
  it("returns 0 for non-post types", () => {
    expect(initialViewsAllFromDoc({ _type: "opinion", viewsAll: 99 })).toBe(0);
    expect(initialViewsAllFromDoc({ _type: "sponsored" })).toBe(0);
  });

  it("floors legacy viewsAll for posts", () => {
    expect(initialViewsAllFromDoc({ _type: "post", viewsAll: 12.7 })).toBe(12);
  });

  it("treats invalid views as 0", () => {
    expect(initialViewsAllFromDoc({ _type: "post", viewsAll: NaN })).toBe(0);
  });
});
