import type { PortableTextBlock } from "@portabletext/types";

const MIN_PARAGRAPHS_FOR_BODY_INSET = 4;

type SplitBodyForInsetOptions = {
  minParagraphs?: number;
};

type BodyInsetSplit = {
  before: PortableTextBlock[];
  after: PortableTextBlock[];
  shouldInsert: boolean;
};

function isNormalParagraph(block: PortableTextBlock) {
  return block._type === "block" && (!block.style || block.style === "normal");
}

export function splitBodyForInset(
  blocks: PortableTextBlock[],
  options: SplitBodyForInsetOptions = {},
): BodyInsetSplit {
  const minParagraphs = options.minParagraphs ?? MIN_PARAGRAPHS_FOR_BODY_INSET;
  const paragraphCount = blocks.reduce(
    (count, block) => count + (isNormalParagraph(block) ? 1 : 0),
    0,
  );

  if (paragraphCount < minParagraphs) {
    return {
      before: blocks,
      after: [],
      shouldInsert: false,
    };
  }

  const targetParagraphCount = Math.floor(paragraphCount / 2);
  let seenParagraphs = 0;

  for (let index = 0; index < blocks.length; index += 1) {
    if (!isNormalParagraph(blocks[index])) continue;

    seenParagraphs += 1;

    if (seenParagraphs === targetParagraphCount) {
      return {
        before: blocks.slice(0, index + 1),
        after: blocks.slice(index + 1),
        shouldInsert: true,
      };
    }
  }

  return {
    before: blocks,
    after: [],
    shouldInsert: false,
  };
}
