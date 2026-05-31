"use client";

import { useEffect, useRef } from "react";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { scheduleIdleTask } from "@/app/lib/schedule-idle";
import {
  isAutomatedBrowser,
  isWithinArticleViewDedupeWindow,
  markArticleViewRecorded,
} from "@/app/lib/analytics/article-view-dedupe";

function sendView(articleId: string, articleType: ArticleFamilyDocType) {
  const payload = JSON.stringify({ articleId, articleType });
  const url = "/api/article-view";

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) {
      markArticleViewRecorded(articleId);
      return;
    }
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  })
    .then((res) => {
      if (res.ok) {
        markArticleViewRecorded(articleId);
      }
    })
    .catch(() => {
      /* non-blocking */
    });
}

export default function ArticleViewTracker({
  articleId,
  articleType,
}: {
  articleId: string | undefined;
  articleType: ArticleFamilyDocType | undefined;
}) {
  const sentRef = useRef(false);
  const trackedArticleId = articleId?.trim();
  const trackedArticleType = articleType;

  useEffect(() => {
    if (sentRef.current || !trackedArticleId || !trackedArticleType) {
      return;
    }

    if (isAutomatedBrowser()) {
      return;
    }

    const cancel = scheduleIdleTask(() => {
      if (sentRef.current) return;
      if (isWithinArticleViewDedupeWindow(trackedArticleId)) return;

      sentRef.current = true;
      sendView(trackedArticleId, trackedArticleType);
    });

    return cancel;
  }, [trackedArticleId, trackedArticleType]);

  return null;
}
