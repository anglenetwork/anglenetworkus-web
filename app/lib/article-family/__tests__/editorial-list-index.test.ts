import { describe, expect, it } from "vitest";
import {
  EDITORIAL_LIST_CONTENT_OFFSET,
  EDITORIAL_LIST_INITIAL_FETCH_SIZE,
  EDITORIAL_LIST_MORE_BATCH_SIZE,
  EDITORIAL_LIST_SIDEBAR_COUNT,
} from "@/app/components/article-family/editorial-list-index-constants";
import {
  OPINION_EDITORIAL_LIST_CONFIG,
  SPONSORED_EDITORIAL_LIST_CONFIG,
} from "@/app/lib/article-family/editorial-list-index-config";

describe("editorial list index", () => {
  it("uses shared fetch sizing constants", () => {
    expect(EDITORIAL_LIST_SIDEBAR_COUNT).toBe(5);
    expect(EDITORIAL_LIST_MORE_BATCH_SIZE).toBe(10);
    expect(EDITORIAL_LIST_CONTENT_OFFSET).toBe(6);
    expect(EDITORIAL_LIST_INITIAL_FETCH_SIZE).toBe(16);
  });

  it("defines opinion and sponsored configs with distinct API paths", () => {
    expect(OPINION_EDITORIAL_LIST_CONFIG.loadMoreApiPath).toBe("/api/opinion");
    expect(SPONSORED_EDITORIAL_LIST_CONFIG.loadMoreApiPath).toBe(
      "/api/sponsored",
    );
    expect(SPONSORED_EDITORIAL_LIST_CONFIG.sidebarTitle).toBe("More Sponsored");
  });
});
