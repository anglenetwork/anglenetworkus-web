import { NextRequest, NextResponse } from "next/server";
import { trackTagView } from "@/app/lib/analytics/track-tag-view";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Tag slug is required" },
        { status: 400 },
      );
    }

    await trackTagView(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking tag view:", error);
    return NextResponse.json(
      { error: "Failed to track tag view" },
      { status: 500 },
    );
  }
}
