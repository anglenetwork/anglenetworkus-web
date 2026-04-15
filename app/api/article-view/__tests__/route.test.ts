import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { recordArticleView } = vi.hoisted(() => ({
  recordArticleView: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/app/lib/article-family/metrics", () => ({
  isArticleMetricTypeString: (s: string) =>
    ["post", "opinion", "analysis", "sponsored"].includes(s),
  recordArticleView,
}));

import { POST } from "../route";

describe("POST /api/article-view", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    recordArticleView.mockResolvedValue(undefined);
  });

  it("rejects non-POST semantics via handler (invalid json)", async () => {
    const req = new NextRequest("http://localhost/api/article-view", {
      method: "POST",
      body: "not-json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid json");
  });

  it("rejects invalid body shape", async () => {
    const req = new NextRequest("http://localhost/api/article-view", {
      method: "POST",
      body: JSON.stringify(null),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects missing articleId", async () => {
    const req = new NextRequest("http://localhost/api/article-view", {
      method: "POST",
      body: JSON.stringify({ articleType: "post" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid articleType", async () => {
    const req = new NextRequest("http://localhost/api/article-view", {
      method: "POST",
      body: JSON.stringify({ articleId: "x", articleType: "bogus" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid articleType");
  });

  it("accepts valid payload and calls recordArticleView", async () => {
    const req = new NextRequest("http://localhost/api/article-view", {
      method: "POST",
      body: JSON.stringify({ articleId: " abc ", articleType: "post" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(recordArticleView).toHaveBeenCalledWith({
      articleId: "abc",
      articleType: "post",
    });
  });

  it("does not expose raw DB errors to the client", async () => {
    recordArticleView.mockRejectedValue(new Error("secret db failure"));
    const req = new NextRequest("http://localhost/api/article-view", {
      method: "POST",
      body: JSON.stringify({ articleId: "x", articleType: "post" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("failed");
    expect(JSON.stringify(body)).not.toContain("secret db");
  });
});
