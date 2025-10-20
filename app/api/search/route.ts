// /app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import {
  searchPostsRelevanceQuery,
  searchPostsNewestQuery,
  // NOTE: we intentionally don't import searchTagsQuery/searchTopicsQuery here
} from "@/sanity/lib/queries";

/**
 * This endpoint now returns **only posts** for search results.
 * If you want tags/topics for autosuggest, use a separate endpoint (e.g. /api/suggest).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const sortParam = (searchParams.get("sort") || "relevance").toLowerCase();
    const sort = sortParam === "relevancy" ? "relevance" : sortParam; // accept both
    const postLimit = parseInt(searchParams.get("postLimit") || "10", 10);

    if (!q) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Prefix matching (tokenized)
    const term = q
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => `${t}*`)
      .join(" ");

    // Fetch posts only
    const posts = await client.fetch(
      sort === "newest" ? searchPostsNewestQuery : searchPostsRelevanceQuery,
      { term, limit: postLimit }
    );

    // Safety net: enforce posts-only
    const postOnly = Array.isArray(posts)
      ? posts.filter((d: any) => d && d._type === "post")
      : [];

    return NextResponse.json({
      query: q,
      results: { posts: postOnly }, // 🔒 no tags/topics here
      totalResults: {
        posts: postOnly.length,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
