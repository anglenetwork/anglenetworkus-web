/**
 * Replace known-dead Unsplash photo IDs in article-family external image URLs.
 * Does not delete documents or change slugs.
 *
 * Usage:
 *   node scripts/patch-broken-unsplash-urls.mjs --dry-run
 *   node scripts/patch-broken-unsplash-urls.mjs
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const ARTICLE_TYPES = ["post", "opinion", "analysis", "sponsored"];

/** Dead photo ID -> replacement (verified HTTP 200). */
const REPLACEMENTS = {
  "photo-1504639725590-34f098438815": "photo-1562408590-e32931084e23",
  "photo-1520607162513-77705c0f91d0": "photo-1677442136019-21780ecad995",
  "photo-1504385983642-3d703b875d7e": "photo-1620712943543-bcc4688e7485",
  "photo-1516327420634-6213cbbefc68": "photo-1518770660439-4636190af475",
  "photo-1487058792275-0ef4cf9428b0": "photo-1550751827-4bd374c3f58b",
  "photo-1639322537228-f710d84631a1": "photo-1563986768609-322da13575f3",
  "photo-1432888622747-4eb9a8f2c293": "photo-1562408590-e32931084e23",
  "photo-1607794549669-0fcbf6c5c983": "photo-1451187580459-43490279c0fa",
  "photo-1614064641938-3bbee529c9e0": "photo-1526374965328-7f61d4dc18c5",
  "photo-1558494949-6ad365c9e59e": "photo-1558494949-ef010cbdcc31",
  "photo-1555949963-f7eeffbad353": "photo-1555949963-aa79dcee981c",
  "photo-1518779578993-ec8949d37344": "photo-1519389950473-47ba0277781c",
  "photo-1550751827-1bc4b5a6c96c": "photo-1485827404703-89b55fcc595e",
  "photo-1551434678-b936736834fc": "photo-1551288049-bebda4e38f71",
  "photo-1531482615713-afdafd43342c": "photo-1460925895917-afdab827c52f",
  "photo-1516321497487-e288bd19713f": "photo-1504384308090-c894fdcc538d",
};

function replaceUrl(url) {
  if (typeof url !== "string" || !url.includes("images.unsplash.com"))
    return url;
  let next = url;
  for (const [dead, live] of Object.entries(REPLACEMENTS)) {
    if (next.includes(dead)) {
      next = next.replace(dead, live);
    }
  }
  return next;
}

function patchExternalMedia(obj) {
  if (!obj || typeof obj !== "object") return { changed: false, value: obj };
  let changed = false;
  const value = { ...obj };
  if (typeof value.externalUrl === "string") {
    const next = replaceUrl(value.externalUrl);
    if (next !== value.externalUrl) {
      value.externalUrl = next;
      changed = true;
    }
  }
  return { changed, value };
}

function patchBody(blocks) {
  if (!Array.isArray(blocks)) return { changed: false, value: blocks };
  let changed = false;
  const value = blocks.map((block) => {
    if (!block || typeof block !== "object") return block;
    if (block._type === "editorialImage") {
      const patched = patchExternalMedia(block);
      if (patched.changed) changed = true;
      return patched.value;
    }
    return block;
  });
  return { changed, value };
}

function patchGallery(items) {
  if (!Array.isArray(items)) return { changed: false, value: items };
  let changed = false;
  const value = items.map((item) => {
    const patched = patchExternalMedia(item);
    if (patched.changed) changed = true;
    return patched.value;
  });
  return { changed, value };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    throw new Error("Missing Sanity env (PROJECT_ID, DATASET, WRITE_TOKEN).");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28",
    token,
    useCdn: false,
  });

  const docs = await client.fetch(
    `*[_type in $types && !(_id in path("drafts.**"))]{
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
    const set = {};
    const coverPatch = patchExternalMedia(doc.cover);
    if (coverPatch.changed) set.cover = coverPatch.value;

    const galleryPatch = patchGallery(doc.imageGallery);
    if (galleryPatch.changed) set.imageGallery = galleryPatch.value;

    const bodyPatch = patchBody(doc.body);
    if (bodyPatch.changed) set.body = bodyPatch.value;

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
