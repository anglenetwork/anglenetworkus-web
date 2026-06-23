/**
 * Append published posts per category without deleting existing content.
 *
 * Usage:
 *   node scripts/seed-articles-append.mjs
 *   node scripts/seed-articles-append.mjs --per-category=20
 *   node scripts/seed-articles-append.mjs --dry-run
 *
 * Each category uses its first canonical tag (e.g. us -> trump, world -> china).
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const SEED_AUTHOR_ID = "author.angle-staff";
const DEFAULT_PER_CATEGORY = 20;

/** First canonical tag slug per category (aligned with news-ingestion canonical taxonomy). */
const CATEGORY_FIRST_TAG = {
  us: { slug: "trump", title: "Trump" },
  world: { slug: "china", title: "China" },
  politics: { slug: "immigration", title: "Immigration" },
  business: { slug: "markets", title: "Markets" },
  science: { slug: "space", title: "Space" },
  entertainment: { slug: "movies", title: "Movies" },
  tech: { slug: "artificial-intelligence", title: "Artificial Intelligence" },
  lifestyle: { slug: "food", title: "Food" },
};

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
];

const TOPICS = [
  "policy shifts and market signals",
  "regional coordination and supply chains",
  "public agencies updating guidance",
  "consumer demand and pricing trends",
  "infrastructure planning timelines",
  "cross-border trade enforcement",
  "technology adoption in regulated sectors",
  "workforce transitions and hiring data",
];

function requireEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    missing.push("NEXT_PUBLIC_SANITY_DATASET");
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    missing.push("SANITY_API_WRITE_TOKEN");
  }
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

function parsePositiveIntArg(flagName, fallback) {
  const raw = process.argv.find((arg) => arg.startsWith(`${flagName}=`));
  if (!raw) return fallback;
  const value = Number.parseInt(raw.split("=").slice(1).join("="), 10);
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`Invalid ${flagName} value: "${raw}"`);
  }
  return value;
}

function hasFlag(flagName) {
  return process.argv.includes(flagName);
}

function getCategoryFirstTag(categorySlug) {
  const tag = CATEGORY_FIRST_TAG[categorySlug];
  if (!tag) {
    throw new Error(
      `No first canonical tag configured for category: ${categorySlug}`,
    );
  }
  return tag;
}

function buildTagDocumentId(categorySlug, tagSlug) {
  return `tag.${categorySlug}.${tagSlug}`;
}

function buildPostDocumentId(categorySlug, index) {
  return `post.append.${categorySlug}.${String(index).padStart(3, "0")}`;
}

function buildPortableTextBody(paragraphs, keyPrefix) {
  return paragraphs.map((text, i) => ({
    _key: `${keyPrefix}-b${i}`,
    _type: "block",
    style: "normal",
    children: [
      {
        _key: `${keyPrefix}-s${i}`,
        _type: "span",
        marks: [],
        text,
      },
    ],
    markDefs: [],
  }));
}

function buildExternalCover(url, alt, caption) {
  return {
    _type: "coverMedia",
    source: "external",
    externalUrl: url,
    alt,
    caption,
    creditAuthor: "Unsplash contributors",
    creditSource: "Unsplash",
    licenseOrRights: "Unsplash License",
  };
}

function buildPostDoc({ category, tagId, index, globalIndex, tagTitle, now }) {
  const topic = TOPICS[(index - 1) % TOPICS.length];
  const title = `${category.name} layout seed ${index}: ${topic}`;
  const tickerTitle = `${category.name} seed ${index}`;
  const slug = `append-${category.slug}-${String(index).padStart(3, "0")}`;
  const excerpt = `Append-only seed copy for ${category.name} category layout testing. Focus: ${topic}.`;
  const hoursAgo = Math.min(2 + globalIndex * 2, 336);
  const publishedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  const updatedAt = new Date(publishedAt.getTime() + 15 * 60 * 1000);
  const imageUrl = IMAGE_URLS[globalIndex % IMAGE_URLS.length];
  const body = buildPortableTextBody(
    [
      `This append-only seed article supports category page layout testing for ${category.name}. The reporting angle centers on ${topic}.`,
      `Editors added this document without removing existing posts. Every article in this batch shares the "${tagTitle}" tag.`,
      `Publication timing is spread across the last two weeks so sorting, featured blocks, and latest lists can be exercised realistically.`,
    ],
    `append-${category.slug}-${index}`,
  );

  return {
    _id: buildPostDocumentId(category.slug, index),
    _type: "post",
    status: "published",
    title,
    tickerTitle,
    slug: { _type: "slug", current: slug },
    excerpt,
    category: { _type: "reference", _ref: category._id },
    tags: [
      {
        _key: `tag-${tagId}`,
        _type: "reference",
        _ref: tagId,
      },
    ],
    author: { _type: "reference", _ref: SEED_AUTHOR_ID },
    cover: buildExternalCover(
      imageUrl,
      `Lead photograph for ${category.name} layout seed ${index}`,
      tickerTitle,
    ),
    body,
    seo: {
      _type: "seo",
      title,
      description: excerpt.slice(0, 160),
    },
    publishedAt: publishedAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    readTime: 3 + (index % 6),
    priority: index % 11,
    mainHeadline: false,
    frontline: false,
    rightHeadline: false,
    justIn: false,
    breakingNews: false,
    developingStory: false,
    featured: false,
  };
}

