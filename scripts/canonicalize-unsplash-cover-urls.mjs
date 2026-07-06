/**
 * Rewrite legacy unsplash.com cover/gallery URLs to canonical images.unsplash.com URLs.
 *
 * Usage:
 *   node scripts/canonicalize-unsplash-cover-urls.mjs --dry-run
 *   node scripts/canonicalize-unsplash-cover-urls.mjs
 *   node scripts/canonicalize-unsplash-cover-urls.mjs --limit 10
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  canonicalizeUnsplashCoverUrl,
  isUnsplashNonCdnUrl,
  mapWithConcurrency,
} from "./lib/resolve-unsplash-cdn-url.mjs";
import { requireSanityWriteEnv } from "./lib/require-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const ARTICLE_TYPES = ["post", "opinion", "analysis", "sponsored"];
const HEAD_CONCURRENCY = 5;

function parseLimitArg() {
  const index = process.argv.indexOf("--limit");
  if (index === -1) return null;
  const value = Number.parseInt(process.argv[index + 1] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function patchExternalMedia(item, resolvedUrls) {
  if (!item || typeof item !== "object") {
    return { changed: false, value: item };
  }

  const externalUrl = item.externalUrl?.trim();
  if (!externalUrl || !isUnsplashNonCdnUrl(externalUrl)) {
    return { changed: false, value: item };
  }

  const canonical = resolvedUrls.get(externalUrl);
  if (!canonical || canonical === externalUrl) {
    return { changed: false, value: item };
  }

  return {
    changed: true,
    value: {
      ...item,
      externalUrl: canonical,
      source: "external",
    },
  };
}

function patchGallery(items, resolvedUrls) {
  if (!Array.isArray(items)) return { changed: false, value: items };

  let changed = false;
  const value = items.map((item) => {
    const patched = patchExternalMedia(item, resolvedUrls);
    if (patched.changed) changed = true;
    return patched.value;
  });
  return { changed, value };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limit = parseLimitArg();
  requireSanityWriteEnv();

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const docs = await client.fetch(
    `*[_type in $types && !(_id in path("drafts.**")) && (
      (defined(cover.externalUrl) && cover.externalUrl match "*unsplash.com/*" && !(cover.externalUrl match "*images.unsplash.com/*")) ||
      count(imageGallery[defined(externalUrl) && externalUrl match "*unsplash.com/*" && !(externalUrl match "*images.unsplash.com/*")]) > 0
    )]{
      _id,
      _type,
      "slug": slug.current,
      cover,
      imageGallery
    }`,
    { types: ARTICLE_TYPES },
  );

  const scopedDocs = limit ? docs.slice(0, limit) : docs;
  const uniqueUrls = new Set();

  for (const doc of scopedDocs) {
    const coverUrl = doc.cover?.externalUrl?.trim();
    if (coverUrl && isUnsplashNonCdnUrl(coverUrl)) {
      uniqueUrls.add(coverUrl);
    }

    if (Array.isArray(doc.imageGallery)) {
      for (const item of doc.imageGallery) {
        const galleryUrl = item?.externalUrl?.trim();
        if (galleryUrl && isUnsplashNonCdnUrl(galleryUrl)) {
          uniqueUrls.add(galleryUrl);
        }
      }
    }
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Found ${scopedDocs.length} document(s) with ${uniqueUrls.size} unique legacy Unsplash URL(s).`,
  );

  const resolvedUrls = new Map();
  const urlList = [...uniqueUrls];

  await mapWithConcurrency(urlList, HEAD_CONCURRENCY, async (href) => {
    try {
      const canonical = await canonicalizeUnsplashCoverUrl(href);
      resolvedUrls.set(href, canonical);
      console.log(`  resolved ${href}\n    -> ${canonical}`);
    } catch (error) {
      console.warn(`  skip ${href}: ${error.message || error}`);
    }
  });

  let patched = 0;
  for (const doc of scopedDocs) {
    const set = {};
    const coverPatch = patchExternalMedia(doc.cover, resolvedUrls);
    if (coverPatch.changed) set.cover = coverPatch.value;

    const galleryPatch = patchGallery(doc.imageGallery, resolvedUrls);
    if (galleryPatch.changed) set.imageGallery = galleryPatch.value;

    if (Object.keys(set).length === 0) continue;
    patched += 1;
    console.log(
      `${dryRun ? "[dry-run] " : ""}patch ${doc._type} ${doc.slug || doc._id}`,
    );

    if (!dryRun) {
      await client.patch(doc._id).set(set).commit();
    }
  }

  console.log(
    `\n${dryRun ? "Would patch" : "Patched"} ${patched} document(s).`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
