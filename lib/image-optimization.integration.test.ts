import { describe, expect, it } from "vitest";
import { getWikimediaThumbnail } from "./image-optimization";
import { wikimediaIntegrationCases } from "./image-optimization.fixtures";

const runIntegration = process.env.WIKIMEDIA_INTEGRATION === "1";

/** One HEAD per resolved URL — broken/correct SVG cases share the same output. */
const uniqueIntegrationCases = [
  ...new Map(
    wikimediaIntegrationCases.map((fixture) => {
      const resolved = getWikimediaThumbnail(fixture.input, fixture.maxWidth);
      return [resolved, { ...fixture, resolved }] as const;
    }),
  ).values(),
];

async function headOk(url: string, retries = 3): Promise<number> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, { method: "HEAD" });
    if (response.status !== 429 || attempt === retries) {
      return response.status;
    }
    await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
  }
  return 429;
}

describe.runIf(runIntegration)(
  "Wikimedia thumbnail live HEAD verification",
  () => {
    it.each(uniqueIntegrationCases)("$name ($resolved)", async ({
      resolved,
    }) => {
      const status = await headOk(resolved);
      expect(status, `HEAD ${resolved}`).toBe(200);
    }, 25_000);
  },
);

describe.runIf(!runIntegration)(
  "Wikimedia thumbnail live HEAD verification",
  () => {
    it("skips unless WIKIMEDIA_INTEGRATION=1", () => {
      expect(process.env.WIKIMEDIA_INTEGRATION).not.toBe("1");
    });
  },
);
