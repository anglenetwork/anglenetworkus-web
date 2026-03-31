"use client";

import { useEffect, useRef } from "react";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";

const DEDUPE_MS = 30 * 60 * 1000;

function storageKey(articleId: string) {
  return `article-viewed:${articleId}`;
}

function sendView(articleId: string, articleType: ArticleFamilyDocType) {
  const payload = JSON.stringify({ articleId, articleType });
  const url = "/api/article-view";

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) {
      try {
        localStorage.setItem(storageKey(articleId), String(Date.now()));
      } catch {
        /* ignore */
      }
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
        try {
          localStorage.setItem(storageKey(articleId), String(Date.now()));
        } catch {
          /* ignore */
        }
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

  useEffect(() => {
    if (sentRef.current) return;
    if (!articleId?.trim() || !articleType) return;

    if (typeof navigator !== "undefined" && navigator.webdriver === true) {
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey(articleId));
      if (raw) {
        const t = Number.parseInt(raw, 10);
        if (!Number.isNaN(t) && Date.now() - t < DEDUPE_MS) {
          return;
        }
      }
    } catch {
      /* proceed */
    }

    sentRef.current = true;
    sendView(articleId.trim(), articleType);
  }, [articleId, articleType]);

  return null;
}
