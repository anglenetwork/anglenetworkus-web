import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  getMostReadEditorial,
  getMostReadPosts,
  sortIdsBy10DayViewsThenPublishedAt,
  sortIdsByRankingThenPublishedAt,
} from "../metrics";
import type { ArticleRankingRow } from "../metrics";

function buildChain(result: { data: unknown[] | null; error: Error | null }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(result),
  };
  return chain;
}

describe("getMostReadEditorial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries only editorial types (excludes sponsored)", async () => {
    const chain = buildChain({
      data: [
        {
          article_id: "p1",
          article_type: "post",
          views_all: 0,
          views_7d: 5,
          views_30d: 0,
          last_viewed_at: null,
        },
      ],
      error: null,
    });
    vi.mocked(supabaseAdmin.from).mockReturnValue(chain as never);

    await getMostReadEditorial({ limit: 10 });

    expect(chain.in).toHaveBeenCalledWith("article_type", [
      "post",
      "opinion",
      "analysis",
    ]);
  });
});

describe("getMostReadPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters to post only", async () => {
    const chain = buildChain({ data: [], error: null });
    vi.mocked(supabaseAdmin.from).mockReturnValue(chain as never);

    await getMostReadPosts({ limit: 5 });

    expect(chain.eq).toHaveBeenCalledWith("article_type", "post");
  });

  it("uses 3-day rankings view when windowDays is 3", async () => {
    const chain = buildChain({ data: [], error: null });
    vi.mocked(supabaseAdmin.from).mockReturnValue(chain as never);

    await getMostReadPosts({ limit: 5, windowDays: 3 });

    expect(supabaseAdmin.from).toHaveBeenCalledWith(
      "article_metrics_rankings_3d",
    );
    expect(chain.order).toHaveBeenCalledWith("views_3d", {
      ascending: false,
    });
  });
});

describe("sortIdsByRankingThenPublishedAt", () => {
  it("orders by views7d desc, then lastViewedAt, then publishedAt", () => {
    const metrics = new Map<string, ArticleRankingRow>([
      [
        "a",
        {
          articleId: "a",
          articleType: "post",
          viewsAll: 0,
          views7d: 0,
          views30d: 0,
          lastViewedAt: null,
        },
      ],
      [
        "b",
        {
          articleId: "b",
          articleType: "post",
          viewsAll: 0,
          views7d: 0,
          views30d: 0,
          lastViewedAt: "2020-01-02T00:00:00.000Z",
        },
      ],
      [
        "c",
        {
          articleId: "c",
          articleType: "post",
          viewsAll: 0,
          views7d: 0,
          views30d: 0,
          lastViewedAt: "2020-01-03T00:00:00.000Z",
        },
      ],
      [
        "d",
        {
          articleId: "d",
          articleType: "post",
          viewsAll: 0,
          views7d: 10,
          views30d: 0,
          lastViewedAt: null,
        },
      ],
    ]);

    const items = [
      { _id: "a", publishedAt: "2020-01-02T00:00:00.000Z" },
      { _id: "b", publishedAt: "2020-01-01T00:00:00.000Z" },
      { _id: "c", publishedAt: "2020-01-01T00:00:00.000Z" },
      { _id: "d", publishedAt: "2019-01-01T00:00:00.000Z" },
    ];

    const sorted = sortIdsByRankingThenPublishedAt(items, metrics);
    expect(sorted.map((x) => x._id)).toEqual(["d", "c", "b", "a"]);
  });
});

describe("sortIdsBy10DayViewsThenPublishedAt", () => {
  it("orders by 10-day views desc, then last viewed, then publishedAt", () => {
    const views = new Map([
      ["a", { views10d: 1, lastViewedAt: null }],
      ["b", { views10d: 5, lastViewedAt: "2020-01-02T00:00:00.000Z" }],
      ["c", { views10d: 5, lastViewedAt: "2020-01-03T00:00:00.000Z" }],
    ]);

    const items = [
      { _id: "a", publishedAt: "2020-01-05T00:00:00.000Z" },
      { _id: "b", publishedAt: "2020-01-01T00:00:00.000Z" },
      { _id: "c", publishedAt: "2020-01-01T00:00:00.000Z" },
    ];

    const sorted = sortIdsBy10DayViewsThenPublishedAt(items, views);
    expect(sorted.map((item) => item._id)).toEqual(["c", "b", "a"]);
  });
});
