/** Shared Wikimedia URL fixtures for unit and integration tests. */

export const kingCharlesJpgFull =
  "https://upload.wikimedia.org/wikipedia/commons/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

export const kingCharlesJpgThumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg/1280px-King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

export const kingCharlesJpgThumbExpected =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg/1280px-King_Charles_III_and_Queen_Camilla_arrive_at_Rideau_Hall%2C_2025.jpg";

export const hormuzSvgFull =
  "https://upload.wikimedia.org/wikipedia/commons/0/07/Strait_of_Hormuz-svg-en.svg";

export const hormuzSvgBrokenThumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg";

export const hormuzSvgCorrectThumb =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg.png";

export const hormuzSvgThumbExpected =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg.png";

/** Cases passed to getWikimediaThumbnail unit tests. */
export const wikimediaThumbnailCases = [
  {
    name: "JPG full URL",
    input: kingCharlesJpgFull,
    maxWidth: 1200,
    expected: kingCharlesJpgThumbExpected,
  },
  {
    name: "JPG existing thumb unchanged",
    input: kingCharlesJpgThumb,
    maxWidth: 800,
    expected: kingCharlesJpgThumb,
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
    name: "SVG correct thumb unchanged",
    input: hormuzSvgCorrectThumb,
    maxWidth: 800,
    expected: hormuzSvgCorrectThumb,
  },
] as const;

/** Inputs for live HEAD verification (output of getWikimediaThumbnail). */
export const wikimediaIntegrationCases = wikimediaThumbnailCases.map(
  ({ name, input, maxWidth }) => ({ name, input, maxWidth }),
);
