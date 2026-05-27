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
import {
  mockFromLimitProbe,
  mockPostgrestError,
  mockRpcError,
  mockRpcSuccess,
} from "./supabase-test-helpers";

describe("checkArticleMetricsReadiness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseAdmin.from).mockReturnValue(
      mockFromLimitProbe(null) as never,
    );
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue(
      mockRpcError(
        mockPostgrestError({
          message: "article_id required",
          code: "P0001",
        }),
      ) as never,
    );
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
    vi.mocked(supabaseAdmin.from).mockReturnValue(
      mockFromLimitProbe(
        mockPostgrestError({
          message: 'relation "public.article_metrics_daily" does not exist',
          code: "42P01",
        }),
      ) as never,
    );

    const r = await checkArticleMetricsReadiness();
    expect(r.ready).toBe(false);
    expect(r.hasDailyTable).toBe(false);
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it("returns ready false when increment RPC is missing", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue(
      mockRpcError(
        mockPostgrestError({
          message: "Could not find the function public.increment_article_view",
          code: "PGRST202",
        }),
      ) as never,
    );

    const r = await checkArticleMetricsReadiness();
    expect(r.ready).toBe(false);
    expect(r.hasIncrementFunction).toBe(false);
    expect(r.issues.some((i) => i.includes("increment_article_view"))).toBe(
      true,
    );
  });
});

describe("assertArticleMetricsReady", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseAdmin.from).mockReturnValue(
      mockFromLimitProbe(null) as never,
    );
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue(
      mockRpcError(
        mockPostgrestError({ message: "article_id required" }),
      ) as never,
    );
  });

  it("throws with operator guidance when not ready", async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValue(
      mockFromLimitProbe(
        mockPostgrestError({
          message: "does not exist",
          code: "PGRST205",
        }),
      ) as never,
    );

    await expect(assertArticleMetricsReady()).rejects.toThrow(
      /20260327_article_metrics\.sql/,
    );
  });
});
