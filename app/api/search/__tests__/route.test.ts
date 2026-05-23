import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
}));

vi.mock("@/sanity/lib/client", () => ({
  client: { fetch: fetchMock },
}));

import { GET } from "../route";

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty payload when q is missing", async () => {
    const res = await GET(
      new NextRequest("http://localhost/api/search?sort=relevance&type=all")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      query: "",
      total: 0,
      totalPages: 0,
      results: [],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns results for relevance sort without 500", async () => {
    fetchMock
      .mockResolvedValueOnce([
        {
          _id: "post-1",
          _type: "post",
          title: "Trump headline",
          slug: "trump-headline",
          publishedAt: "2024-01-01T00:00:00.000Z",
        },
      ])
      .mockResolvedValueOnce(1);

    const res = await GET(
      new NextRequest(
        "http://localhost/api/search?q=trump&sort=relevance&type=all"
      )
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.query).toBe("trump");
    expect(body.sort).toBe("relevance");
    expect(body.total).toBe(1);
    expect(body.results).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      term: "trump*",
      start: 0,
      end: 10,
    });
  });

  it("routes sponsored type to sponsored queries", async () => {
    fetchMock.mockResolvedValueOnce([]).mockResolvedValueOnce(0);

    const res = await GET(
      new NextRequest(
        "http://localhost/api/search?q=partner&sort=relevance&type=sponsored"
      )
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.type).toBe("sponsored");
    expect(String(fetchMock.mock.calls[0][0])).toContain('_type == "sponsored"');
  });

  it("does not expose raw Sanity errors", async () => {
    fetchMock.mockRejectedValue(
      new Error("score() function received unexpected expression")
    );

    const res = await GET(
      new NextRequest("http://localhost/api/search?q=trump&sort=relevance")
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "Internal server error" });
  });
});
