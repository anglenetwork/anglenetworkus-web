/**
 * Migrate legacy image attribution fields on article-family documents:
 *   epigraph          -> caption
 *   creditProvider    -> creditSource
 *   creditLicense     -> licenseOrRights
 * and unset creditSourceUrl, licenseUrl.
 *
 * Usage:
 *   node scripts/migrate-image-attribution-fields.mjs --dry-run
 *   node scripts/migrate-image-attribution-fields.mjs
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { migrateDocumentImageAttributionFields } from "./lib/migrate-image-attribution-fields.mjs";
import { requireSanityWriteEnv } from "./lib/require-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const ARTICLE_TYPES = ["post", "opinion", "analysis", "sponsored"];

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  requireSanityWriteEnv();

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const docs = await client.fetch(
    `*[_type in $types && (
      defined(cover.epigraph) ||
      defined(cover.creditProvider) ||
      defined(cover.creditLicense) ||
      defined(cover.creditSourceUrl) ||
      defined(cover.licenseUrl) ||
      count(imageGallery[defined(epigraph) || defined(creditProvider) || defined(creditLicense) || defined(creditSourceUrl) || defined(licenseUrl)]) > 0 ||
      count(body[_type == "editorialImage" && (
        defined(epigraph) ||
        defined(creditProvider) ||
        defined(creditLicense) ||
        defined(creditSourceUrl) ||
        defined(licenseUrl)
      )]) > 0
    )]{
      _id,
      _type,
      "slug": slug.current,
      cover,
      imageGallery,
      body
    }`,
    { types: ARTICLE_TYPES },
  );

  let patched = 0;
  for (const doc of docs) {
    const set = migrateDocumentImageAttributionFields(doc);
    if (Object.keys(set).length === 0) continue;

    patched += 1;
    console.log(
      `${dryRun ? "[dry-run] " : ""}migrate ${doc._type} ${doc.slug || doc._id}`,
    );

    if (!dryRun) {
      await client.patch(doc._id).set(set).commit();
    }
  }

  console.log(
    `\n${dryRun ? "Would migrate" : "Migrated"} ${patched} document(s).`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
