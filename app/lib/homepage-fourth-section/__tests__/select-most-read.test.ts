import { describe, expect, it } from "vitest";
import { selectFourthSectionMostReadPosts } from "../most-read-selection";

describe("selectFourthSectionMostReadPosts", () => {
  const posts = Array.from({ length: 8 }, (_, index) => ({
    _id: `post-${index}`,
    title: `Post ${index}`,
    slug: `post-${index}`,
    readTime: 3,
    publishedAt: "2026-01-01",
    date: "2026-01-01",
    category: { title: "Tech", slug: "tech" },
  }));

  it("returns up to five valid posts", () => {
    expect(selectFourthSectionMostReadPosts(posts)).toHaveLength(5);
    expect(selectFourthSectionMostReadPosts(posts)[4]?.slug).toBe("post-4");
  });

  it("skips invalid posts and still fills five slots when possible", () => {
    const mixed = [
      ...posts.slice(0, 3),
      { ...posts[3], slug: null },
      ...posts.slice(4),
    ];

    expect(selectFourthSectionMostReadPosts(mixed)).toHaveLength(5);
    expect(
      selectFourthSectionMostReadPosts(mixed).map((post) => post.slug),
    ).toEqual(["post-0", "post-1", "post-2", "post-4", "post-5"]);
  });
});
