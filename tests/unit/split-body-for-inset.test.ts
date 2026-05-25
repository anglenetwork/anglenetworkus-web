import { describe, expect, test } from "vitest";
import type { PortableTextBlock } from "@portabletext/types";
import { splitBodyForInset } from "@/app/components/PostPage/PostBody/split-body-for-inset";

function paragraph(key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    children: [{ _type: "span", _key: `${key}-span`, text: key }],
  };
}

function heading(key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "h2",
    children: [{ _type: "span", _key: `${key}-span`, text: key }],
  };
}

function objectBlock(key: string, type: string) {
  return {
    _type: type,
    _key: key,
  } as PortableTextBlock;
}

describe("splitBodyForInset", () => {
  test("splits 8 normal paragraphs after paragraph 4", () => {
    const blocks = Array.from({ length: 8 }, (_, index) =>
      paragraph(`p${index + 1}`),
    );

    const result = splitBodyForInset(blocks);

    expect(result.shouldInsert).toBe(true);
    expect(result.before.map((block) => block._key)).toEqual([
      "p1",
      "p2",
      "p3",
      "p4",
    ]);
    expect(result.after.map((block) => block._key)).toEqual([
      "p5",
      "p6",
      "p7",
      "p8",
    ]);
  });

  test("skips insertion when there are fewer than 4 normal paragraphs", () => {
    const blocks = Array.from({ length: 3 }, (_, index) =>
      paragraph(`p${index + 1}`),
    );

    const result = splitBodyForInset(blocks);

    expect(result.shouldInsert).toBe(false);
    expect(result.before).toEqual(blocks);
    expect(result.after).toEqual([]);
  });

  test("ignores non-normal blocks when counting paragraphs", () => {
    const blocks = [
      heading("heading"),
      paragraph("p1"),
      objectBlock("image", "image"),
      paragraph("p2"),
      objectBlock("divider", "articleDivider"),
      paragraph("p3"),
      paragraph("p4"),
      objectBlock("video", "videoEmbed"),
      paragraph("p5"),
      paragraph("p6"),
    ];

    const result = splitBodyForInset(blocks);

    expect(result.shouldInsert).toBe(true);
    expect(result.before.map((block) => block._key)).toEqual([
      "heading",
      "p1",
      "image",
      "p2",
      "divider",
      "p3",
    ]);
    expect(result.after.map((block) => block._key)).toEqual([
      "p4",
      "video",
      "p5",
      "p6",
    ]);
  });

  test("preserves all original blocks across both slices", () => {
    const blocks = [
      paragraph("p1"),
      objectBlock("image", "image"),
      paragraph("p2"),
      paragraph("p3"),
      heading("heading"),
      paragraph("p4"),
      paragraph("p5"),
      objectBlock("divider", "articleDivider"),
      paragraph("p6"),
    ];

    const result = splitBodyForInset(blocks);

    expect([...result.before, ...result.after]).toEqual(blocks);
  });
});
