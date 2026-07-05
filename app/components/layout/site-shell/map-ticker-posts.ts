import type { TickerPost } from "./types";

export function mapTickerPosts(rows: unknown): TickerPost[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter(
      (row): row is { tickerTitle: string; slug: string } =>
        !!row &&
        typeof row === "object" &&
        "tickerTitle" in row &&
        typeof row.tickerTitle === "string" &&
        row.tickerTitle.length > 0 &&
        "slug" in row &&
        typeof row.slug === "string" &&
        row.slug.length > 0,
    )
    .map((row) => ({
      tickerTitle: row.tickerTitle,
      slug: row.slug,
    }));
}
