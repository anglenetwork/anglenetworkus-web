import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

export async function POST(req: NextRequest) {
  try {
    console.log("track-view API called");
    const { postId } = await req.json();
    console.log("track-view postId:", postId);
    
    if (!postId) {
      console.log("track-view: Missing postId");
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    console.log("track-view: Updating views for postId:", postId);
    await client
      .withConfig({ token, useCdn: false })
      .patch(postId)
      .setIfMissing({ viewsAll: 0, views30d: 0, views7d: 0 })
      .inc({ viewsAll: 1, views30d: 1, views7d: 1 })
      .commit({ autoGenerateArrayKeys: true });

    console.log("track-view: Successfully updated views");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("track-view error", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
