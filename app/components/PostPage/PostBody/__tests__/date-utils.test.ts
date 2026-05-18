import { describe, expect, it } from "vitest";
import { formatArticleTimestamp } from "../date-utils";

describe("formatArticleTimestamp", () => {
  const now = new Date("2026-05-17T18:00:00Z").getTime();

  it("returns an empty string for invalid dates", () => {
    expect(formatArticleTimestamp("not a date", now)).toBe("");
  });

  it("formats a very recent timestamp", () => {
    expect(formatArticleTimestamp("2026-05-17T17:59:30Z", now)).toBe(
      "just now",
    );
  });

  it("formats recent minutes", () => {
    expect(formatArticleTimestamp("2026-05-17T17:45:00Z", now)).toBe(
      "15 min ago",
    );
  });

  it("formats recent hours and minutes", () => {
    expect(formatArticleTimestamp("2026-05-17T15:30:00Z", now)).toBe(
      "2 hr 30 min ago",
    );
  });

  it("falls back to a calendar date for older timestamps", () => {
    expect(formatArticleTimestamp("2026-05-15T12:00:00Z", now)).toBe(
      "May 15, 2026",
    );
  });
});
