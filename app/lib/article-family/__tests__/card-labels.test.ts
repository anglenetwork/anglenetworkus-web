import { describe, expect, it } from "vitest";
import {
  editorialKicker,
  searchResultSectionKicker,
  typeLabel,
} from "../card-labels";
import { getArticleFamilyCardThumbLayout } from "../card-thumb-layout";

describe("typeLabel", () => {
  it("returns News for post when showPostAsNews is true", () => {
    expect(typeLabel("post", true)).toBe("News");
    expect(typeLabel("post", false)).toBeNull();
  });

  it("returns editorial type labels", () => {
    expect(typeLabel("opinion", false)).toBe("Opinion");
    expect(typeLabel("analysis", false)).toBe("Analysis");
    expect(typeLabel("sponsored", false)).toBe("Sponsored");
  });
});

describe("editorialKicker", () => {
  it("prefers category title", () => {
    expect(
      editorialKicker(
        {
          _type: "post",
          category: { title: "Markets", slug: "markets" },
        } as Parameters<typeof editorialKicker>[0],
        null,
      ),
    ).toBe("Markets");
  });

  it("falls back to type or Trending", () => {
    expect(
      editorialKicker(
        { _type: "opinion" } as Parameters<typeof editorialKicker>[0],
        null,
      ),
    ).toBe("Opinion");
    expect(
      editorialKicker(
        { _type: "post" } as Parameters<typeof editorialKicker>[0],
        "News",
      ),
    ).toBe("News");
    expect(
      editorialKicker(
        { _type: "post" } as Parameters<typeof editorialKicker>[0],
        null,
      ),
    ).toBe("Trending");
  });
});

describe("searchResultSectionKicker", () => {
  it("returns category link when slug is present", () => {
    expect(
      searchResultSectionKicker(
        {
          _type: "post",
          category: { title: "Tech", slug: "tech" },
        } as Parameters<typeof searchResultSectionKicker>[0],
        "News",
      ),
    ).toEqual({ title: "Tech", href: "/category/tech" });
  });

  it("returns section href for opinion and analysis", () => {
    expect(
      searchResultSectionKicker(
        { _type: "opinion" } as Parameters<typeof searchResultSectionKicker>[0],
        "Opinion",
      ),
    ).toEqual({ title: "Opinion", href: "/opinion" });
    expect(
      searchResultSectionKicker(
        { _type: "analysis" } as Parameters<
          typeof searchResultSectionKicker
        >[0],
        "Analysis",
      ),
    ).toEqual({ title: "Analysis", href: "/analysis" });
  });
});

describe("getArticleFamilyCardThumbLayout", () => {
  it("returns rail dimensions for rail layout", () => {
    const layout = getArticleFamilyCardThumbLayout("rail", false);
    expect(layout.imgMaxW).toBe(180);
    expect(layout.thumbImageWidth).toBe(96);
    expect(layout.linkGap).toBe("gap-3");
  });

  it("enlarges mobile thumb for search variant", () => {
    const layout = getArticleFamilyCardThumbLayout("compact", true);
    expect(layout.thumbWrap).toContain("h-[92px]");
    expect(layout.thumbSizes).toContain("115px");
  });
});
