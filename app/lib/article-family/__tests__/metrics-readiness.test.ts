import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdmin: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  checkArticleMetricsReadiness,
  assertArticleMetricsReady,
} from "../metrics-readiness";

describe("checkArticleMetricsReadiness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseAdmin.from).mockImplementation(() => ({
      select: () => ({
        limit: () => Promise.resolve({ error: null }),
      }),
    }));
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({
      error: { message: "article_id required", code: "P0001" },
    });
  });

  it("returns ready true when all objects are present", async () => {
    const r = await checkArticleMetricsReadiness();
    expect(r.ready).toBe(true);
    expect(r.hasDailyTable).toBe(true);
    expect(r.hasTotalsTable).toBe(true);
    expect(r.hasRankingsView).toBe(true);
    expect(r.hasIncrementFunction).toBe(true);
    expect(r.issues).toEqual([]);
  });

  it("returns ready false with issues when a table is missing", async () => {
    vi.mocked(supabaseAdmin.from).mockImplementation((name: string) => ({
      select: () => ({
        limit: () =>
          Promise.resolve({
            error: {
              message: 'relation "public.article_metrics_daily" does not exist',
              code: "42P01",
            },
          }),
      }),
    }));

    const r = await checkArticleMetricsReadiness();
    expect(r.ready).toBe(false);
    expect(r.hasDailyTable).toBe(false);
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it("returns ready false when increment RPC is missing", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({
      error: {
        message: "Could not find the function public.increment_article_view",
        code: "PGRST202",
      },
    });

    const r = await checkArticleMetricsReadiness();
    expect(r.ready).toBe(false);
    expect(r.hasIncrementFunction).toBe(false);
    expect(r.issues.some((i) => i.includes("increment_article_view"))).toBe(
      true
    );
  });
});

describe("assertArticleMetricsReady", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseAdmin.from).mockImplementation(() => ({
      select: () => ({
        limit: () => Promise.resolve({ error: null }),
      }),
    }));
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({
      error: { message: "article_id required" },
    });
  });

  it("throws with operator guidance when not ready", async () => {
    vi.mocked(supabaseAdmin.from).mockImplementation(() => ({
      select: () => ({
        limit: () =>
          Promise.resolve({
            error: { message: "does not exist", code: "PGRST205" },
          }),
      }),
    }));

    await expect(assertArticleMetricsReady()).rejects.toThrow(
      /20260327_article_metrics\.sql/
    );
  });
});
