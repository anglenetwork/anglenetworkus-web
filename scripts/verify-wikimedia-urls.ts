/**
 * HEAD-check Wikimedia cover URLs from Sanity through getWikimediaThumbnail.
 * Usage: npx tsx scripts/verify-wikimedia-urls.ts [--width=1200]
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getWikimediaThumbnail } from "../lib/image-optimization";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const widthArg = process.argv.find((a) => a.startsWith("--width="));
const maxWidth = widthArg ? Number(widthArg.split("=")[1]) : 1200;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

async function headStatus(url: string): Promise<number> {
  const response = await fetch(url, { method: "HEAD" });
  return response.status;
}

async function main() {
  const docs = await client.fetch<
    Array<{ title: string; slug: string; cover: { externalUrl: string } }>
  >(
    `*[_type in ["post","opinion","analysis","sponsored"] && defined(cover.externalUrl)]{
      title, "slug": slug.current, cover{ externalUrl }
    }`,
  );

  console.log(`Checking ${docs.length} cover(s) at maxWidth=${maxWidth}\n`);

  let failures = 0;
  for (const doc of docs) {
    const input = doc.cover.externalUrl;
    const resolved = getWikimediaThumbnail(input, maxWidth);
    let status: number;
    try {
      status = await headStatus(resolved);
    } catch (error) {
      console.log(`FAIL ERR | ${doc.slug}`);
      console.log(`  ${error instanceof Error ? error.message : error}`);
      failures++;
      continue;
    }
    const ok = status === 200;
    if (!ok) failures++;
    console.log(`${ok ? "OK" : "FAIL"} ${status} | ${doc.slug}`);
    console.log(`  in:  ${input}`);
    console.log(`  out: ${resolved}\n`);
  }

  if (failures > 0) {
    console.error(`${failures} cover(s) failed verification.`);
    process.exit(1);
  }

  console.log("All covers verified.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
