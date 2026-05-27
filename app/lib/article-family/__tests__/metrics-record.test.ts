import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdmin: {
    rpc: vi.fn(),
  },
}));

import { supabaseAdmin } from "@/lib/supabase/admin";
import { recordArticleView } from "../metrics";
import {
  mockPostgrestError,
  mockRpcError,
  mockRpcSuccess,
} from "./supabase-test-helpers";

describe("recordArticleView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue(mockRpcSuccess() as never);
  });

  it("delegates valid article types to increment_article_view", async () => {
    await recordArticleView({
      articleId: "doc-1",
      articleType: "analysis",
    });
    expect(supabaseAdmin.rpc).toHaveBeenCalledWith(
      "increment_article_view",
      expect.objectContaining({
        p_article_id: "doc-1",
        p_article_type: "analysis",
      }),
    );
  });

  it("rejects invalid article type", async () => {
    await expect(
      recordArticleView({
        articleId: "x",
        articleType: "not-a-type" as never,
      }),
    ).rejects.toThrow(/invalid articleType/i);
    expect(supabaseAdmin.rpc).not.toHaveBeenCalled();
  });

  it("propagates errors when metrics infra fails", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue(
      mockRpcError(
        mockPostgrestError({ message: "connection refused" }),
      ) as never,
    );
    await expect(
      recordArticleView({ articleId: "a", articleType: "post" }),
    ).rejects.toEqual(
      expect.objectContaining({ message: "connection refused" }),
    );
  });
});