async function resolveCategoryTagIds(client, categories, dryRun) {
  const tagIdsByCategory = new Map();

  for (const category of categories) {
    const { slug: tagSlug, title: tagTitle } = getCategoryFirstTag(
      category.slug,
    );
    const tagId = buildTagDocumentId(category.slug, tagSlug);
    tagIdsByCategory.set(category.slug, tagId);

    if (dryRun) {
      console.log(`  [dry-run] use tag ${tagId} (${tagTitle})`);
      continue;
    }

    const existing = await client.fetch(`*[_id == $id][0]._id`, { id: tagId });
    if (!existing) {
      throw new Error(
        `Missing canonical tag ${tagId}. Run news-ingestion taxonomy:reseed first.`,
      );
    }
    console.log(`  tag ready: ${tagId} (${tagTitle})`);
  }

  return tagIdsByCategory;
}

async function run() {
  requireEnv();

  const perCategory = parsePositiveIntArg(
    "--per-category",
    DEFAULT_PER_CATEGORY,
  );
  const dryRun = hasFlag("--dry-run");

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2025-01-01",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const categories = await client.fetch(
    `*[_type == "category"] | order(name asc) { _id, name, "slug": slug.current }`,
  );
  if (!categories?.length) {
    throw new Error("No categories found. Run seed:categories first.");
  }

  const existingAppendIds = new Set(
    await client.fetch(`*[_type == "post" && _id match "post.append.*"]._id`),
  );

  console.log("Append-only article seed");
  console.log(`  categories: ${categories.length}`);
  console.log(`  posts per category: ${perCategory}`);
  console.log(`  tags: first canonical tag per category`);
  console.log(`  mode: ${dryRun ? "dry-run" : "live write"}`);
  console.log(`  existing append posts: ${existingAppendIds.size}`);

  console.log("\nResolving canonical tags per category...");
  const tagIdsByCategory = await resolveCategoryTagIds(
    client,
    categories,
    dryRun,
  );

  const now = new Date();
  const toCreate = [];
  let globalIndex = 0;

  for (const category of categories) {
    for (let index = 1; index <= perCategory; index += 1) {
      const postId = buildPostDocumentId(category.slug, index);
      if (existingAppendIds.has(postId)) continue;

      toCreate.push(
        buildPostDoc({
          category,
          tagId: tagIdsByCategory.get(category.slug),
          index,
          globalIndex,
          tagTitle: getCategoryFirstTag(category.slug).title,
          now,
        }),
      );
      globalIndex += 1;
    }
  }

  console.log(`\nPosts to create: ${toCreate.length}`);
  if (toCreate.length === 0) {
    console.log("Nothing to do — append posts already exist.");
    return;
  }

  for (const category of categories) {
    const count = toCreate.filter((doc) =>
      doc._id.startsWith(`post.append.${category.slug}.`),
    ).length;
    console.log(`  ${category.slug}: ${count}`);
  }

  if (dryRun) {
    console.log("\nDry run complete. Re-run without --dry-run to write.");
    return;
  }

  console.log("\nCreating posts...");
  let created = 0;
  for (const doc of toCreate) {
    await client.createIfNotExists(doc);
    created += 1;
    if (created % 20 === 0 || created === toCreate.length) {
      console.log(`  created ${created}/${toCreate.length}`);
    }
  }

  const counts = await client.fetch(`
    *[_type == "post" && status == "published"]{
      "cat": category->slug.current
    }
  `);
  const byCategory = {};
  for (const row of counts) {
    byCategory[row.cat] = (byCategory[row.cat] ?? 0) + 1;
  }

  console.log("\nPublished posts by category:");
  for (const category of categories) {
    console.log(`  ${category.slug}: ${byCategory[category.slug] ?? 0}`);
  }
  console.log(`\nDone. Created ${created} append posts.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
