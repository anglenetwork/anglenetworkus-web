import { NextRequest, NextResponse } from "next/server";
import { runEditorialSearch } from "@/app/lib/search/run-editorial-search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = await runEditorialSearch({
      q: searchParams.get("q") || "",
      sort: searchParams.get("sort"),
      type: searchParams.get("type"),
      page: searchParams.get("page"),
    });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
