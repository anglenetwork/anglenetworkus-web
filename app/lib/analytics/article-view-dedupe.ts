const DEDUPE_MS = 30 * 60 * 1000;

export function articleViewStorageKey(articleId: string) {
  return `article-viewed:${articleId}`;
}

export function isAutomatedBrowser() {
  return typeof navigator !== "undefined" && navigator.webdriver === true;
}

export function isWithinArticleViewDedupeWindow(articleId: string) {
  try {
    const raw = localStorage.getItem(articleViewStorageKey(articleId));
    if (!raw) return false;

    const viewedAt = Number.parseInt(raw, 10);
    return (
      !Number.isNaN(viewedAt) && Date.now() - viewedAt < DEDUPE_MS
    );
  } catch {
    return false;
  }
}

export function markArticleViewRecorded(articleId: string) {
  try {
    localStorage.setItem(articleViewStorageKey(articleId), String(Date.now()));
  } catch {
    /* ignore */
  }
}
