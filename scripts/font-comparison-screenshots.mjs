/**
 * Captures landing + post page screenshots for each candidate sans font.
 * Requires the dev server at http://localhost:3000 (npm run dev).
 *
 * Usage: node scripts/font-comparison-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SANS_PATH = join(ROOT, "app/lib/fonts/sans.ts");
const OUTPUT_DIR = join(ROOT, "font-comparison");
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
const POST_PATH =
  "/post/iran-targets-gulf-states-after-u-s-strikes-iranian-military-sites";

const FONTS = [
  {
    slug: "archivo",
    importName: "Archivo",
    weights: ["300", "400", "500", "600", "700"],
  },
  {
    slug: "libre-franklin",
    importName: "Libre_Franklin",
    weights: ["300", "400", "500", "600", "700"],
  },
  {
    slug: "instrument-sans",
    importName: "Instrument_Sans",
    weights: ["400", "500", "600", "700"],
  },
  {
    slug: "public-sans",
    importName: "Public_Sans",
    weights: ["300", "400", "500", "600", "700"],
  },
  {
    slug: "source-sans-3",
    importName: "Source_Sans_3",
    weights: ["300", "400", "500", "600", "700"],
  },
];

function buildSansFile({ importName, weights }) {
  const weightList = weights.map((w) => `"${w}"`).join(", ");
  return `import { ${importName} } from "next/font/google";

/** Primary UI sans (Tailwind \`font-sans\`). Preloaded — used on every route. */
export const sansFont = ${importName}({
  subsets: ["latin"],
  weight: [${weightList}],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
`;
}

async function waitForServerReady(page) {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const res = await page.goto(BASE_URL, {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });
      if (res?.ok()) return;
    } catch {
      // dev server may be recompiling after HMR
    }
    await page.waitForTimeout(2000);
  }
  throw new Error(`Dev server not ready at ${BASE_URL}`);
}

async function capturePage(page, url, filePath) {
  await page.goto(url, { waitUntil: "load", timeout: 120_000 });
  await page.waitForFunction(
    () => document.fonts?.status === "loaded",
    undefined,
    { timeout: 30_000 },
  );
  await page.waitForTimeout(1000);
  await page.screenshot({ path: filePath, fullPage: true });
}

async function main() {
  const originalSans = readFileSync(SANS_PATH, "utf8");
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  console.log(`Saving screenshots to ${OUTPUT_DIR}\n`);

  try {
    for (const font of FONTS) {
      console.log(`→ ${font.slug}`);
      writeFileSync(SANS_PATH, buildSansFile(font), "utf8");

      await waitForServerReady(page);

      const landingPath = join(OUTPUT_DIR, `${font.slug}-landing.png`);
      const postPath = join(OUTPUT_DIR, `${font.slug}-post.png`);

      await capturePage(page, BASE_URL, landingPath);
      console.log(`  landing: ${landingPath}`);

      await capturePage(page, `${BASE_URL}${POST_PATH}`, postPath);
      console.log(`  post:    ${postPath}`);
    }
  } finally {
    writeFileSync(SANS_PATH, originalSans, "utf8");
    console.log("\nRestored original sans.ts");
    await browser.close();
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
