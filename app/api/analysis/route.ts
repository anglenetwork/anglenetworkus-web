import { NextRequest, NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { analysisIndexQuery } from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawStart = parseInt(searchParams.get("start") || "0", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
    const start = Number.isFinite(rawStart) && rawStart >= 0 ? rawStart : 0;
    const limit =
      Number.isFinite(rawLimit) && rawLimit >= 1
        ? Math.min(rawLimit, 20)
        : 10;
    const end = start + limit;

    const rows = await sanityFetch({
      query: analysisIndexQuery,
      params: { start, end },
    });

    const articles = (Array.isArray(rows) ? rows : [])
      .map((row) => normalizeArticleFamilyCard(row))
      .filter((article): article is NonNullable<typeof article> => article != null);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
