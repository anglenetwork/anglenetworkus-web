/**
 * Bulk-update article-family documents in Sanity:
 * - Sets publishedAt + updatedAt to "now" (ISO) and status to "published"
 * - Replaces cover, image gallery items, and body editorialImage blocks with external stock URLs (Unsplash + Pexels)
 * - Unsets seo.ogImage (asset) so sharing can rely on cover; keeps other seo fields
 *
 * Does not delete documents. Skips draft IDs (drafts.*).
 *
 * Usage:
 *   node scripts/reseed-articles-published-today.mjs           # apply
 *   node scripts/reseed-articles-published-today.mjs --dry-run
 *   node scripts/reseed-articles-published-today.mjs --dry-run --verbose   # log every _id
 *   node scripts/reseed-articles-published-today.mjs --keep-status   # only dates + media; leave status as-is
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { requireSanityWriteEnv } from "./lib/require-env.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env.local") });

const ARTICLE_TYPES = ["post", "analysis", "opinion", "sponsored"];

/** Same stable Unsplash set as seed-articles.mjs */
const UNSPLASH_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&q=80",
  "https://images.unsplash.com/photo-1562408590-e32931084e23?w=1600&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80",
  "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=1600&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80",
  "https://images.unsplash.com/photo-1562408590-e32931084e23?w=1600&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1600&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
  "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1600&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80",
];

