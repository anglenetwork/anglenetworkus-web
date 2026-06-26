import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";

type EditorialListApiHandlerOptions = {
  indexQuery: string;
};

export async function handleEditorialListApiRequest(
  request: NextRequest,
  { indexQuery }: EditorialListApiHandlerOptions,
) {
  try {
    const { searchParams } = new URL(request.url);
    const rawStart = parseInt(searchParams.get("start") || "0", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
    const start = Number.isFinite(rawStart) && rawStart >= 0 ? rawStart : 0;
    const limit =
      Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(rawLimit, 20) : 10;
    const end = start + limit;

    const rows = await sanityFetch({
      query: indexQuery,
      params: { start, end },
    });

    const articles = (Array.isArray(rows) ? rows : [])
      .map((row) => normalizeArticleFamilyCard(row))
      .filter(
        (article): article is NonNullable<typeof article> => article != null,
      );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Editorial list API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
