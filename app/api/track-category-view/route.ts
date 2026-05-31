import { NextRequest, NextResponse } from "next/server";
import { trackCategoryView } from "@/app/lib/analytics/track-category-view";

export async function POST(request: NextRequest) {
  try {
    const { categorySlug } = await request.json();

    if (!categorySlug) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 },
      );
    }

    await trackCategoryView(categorySlug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking category view:", error);
    return NextResponse.json(
      { error: "Failed to track category view" },
      { status: 500 },
    );
  }
}
