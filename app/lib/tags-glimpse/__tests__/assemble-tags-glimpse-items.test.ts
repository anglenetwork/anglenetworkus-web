import { describe, expect, it } from "vitest";
import { assembleTagsGlimpseItems } from "../assemble-tags-glimpse-items";

describe("assembleTagsGlimpseItems", () => {
  const tags = [
    { slug: "tag-a", title: "Tag A" },
    { slug: "tag-b", title: "Tag B" },
    { slug: "tag-c", title: "Tag C" },
    { slug: "tag-d", title: "Tag D" },
    { slug: "tag-e", title: "Tag E" },
  ];

  it("fills four slots when a tag has no article by trying later tags", async () => {
    const items = await assembleTagsGlimpseItems(tags, async (tagSlug) => {
      if (tagSlug === "tag-c") return null;
      if (tagSlug === "tag-e") {
        return {
          _id: "article-e",
          _type: "post" as const,
          slug: "story-e",
          title: "Story E",
          readTime: 3,
        };
      }
      const index = tags.findIndex((tag) => tag.slug === tagSlug);
      return {
        _id: `article-${index}`,
        _type: "post" as const,
        slug: `story-${index}`,
        title: `Story ${index}`,
        readTime: 2,
      };
    });

    expect(items).toHaveLength(4);
    expect(items.map((item) => item.tagSlug)).toEqual([
      "tag-a",
      "tag-b",
      "tag-d",
      "tag-e",
    ]);
  });

  it("skips duplicate latest articles when no alternate exists for that tag", async () => {
    const articlesByTag: Record<
      string,
      Array<{
        _id: string;
        _type: "post";
        slug: string;
        title: string;
        readTime: number;
      }>
    > = {
      "tag-a": [
        {
          _id: "shared",
          _type: "post",
          slug: "shared-story",
          title: "Shared",
          readTime: 2,
        },
      ],
      "tag-b": [
        {
          _id: "shared",
          _type: "post",
          slug: "shared-story",
          title: "Shared",
          readTime: 2,
        },
      ],
      "tag-c": [
        {
          _id: "article-c",
          _type: "post",
          slug: "story-c",
          title: "Story C",
          readTime: 2,
        },
      ],
      "tag-d": [
        {
          _id: "article-d",
          _type: "post",
          slug: "story-d",
          title: "Story D",
          readTime: 2,
        },
      ],
    };

    const items = await assembleTagsGlimpseItems(
      tags.slice(0, 4),
      async (tagSlug, excludeIds) =>
        articlesByTag[tagSlug]?.find(
          (article) => !excludeIds.includes(article._id),
        ) ?? null,
    );

    expect(items).toHaveLength(3);
    expect(items.map((item) => item.tagSlug)).toEqual([
      "tag-a",
      "tag-c",
      "tag-d",
    ]);
  });
});
