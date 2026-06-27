/** Shared Wikimedia URL fixtures for unit and integration tests. */

const kingCharlesJpgFull =
  "https://upload.wikimedia.org/wikipedia/commons/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

const kingCharlesJpgThumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg/1280px-King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

const kingCharlesJpgThumbExpected =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg/1280px-King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

const kingCharlesJpgThumb960Expected =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg/960px-King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

const hormuzSvgFull =
  "https://upload.wikimedia.org/wikipedia/commons/0/07/Strait_of_Hormuz-svg-en.svg";

const hormuzSvgBrokenThumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg";

const hormuzSvgCorrectThumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg.png";

const hormuzSvgThumbExpected =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg.png";

const anthropicSvgBroken2560Thumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png";

const anthropicSvgThumbExpected =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/1280px-Anthropic_logo.svg.png";

/** Cases passed to getWikimediaThumbnail unit tests. */
export const wikimediaThumbnailCases = [
  {
    name: "JPG full URL",
    input: kingCharlesJpgFull,
    maxWidth: 1200,
    expected: kingCharlesJpgThumbExpected,
  },
  {
    name: "JPG existing thumb rebuilt to raster floor",
    input: kingCharlesJpgThumb,
    maxWidth: 800,
    expected: kingCharlesJpgThumb960Expected,
  },
  {
    name: "SVG full URL",
    input: hormuzSvgFull,
    maxWidth: 1200,
    expected: hormuzSvgThumbExpected,
  },
  {
    name: "SVG broken thumb repaired",
    input: hormuzSvgBrokenThumb,
    maxWidth: 1200,
    expected: hormuzSvgThumbExpected,
  },
  {
    name: "SVG correct thumb normalized to svg floor",
    input: hormuzSvgCorrectThumb,
    maxWidth: 800,
    expected: hormuzSvgThumbExpected,
  },
  {
    name: "SVG full URL small maxWidth uses 1280 floor",
    input: hormuzSvgFull,
    maxWidth: 200,
    expected: hormuzSvgThumbExpected,
  },
  {
    name: "JPG full URL small maxWidth uses 960 floor",
    input: kingCharlesJpgFull,
    maxWidth: 200,
    expected: kingCharlesJpgThumb960Expected,
  },
  {
    name: "SVG stored 2560 thumb rebuilt to 1280",
    input: anthropicSvgBroken2560Thumb,
    maxWidth: 1200,
    expected: anthropicSvgThumbExpected,
  },
] as const;

/** Inputs for live HEAD verification (output of getWikimediaThumbnail). */
export const wikimediaIntegrationCases = wikimediaThumbnailCases.map(
  ({ name, input, maxWidth }) => ({ name, input, maxWidth }),
);

export {
  anthropicSvgBroken2560Thumb,
  anthropicSvgThumbExpected,
  hormuzSvgBrokenThumb,
  hormuzSvgThumbExpected,
};
