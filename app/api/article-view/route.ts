import { NextRequest, NextResponse } from "next/server";
import {
  isArticleMetricTypeString,
  recordArticleView,
} from "@/app/lib/article-family/metrics";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    const { articleId, articleType } = body as {
      articleId?: unknown;
      articleType?: unknown;
    };

    if (typeof articleId !== "string" || !articleId.trim()) {
      return NextResponse.json(
        { error: "articleId required" },
        { status: 400 },
      );
    }

    if (
      typeof articleType !== "string" ||
      !isArticleMetricTypeString(articleType)
    ) {
      return NextResponse.json(
        { error: "invalid articleType" },
        { status: 400 },
      );
    }

    await recordArticleView({
      articleId: articleId.trim(),
      articleType,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("article-view error", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