/** Direct Pexels CDN URLs (editorial / newsroom style) */
const PEXELS_IMAGE_URLS = [
  "https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/261949/pexels-photo-261949.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3943022/pexels-photo-3943022.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/4669117/pexels-photo-4669117.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3945373/pexels-photo-3945373.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

const STOCK_URLS = [...UNSPLASH_IMAGE_URLS, ...PEXELS_IMAGE_URLS];

function createUrlPicker(startIndex = 0) {
  let i = startIndex;
  return () => {
    const url = STOCK_URLS[i % STOCK_URLS.length];
    i += 1;
    return url;
  };
}

function creditsForUrl(url) {
  const isPexels = url.includes("pexels.com");
  return {
    creditAuthor: "Stock contributors",
    creditSource: isPexels ? "Pexels" : "Unsplash",
    licenseOrRights: isPexels ? "Pexels License" : "Unsplash License",
  };
}

/** @param {Record<string, unknown> | null | undefined} prev */
function toExternalCover(prev, nextUrl) {
  const url = nextUrl();
  const { image: _img, ...rest } = prev || {};
  const alt =
    (typeof rest.alt === "string" && rest.alt.trim()) ||
    "Hero image for this article";
  const cred = creditsForUrl(url);
  return {
    _type: "coverMedia",
    source: "external",
    externalUrl: url,
    alt,
    ...(rest.caption ? { caption: rest.caption } : {}),
    ...(rest.creditAuthor ? { creditAuthor: rest.creditAuthor } : {}),
    ...cred,
  };
}

/** @param {Record<string, unknown>} prev */
function toExternalGalleryItem(prev, nextUrl) {
  const url = nextUrl();
  const { image: _img, ...rest } = prev;
  const alt =
    (typeof rest.alt === "string" && rest.alt.trim()) || "Gallery image";
  const cred = creditsForUrl(url);
  return {
    ...rest,
    _type: "galleryImageItem",
    source: "external",
    externalUrl: url,
    alt,
    ...cred,
  };
}

/** @param {Record<string, unknown>} block */
function toExternalEditorialImage(block, nextUrl) {
  const url = nextUrl();
  const { image: _img, ...rest } = block;
  const alt =
    (typeof rest.alt === "string" && rest.alt.trim()) ||
    "Inline article photograph";
  const cred = creditsForUrl(url);
  return {
    ...rest,
    _type: "editorialImage",
    source: "external",
    externalUrl: url,
    alt,
    ...cred,
  };
}

/** @param {unknown[]} body */
function mapBodyEditorialImages(body, nextUrl) {
  if (!Array.isArray(body)) return body;
  return body.map((block) => {
    if (
      block &&
      typeof block === "object" &&
      block._type === "editorialImage"
    ) {
      return toExternalEditorialImage(block, nextUrl);
    }
    return block;
  });
}

function requireEnv() {
  requireSanityWriteEnv();
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const keepStatus = process.argv.includes("--keep-status");
  const verbose = process.argv.includes("--verbose");

  requireEnv();

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const query = `*[_type in $types && !(_id in path("drafts.**"))]{
    _id,
    _type,
    status,
    publishedAt,
    cover,
    imageGallery,
    body,
    seo
  }`;

  const docs = await client.fetch(query, { types: ARTICLE_TYPES });
  console.log(
    `Found ${docs.length} published-dataset article documents (${ARTICLE_TYPES.join(", ")}).`,
  );
  console.log(
    `Mode: ${dryRun ? "DRY RUN (no writes)" : "APPLY"}. Status: ${keepStatus ? "unchanged" : "set to published"}.`,
  );

  const nowIso = new Date().toISOString();
  let globalUrlIndex = 0;

  /** @type {{ _id: string, setPayload: Record<string, unknown>, unsetFields: string[] }[]} */
  const operations = [];

  for (const doc of docs) {
    const nextUrl = createUrlPicker(globalUrlIndex);
    /** Count how many URLs we'll consume to advance global index */
    let urlSlots = 0;

    const hasOgImage =
      doc.seo &&
      typeof doc.seo === "object" &&
      doc.seo.ogImage &&
      typeof doc.seo.ogImage === "object" &&
      (doc.seo.ogImage.asset || doc.seo.ogImage._upload);

    const cover =
      doc.cover &&
      typeof doc.cover === "object" &&
      Object.keys(doc.cover).length > 0
        ? toExternalCover(doc.cover, nextUrl)
        : toExternalCover(null, nextUrl);
    urlSlots += 1;

    const imageGallery = Array.isArray(doc.imageGallery)
      ? doc.imageGallery.map((item) => {
          if (item && typeof item === "object") {
            urlSlots += 1;
            return toExternalGalleryItem(item, nextUrl);
          }
          return item;
        })
      : undefined;

    const editorialCount = Array.isArray(doc.body)
      ? doc.body.filter((b) => b && b._type === "editorialImage").length
      : 0;
    const body = Array.isArray(doc.body)
      ? mapBodyEditorialImages(doc.body, nextUrl)
      : undefined;
    urlSlots += editorialCount;

    globalUrlIndex += urlSlots;

    /** @type {Record<string, unknown>} */
    const setPayload = {
      publishedAt: nowIso,
      updatedAt: nowIso,
      cover,
    };

    if (imageGallery !== undefined) {
      setPayload.imageGallery = imageGallery;
    }
    if (body !== undefined) {
      setPayload.body = body;
    }

    if (!keepStatus) {
      setPayload.status = "published";
    }

    /** @type {string[]} */
    const unsetFields = [];
    if (hasOgImage) unsetFields.push("seo.ogImage");

    if (dryRun) {
      if (verbose) {
        console.log(
          `[dry-run] ${doc._id} (${doc._type}) cover+gallery+editorial slots=${urlSlots} unsetOg=${Boolean(hasOgImage)}`,
        );
      }
      continue;
    }

    operations.push({ _id: doc._id, setPayload, unsetFields });
  }

  if (dryRun) {
    const byType = {};
    for (const d of docs) {
      byType[d._type] = (byType[d._type] || 0) + 1;
    }
    console.log("By type:", byType);
    console.log(
      "Dry run complete. Re-run without --dry-run to commit. Use --verbose to log each document.",
    );
    return;
  }

  const BATCH = 40;
  for (let i = 0; i < operations.length; i += BATCH) {
    const slice = operations.slice(i, i + BATCH);
    const tx = client.transaction();
    for (const op of slice) {
      tx.patch(op._id, (p) => {
        const next = p.set(op.setPayload);
        return op.unsetFields.length ? next.unset(op.unsetFields) : next;
      });
    }
    try {
      await tx.commit();
      console.log(
        `Committed batch ${Math.floor(i / BATCH) + 1} (${slice.length} documents).`,
      );
    } catch (err) {
      console.error(
        `Batch ${Math.floor(i / BATCH) + 1} failed (${slice.length} docs). Retrying one-by-one…`,
        err.message,
      );
      for (const op of slice) {
        try {
          const p = client.patch(op._id).set(op.setPayload);
          await (op.unsetFields.length ? p.unset(op.unsetFields) : p).commit();
        } catch (e2) {
          console.error(`  SKIP ${op._id}: ${e2.message}`);
        }
      }
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
