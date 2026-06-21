// DEPRECATED: Use news-ingestion Milestone 3 scripts instead.
//   npm run milestone3:dry-run   (preview)
//   npm run milestone3:reseed    (live; requires CONFIRM_SANITY_ARTICLE_RESEED=YES)
// See news-ingestion/docs/articles-seed.md
//
// scripts/seed-articles.mjs — legacy one-shot seed for article-family documents.
// Supports --per-category=N for category-scoped seeding targets.
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env.local") });

console.log("Environment variables check:");
console.log(
  "NEXT_PUBLIC_SANITY_PROJECT_ID:",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? "✓ Found" : "✗ Missing",
);
console.log(
  "NEXT_PUBLIC_SANITY_DATASET:",
  process.env.NEXT_PUBLIC_SANITY_DATASET ? "✓ Found" : "✗ Missing",
);
console.log(
  "SANITY_API_WRITE_TOKEN:",
  process.env.SANITY_API_WRITE_TOKEN ? "✓ Found" : "✗ Missing",
);

function requireEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET)
    missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!process.env.SANITY_API_WRITE_TOKEN)
    missing.push("SANITY_API_WRITE_TOKEN");
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

function assertSafeToDeleteArticleContent() {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const unsafeDatasetNames = new Set(["production", "prod", "main"]);
  const nodeEnvAllowsReset =
    process.env.NODE_ENV !== "production" ||
    process.env.SANITY_ALLOW_DEV_CONTENT_RESET === "true";

  if (!nodeEnvAllowsReset) {
    throw new Error(
      "Refusing to delete article content while NODE_ENV=production. Set SANITY_ALLOW_DEV_CONTENT_RESET=true to override for development resets.",
    );
  }

  if (
    unsafeDatasetNames.has(String(dataset).toLowerCase()) &&
    process.env.SANITY_ALLOW_PRODUCTION_CONTENT_RESET !== "true"
  ) {
    throw new Error(
      `Refusing to delete article content from dataset "${dataset}". Set SANITY_ALLOW_PRODUCTION_CONTENT_RESET=true only for an approved development reset.`,
    );
  }
}

/** Stable direct Unsplash image URLs — one per seeded document (60+), unique photo IDs. */
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

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(baseSlug, usedSlugs) {
  let slug = baseSlug;
  let counter = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  usedSlugs.add(slug);
  return slug;
}

function applyUniqueArticleSlugs(docs, existingSlugs = []) {
  const usedByType = new Map();

  for (const type of ["post", "opinion", "analysis", "sponsored"]) {
    usedByType.set(type, new Set());
  }

  for (const existing of existingSlugs) {
    if (existing?._type && existing?.slug && usedByType.has(existing._type)) {
      usedByType.get(existing._type).add(existing.slug);
    }
  }

  for (const doc of docs) {
    const usedSlugs = usedByType.get(doc._type);
    if (!usedSlugs) continue;

    const baseSlug = doc.slug?.current || slugify(doc.title);
    const dedupedSlug = uniqueSlug(baseSlug, usedSlugs);
    doc.slug = { _type: "slug", current: dedupedSlug };
  }
}

function assertUniqueArticleSlugs(docs) {
  const seen = new Map();
  const duplicates = [];

  for (const doc of docs) {
    const slug = doc.slug?.current;
    if (!slug) {
      throw new Error(
        `Generated [${doc._type}] "${doc.title}" without a slug.`,
      );
    }

    const key = `${doc._type}:${slug}`;
    if (seen.has(key)) {
      duplicates.push({ key, first: seen.get(key), second: doc.title });
      continue;
    }
    seen.set(key, doc.title);
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Generated duplicate article slugs:\n${duplicates
        .map((dup) => `  ${dup.key} (${dup.first} / ${dup.second})`)
        .join("\n")}`,
    );
  }
}

/**
 * @param {string[]} paragraphs
 * @param {string} keyPrefix
 */
function buildPortableTextBody(paragraphs, keyPrefix = "body") {
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

/**
 * @param {object} opts
 * @param {string} opts.url
 * @param {string} opts.alt
 * @param {string} [opts.caption]
 * @param {string} [opts.creditAuthor]
 * @param {string} [opts.creditSource]
 * @param {string} [opts.licenseOrRights]
 */
function buildExternalCover(opts) {
  const {
    url,
    alt,
    caption,
    creditAuthor = "Unsplash contributors",
    creditSource = "Unsplash",
    licenseOrRights = "Unsplash License",
  } = opts;
  return {
    _type: "coverMedia",
    source: "external",
    externalUrl: url,
    alt,
    ...(caption ? { caption } : {}),
    creditAuthor,
    creditSource,
    licenseOrRights,
  };
}

/**
 * @param {{ title: string, description: string }} opts
 */
function buildSeo(opts) {
  return {
    _type: "seo",
    title: opts.title,
    description: opts.description,
  };
}

function pickTags(tags, startIdx, count) {
  const n = Math.min(Math.max(2, count), tags.length);
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(tags[(startIdx + i) % tags.length]);
  }
  return out;
}

function tagRefs(tagDocs) {
  return tagDocs.map((t) => ({
    _type: "reference",
    _ref: t._id,
    _key: `tag-${t._id}`,
  }));
}

function parsePositiveIntArg(flagName, fallback) {
  const raw = process.argv.find((arg) => arg.startsWith(`${flagName}=`));
  if (!raw) return fallback;
  const value = Number.parseInt(raw.split("=").slice(1).join("="), 10);
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(
      `Invalid ${flagName} value. Expected a positive integer, received "${raw}".`,
    );
  }
  return value;
}

function hasFlag(flagName) {
  return process.argv.includes(flagName);
}

function cloneDefinitionWithSeedSuffix(def, cycleIndex, templateIndex) {
  return {
    ...def,
    ...(def.placement ? { placement: { ...def.placement } } : {}),
  };
}

function buildSeedDefinitions(baseDefinitions, targetCount) {
  const out = [];
  for (let i = 0; i < targetCount; i++) {
    const templateIndex = i % baseDefinitions.length;
    const cycleIndex = Math.floor(i / baseDefinitions.length);
    out.push(
      cloneDefinitionWithSeedSuffix(
        baseDefinitions[templateIndex],
        cycleIndex,
        templateIndex,
      ),
    );
  }
  return out;
}

function getImageUrlForIndex(index) {
  return UNSPLASH_IMAGE_URLS[index % UNSPLASH_IMAGE_URLS.length];
}

/** Unique past publishedAt values per document, staggered; updatedAt shortly after each. */
function buildPublicationSchedule(count) {
  const now = Date.now();
  const spanMs = 13 * 24 * 60 * 60 * 1000;
  const base = now - spanMs;
  const stepMs = Math.floor(spanMs / Math.max(count, 1));
  const schedule = [];
  for (let i = 0; i < count; i++) {
    const publishedAt = new Date(
      base + i * stepMs + i * 37 * 1000,
    ).toISOString();
    const updatedAt = new Date(
      new Date(publishedAt).getTime() + (3 + (i % 9)) * 60 * 1000,
    ).toISOString();
    schedule.push({ publishedAt, updatedAt });
  }
  return schedule;
}

async function fetchRequiredRefs(client) {
  const authors = await client.fetch(
    `*[_type == "author"] | order(name asc) { _id, name }`,
  );
  if (!authors || authors.length !== 2) {
    throw new Error(
      `Expected exactly 2 author documents, found ${authors?.length ?? 0}. Seed authors in Sanity first.`,
    );
  }

  const categories = await client.fetch(
    `*[_type == "category"] | order(name asc) { _id, name }`,
  );
  if (!categories || categories.length < 4) {
    throw new Error(
      `Expected at least 4 categories, found ${categories?.length ?? 0}. Run seed:categories first.`,
    );
  }

  const tags = await client.fetch(
    `*[_type == "tag"] | order(title asc) { _id, title }`,
  );
  if (!tags || tags.length < 6) {
    throw new Error(
      `Expected at least 6 tags, found ${tags?.length ?? 0}. Run seed:tags first.`,
    );
  }

  return { authors, categories, tags };
}

async function deleteExistingArticleFamilyDocs(client) {
  const docs = await client.fetch(
    `*[_type in ["post","opinion","analysis","sponsored"]]{ _id, _type }`,
  );
  const byType = { post: 0, opinion: 0, analysis: 0, sponsored: 0 };
  for (const d of docs) {
    if (byType[d._type] !== undefined) byType[d._type]++;
  }
  console.log("\nExisting article-family documents to delete:");
  console.log(
    `  post: ${byType.post}, opinion: ${byType.opinion}, analysis: ${byType.analysis}, sponsored: ${byType.sponsored} (total ${docs.length})`,
  );

  if (docs.length === 0) {
    console.log("No article-family documents to delete.");
    return byType;
  }

  assertSafeToDeleteArticleContent();

  let deleted = 0;
  for (const doc of docs) {
    try {
      await client.delete(doc._id);
      deleted++;
      if (deleted % 5 === 0 || deleted === docs.length) {
        console.log(`  Deleted ${deleted}/${docs.length}...`);
      }
    } catch (err) {
      console.error(`Failed to delete ${doc._id} (${doc._type}):`, err.message);
      throw err;
    }
  }
  console.log(`Deleted ${deleted} article-family document(s).`);
  return byType;
}

function bodyParagraphsForSeed(kind, index) {
  const topics = [
    "semiconductor capacity",
    "enterprise security posture",
    "AI governance and disclosure",
    "market reaction to earnings",
    "climate and infrastructure planning",
    "consumer hardware cycles",
    "software renewal economics",
    "import data and trade flows",
    "regulatory reporting obligations",
    "venture funding for chip design",
    "science mission logistics",
    "insurance pricing trends",
  ];
  const t = topics[index % topics.length];
  return [
    `Editors prepared this ${kind} to stress-test publishing workflows, metadata, and front-end modules. The reporting angle centers on ${t} and how organizations are responding in the near term.`,
    `Sources familiar with the matter cautioned that details can shift as agencies release follow-on guidance. Teams should treat timelines as directional rather than definitive until filings and official statements confirm specifics.`,
    `Analysts note that cross-border supply dynamics and vendor concentration remain the dominant variables. Any change in capital expenditure plans or export controls could quickly reshape the outlook described here.`,
    `We will update this story as companies issue statements and as regulators publish additional materials. For now, the focus is on what is publicly verifiable and how markets are pricing the uncertainty.`,
    `Readers navigating paywalled data or proprietary benchmarks should rely on primary documents where possible; this seed copy is representative, not exhaustive.`,
  ].slice(0, 4);
}

function buildPostDoc({
  title,
  tickerTitle,
  excerpt,
  placement,
  categoryRef,
  authorRef,
  tagDocs,
  imageUrl,
  alt,
  caption,
  schedule,
  postIndex,
  tagRotation,
}) {
  const slugCurrent = slugify(title);
  const body = buildPortableTextBody(
    bodyParagraphsForSeed("post", postIndex),
    `post-${postIndex}`,
  );

  const cover = buildExternalCover({
    url: imageUrl,
    alt,
    caption,
  });

  const seo = buildSeo({
    title: `${title} | Newsroom seed`,
    description: excerpt.slice(0, 160),
  });

  const tagPick = pickTags(tagDocs, tagRotation, 2 + (postIndex % 3));

  const doc = {
    _type: "post",
    category: categoryRef,
    tags: tagRefs(tagPick),
    mainHeadline: false,
    frontline: false,
    rightHeadline: false,
    justIn: false,
    breakingNews: false,
    developingStory: false,
    featured: false,
    title,
    tickerTitle,
    excerpt,
    slug: { _type: "slug", current: slugCurrent },
    cover,
    body,
    status: "published",
    publishedAt: schedule.publishedAt,
    updatedAt: schedule.updatedAt,
    priority: postIndex % 11,
    readTime: 3 + (postIndex % 8),
    author: authorRef,
    seo,
  };

  if (placement.group === "A") {
    doc.mainHeadline = true;
  } else if (placement.group === "B") {
    doc.frontline = true;
  } else if (placement.group === "C") {
    doc.rightHeadline = true;
  } else if (placement.group === "D") {
    doc.justIn = true;
    if (placement.variant === "breaking") doc.breakingNews = true;
    else if (placement.variant === "developing") doc.developingStory = true;
  } else if (placement.group === "E") {
    doc.featured = placement.featured;
  }

  return doc;
}

function buildOpinionDoc({
  title,
  tickerTitle,
  excerpt,
  disclosure,
  authorRef,
  imageUrl,
  alt,
  caption,
  schedule,
  index,
}) {
  const slugCurrent = slugify(title);
  const body = buildPortableTextBody(
    bodyParagraphsForSeed("opinion", index),
    `opinion-${index}`,
  );
  return {
    _type: "opinion",
    title,
    tickerTitle,
    excerpt,
    slug: { _type: "slug", current: slugCurrent },
    cover: buildExternalCover({
      url: imageUrl,
      alt,
      caption,
    }),
    body,
    status: "published",
    publishedAt: schedule.publishedAt,
    updatedAt: schedule.updatedAt,
    ...(disclosure ? { disclosure } : {}),
    author: authorRef,
    seo: buildSeo({
      title: `Opinion: ${title}`,
      description: excerpt.slice(0, 160),
    }),
  };
}

function buildAnalysisDoc({
  title,
  tickerTitle,
  excerpt,
  analysisFocus,
  methodologyNote,
  sourcesNote,
  categoryRef,
  authorRef,
  tagDocs,
  imageUrl,
  alt,
  caption,
  schedule,
  index,
  tagRotation,
}) {
  const slugCurrent = slugify(title);
  const body = buildPortableTextBody(
    bodyParagraphsForSeed("analysis", index),
    `analysis-${index}`,
  );
  const tagPick = pickTags(tagDocs, tagRotation, 3 + (index % 2));
  const doc = {
    _type: "analysis",
    category: categoryRef,
    tags: tagRefs(tagPick),
    title,
    tickerTitle,
    excerpt,
    slug: { _type: "slug", current: slugCurrent },
    cover: buildExternalCover({
      url: imageUrl,
      alt,
      caption,
    }),
    body,
    status: "published",
    publishedAt: schedule.publishedAt,
    updatedAt: schedule.updatedAt,
    analysisFocus,
    author: authorRef,
    seo: buildSeo({
      title: `Analysis: ${title}`,
      description: excerpt.slice(0, 160),
    }),
  };
  if (methodologyNote) doc.methodologyNote = methodologyNote;
  if (sourcesNote) doc.sourcesNote = sourcesNote;
  return doc;
}

function buildSponsoredDoc({
  title,
  tickerTitle,
  excerpt,
  sponsorAttribution,
  categoryRef,
  authorRef,
  tagDocs,
  imageUrl,
  alt,
  caption,
  schedule,
  index,
  tagRotation,
}) {
  const slugCurrent = slugify(title);
  const body = buildPortableTextBody(
    bodyParagraphsForSeed("sponsored", index),
    `sponsored-${index}`,
  );
  const tagPick = pickTags(tagDocs, tagRotation, 2 + (index % 3));
  return {
    _type: "sponsored",
    category: categoryRef,
    tags: tagRefs(tagPick),
    title,
    tickerTitle,
    excerpt,
    slug: { _type: "slug", current: slugCurrent },
    cover: buildExternalCover({
      url: imageUrl,
      alt,
      caption,
    }),
    body,
    status: "published",
    publishedAt: schedule.publishedAt,
    updatedAt: schedule.updatedAt,
    sponsorAttribution: {
      _type: "sponsorAttribution",
      sponsorName: sponsorAttribution.sponsorName,
      sponsorUrl: sponsorAttribution.sponsorUrl,
      disclosure: sponsorAttribution.disclosure,
    },
    author: authorRef,
    seo: buildSeo({
      title: `${title} (Partner content)`,
      description: excerpt.slice(0, 160),
    }),
  };
}

const POST_DEFINITIONS = [
  {
    group: "A",
    title:
      "TSMC outlines fab timeline as CHIPS Act awards ripple through supply chains",
    tickerTitle: "TSMC affirms U.S. expansion timeline",
    excerpt:
      "Contract manufacturers signal steady equipment orders while policymakers track onshoring milestones tied to federal incentives.",
    placement: { group: "A" },
  },
  {
    group: "A",
    title:
      "Cyber agencies flag VPN supply-chain exposure after vendor patch delays",
    tickerTitle: "Agencies warn on VPN patch delays",
    excerpt:
      "Security teams are prioritizing certificate rotations and identity checks while vendors finalize maintenance windows.",
    placement: { group: "A" },
  },
  {
    group: "B",
    title:
      "SEC staff previews AI disclosure expectations for quarterly filings",
    tickerTitle: "SEC hints at AI risk disclosures",
    excerpt:
      "Public companies are reviewing controls narratives as regulators look for clearer materiality framing around generative tools.",
    placement: { group: "B" },
  },
  {
    group: "B",
    title:
      "Cloud spend stays resilient as enterprises renew multiyear platform deals",
    tickerTitle: "Cloud renewals hold steady in Q view",
    excerpt:
      "IT budgets show fewer pullbacks than feared, with optimization projects offsetting incremental AI inference costs.",
    placement: { group: "B" },
  },
  {
    group: "B",
    title:
      "Science advisers urge updated coastal flood benchmarks before hurricane season",
    tickerTitle: "Panel pushes new coastal flood benchmarks",
    excerpt:
      "Local planners are weighing infrastructure grants against tighter building codes and insurance requirements.",
    placement: { group: "B" },
  },
  {
    group: "C",
    title:
      "Phone makers tighten default encryption after lobbying on lawful access",
    tickerTitle: "OEMs tighten default encryption defaults",
    excerpt:
      "Device vendors balance consumer privacy messaging with carrier and government compliance timelines.",
    placement: { group: "C" },
  },
  {
    group: "C",
    title: "Enterprise suites bundle AI copilots into renewal conversations",
    tickerTitle: "Enterprise AI bundles land in renewals",
    excerpt:
      "Procurement teams negotiate seat counts and data residency terms as assistants move from pilot to standard SKUs.",
    placement: { group: "C" },
  },
  {
    group: "C",
    title:
      "Reviewers document battery spread on new foldables ahead of holiday push",
    tickerTitle: "Foldable battery variance shows in tests",
    excerpt:
      "Early units show wider variance than slab phones, prompting retailers to tighten return policies for open-box devices.",
    placement: { group: "C" },
  },
  {
    group: "D",
    variant: "breaking",
    title:
      "White House sets briefing on infrastructure priorities after bridge assessment",
    tickerTitle: "Briefing set on infrastructure priorities",
    excerpt:
      "Agencies are aligning grant timelines with state applications as construction season accelerates.",
    placement: { group: "D", variant: "breaking" },
  },
  {
    group: "D",
    variant: "developing",
    title:
      "Senate panel pauses markup on tech antitrust measure amid amendment rush",
    tickerTitle: "Antitrust markup paused in Senate panel",
    excerpt:
      "Staff are revisiting definitions around self-preferencing and app store rules before a rescheduled session.",
    placement: { group: "D", variant: "developing" },
  },
  {
    group: "D",
    variant: "plain",
    title:
      "Commerce releases early semiconductor import figures for trade monitors",
    tickerTitle: "Commerce posts early chip import figures",
    excerpt:
      "Analysts are cross-checking volumes against fab utilization reports from major manufacturing hubs.",
    placement: { group: "D", variant: "plain" },
  },
  {
    group: "E",
    title:
      "Regulators clarify breach reporting clocks for critical infrastructure operators",
    tickerTitle: "New guidance on breach reporting clocks",
    excerpt:
      "Owners are updating runbooks to match harmonized federal expectations and insurer questionnaires.",
    placement: { group: "E", featured: true },
  },
  {
    group: "E",
    title:
      "AI chip startups hunt runway as valuations reset after a frenetic funding cycle",
    tickerTitle: "AI chip startups navigate valuation reset",
    excerpt:
      "Investors emphasize path to revenue and software attach rates over raw transistor counts.",
    placement: { group: "E", featured: true },
  },
  {
    group: "E",
    title:
      "Sample-return lab prioritizes contamination controls on early asteroid material",
    tickerTitle: "Lab prioritizes asteroid sample protocols",
    excerpt:
      "Researchers sequence handling steps before wider distribution to partner institutions worldwide.",
    placement: { group: "E", featured: false },
  },
  {
    group: "E",
    title:
      "Cyber insurers adjust premiums as ransomware claims shift toward midsize firms",
    tickerTitle: "Insurers shift ransomware pricing midmarket",
    excerpt:
      "Brokers say underwriting now weighs endpoint telemetry and backup drills more heavily than industry alone.",
    placement: { group: "E", featured: false },
  },
];

/** Second batch: 15 more posts (30 total), same A–E distribution as the first batch. */
const POST_DEFINITIONS_BATCH2 = [
  {
    group: "A",
    title:
      "Intel details packaging roadmap as rivals chase advanced interconnect yields",
    tickerTitle: "Intel sketches advanced packaging path",
    excerpt:
      "Engineering teams emphasize test throughput and defect budgets while fabs bring new lines online.",
    placement: { group: "A" },
  },
  {
    group: "A",
    title:
      "Ransomware crews probe exposed APIs after vendor discloses legacy auth bug",
    tickerTitle: "API exposure draws ransomware probes",
    excerpt:
      "Incident responders recommend scoped tokens and short-lived credentials for partner integrations.",
    placement: { group: "A" },
  },
  {
    group: "B",
    title:
      "Treasury guidance clarifies sanctions screening for crypto infrastructure vendors",
    tickerTitle: "Treasury clarifies crypto sanctions screens",
    excerpt:
      "Compliance leads are updating vendor questionnaires and transaction monitoring thresholds.",
    placement: { group: "B" },
  },
  {
    group: "B",
    title:
      "Retail traders rotate back into megacap tech as rates outlook stabilizes",
    tickerTitle: "Traders favor megacap tech again",
    excerpt:
      "Flows show preference for cash-rich balance sheets over speculative small caps this quarter.",
    placement: { group: "B" },
  },
  {
    group: "B",
    title:
      "NOAA revises storm surge projections for Gulf Coast population centers",
    tickerTitle: "NOAA updates Gulf surge projections",
    excerpt:
      "City planners weigh evacuation routes against new elevation benchmarks ahead of peak season.",
    placement: { group: "B" },
  },
  {
    group: "C",
    title:
      "Apple and Google face new default-browser scrutiny in overseas markets",
    tickerTitle: "Browser defaults draw overseas scrutiny",
    excerpt:
      "Regulators question whether choice screens meaningfully shift share away from preinstalled apps.",
    placement: { group: "C" },
  },
  {
    group: "C",
    title: "ServiceNow and peers race to embed agents into ITSM ticket triage",
    tickerTitle: "ITSM vendors embed triage agents",
    excerpt:
      "Buyers evaluate hallucination safeguards before letting models close tickets without humans.",
    placement: { group: "C" },
  },
  {
    group: "C",
    title:
      "Drone reviewers highlight wind limits after holiday delivery pilot expansions",
    tickerTitle: "Drone tests flag wind limits",
    excerpt:
      "Operators tighten geofencing when gusts exceed vendor thresholds during suburban trials.",
    placement: { group: "C" },
  },
  {
    group: "D",
    variant: "breaking",
    title:
      "Breaking: FAA issues narrow waiver for beyond-line-of-sight drone corridor test",
    tickerTitle: "Breaking: FAA OKs BVLOS drone corridor test",
    excerpt:
      "Operators must broadcast telemetry to regional hubs during the limited pilot window.",
    placement: { group: "D", variant: "breaking" },
  },
  {
    group: "D",
    variant: "developing",
    title:
      "Developing: Grid operator weighs conservation appeals amid heat dome forecasts",
    tickerTitle: "Developing: grid operator eyes conservation",
    excerpt:
      "Industrial users may face voluntary curtailment incentives before mandatory cuts trigger.",
    placement: { group: "D", variant: "developing" },
  },
  {
    group: "D",
    variant: "plain",
    title:
      "Labor Dept. posts weekly jobless claims inline with economist consensus",
    tickerTitle: "Weekly jobless claims near consensus",
    excerpt:
      "Seasonal adjustments mask some state-level quirks; revisions could arrive next Thursday.",
    placement: { group: "D", variant: "plain" },
  },
  {
    group: "E",
    title:
      "Water utilities accelerate sensor deployments after EPA cybersecurity directive",
    tickerTitle: "Water utilities add cyber sensors",
    excerpt:
      "Grant programs help smaller districts close monitoring gaps without full rip-and-replace budgets.",
    placement: { group: "E", featured: true },
  },
  {
    group: "E",
    title:
      "Open-source maintainers debate SBOM depth after npm ecosystem incident",
    tickerTitle: "Maintainers debate SBOM depth",
    excerpt:
      "Teams weigh automated attestations against contributor burnout on popular packages.",
    placement: { group: "E", featured: true },
  },
  {
    group: "E",
    title:
      "State AGs coordinate privacy inquiries into student data practices in edtech apps",
    tickerTitle: "AGs probe student data in edtech",
    excerpt:
      "Districts review consent flows as regulators seek clearer parental visibility into sharing.",
    placement: { group: "E", featured: false },
  },
  {
    group: "E",
    title:
      "Copper miners hedge output as smelter fees swing with Chinese demand signals",
    tickerTitle: "Copper miners hedge on smelter fees",
    excerpt:
      "Traders watch bonded warehouse inventories for clues on near-term industrial appetite.",
    placement: { group: "E", featured: false },
  },
];

const POST_DEFINITIONS_ALL = [...POST_DEFINITIONS, ...POST_DEFINITIONS_BATCH2];

const OPINION_DEFINITIONS = [
  {
    disclosure:
      "The author consults for a nonprofit focused on broadband access; no direct stake in vendors mentioned.",
    title:
      "Op-ed: Export controls need clearer guardrails for open-weight AI releases",
    tickerTitle: "Op-ed: clarity for open-weight AI rules",
    excerpt:
      "Policymakers should separate model weights from downstream misuse instead of punishing publication alone.",
  },
  {
    disclosure: null,
    title:
      "Second view: Antitrust remedies should preserve interoperability for small SaaS vendors",
    tickerTitle: "Op-ed: keep SaaS interoperability intact",
    excerpt:
      "Breakups grab headlines, but durable APIs and data portability do more for competition at the margin.",
  },
  {
    disclosure:
      "This editorial represents the views of the newsroom’s editorial board on public funding priorities.",
    title:
      "Editorial: Congress should fund cyber hygiene grants before mandating new rules",
    tickerTitle: "Editorial: fund cyber hygiene first",
    excerpt:
      "Unfunded mandates stall in under-resourced agencies; grants align incentives with measurable outcomes.",
  },
  {
    disclosure: null,
    title:
      "Column: The gadget cycle is cooling—good for buyers, stressful for retailers",
    tickerTitle: "Column: gadget cycle cools for buyers",
    excerpt:
      "Longer refresh intervals reward quality upgrades and trade-in programs over launch-week hype.",
  },
  {
    disclosure: null,
    title:
      "Commentary: Markets misread cloud growth if they ignore inference power costs",
    tickerTitle: "Commentary: count inference power costs",
    excerpt:
      "Efficiency gains in models do not automatically erase data-center constraints or grid bottlenecks.",
  },
];

const OPINION_DEFINITIONS_BATCH2 = [
  {
    disclosure:
      "The author previously advised a trade group on spectrum policy; no compensation from handset makers.",
    title: "Op-ed: Spectrum auctions should reward build-out, not speculation",
    tickerTitle: "Op-ed: tie spectrum to build-out",
    excerpt:
      "Reserve prices matter less than enforceable coverage milestones and neutral wholesale access.",
  },
  {
    disclosure: null,
    title:
      "Op-ed: Liability shields for security researchers need narrow, audited scope",
    tickerTitle: "Op-ed: narrow shields for researchers",
    excerpt:
      "Good-faith testing stops destructive abuse; carve-outs must still ban extortion and data theft.",
  },
  {
    disclosure:
      "The editorial board has no financial interest in the vendors or agencies discussed below.",
    title: "Editorial: Public R&D grants should favor reproducible benchmarks",
    tickerTitle: "Editorial: demand reproducible AI benchmarks",
    excerpt:
      "Taxpayers deserve apples-to-apples evaluations before agencies renew large vendor awards.",
  },
  {
    disclosure: null,
    title:
      "Column: The quiet comeback of on-prem inference for regulated workloads",
    tickerTitle: "Column: on-prem inference returns",
    excerpt:
      "Air-gapped clusters are expensive but predictable when auditors demand log retention on site.",
  },
  {
    disclosure: null,
    title:
      "Commentary: Earnings calls still underplay power-grid risk to AI scaling",
    tickerTitle: "Commentary: grid risk in AI calls",
    excerpt:
      "Investors should ask about interconnect queues, not just gigawatts announced on slides.",
  },
];

const OPINION_DEFINITIONS_ALL = [
  ...OPINION_DEFINITIONS,
  ...OPINION_DEFINITIONS_BATCH2,
];

const ANALYSIS_DEFINITIONS = [
  {
    analysisFocus:
      "Maps how CHIPS incentives alter capex timing for foundries and equipment vendors.",
    methodologyNote:
      "Scenario table uses public filings and announced fab milestones; excludes undisclosed private grants.",
    sourcesNote: null,
    title: "Analysis: How CHIPS awards reorder fab construction through 2027",
    tickerTitle: "Analysis: CHIPS and fab construction",
    excerpt:
      "We connect grant announcements to equipment backlog signals and regional labor constraints.",
  },
  {
    analysisFocus:
      "Explains why VPN compromises cascade faster when identity stores are shared.",
    methodologyNote:
      "Composite risk score weights CVE severity, patch age, and SSO integration breadth.",
    sourcesNote: null,
    title: "Analysis: Why VPN incidents now pivot through identity providers",
    tickerTitle: "Analysis: VPN risk and identity stores",
    excerpt:
      "Attackers follow the shortest path to tokens; perimeter appliances are rarely the final objective.",
  },
  {
    analysisFocus:
      "Frames disclosure gaps investors should watch in generative AI footnotes.",
    sourcesNote:
      "Based on staff speeches, comment letters, and a sample of recent 10-Q risk factor updates.",
    title: "Analysis: Reading between the lines on AI risk in SEC filings",
    tickerTitle: "Analysis: AI risk in SEC filings",
    excerpt:
      "Materiality language is uneven; comparability will improve once issuers adopt common metrics.",
  },
  {
    analysisFocus:
      "Compares cloud revenue durability signals across hyperscalers and regional hosts.",
    sourcesNote:
      "Uses reported segment revenue, backlog commentary, and third-party capacity trackers.",
    title: "Analysis: Separating cloud hype from recurring revenue quality",
    tickerTitle: "Analysis: cloud revenue quality",
    excerpt:
      "Renewal rates and committed spend matter more than quarterly GPU headline allocations.",
  },
  {
    analysisFocus:
      "Interprets early import data against fab utilization and inventory drawdowns.",
    sourcesNote:
      "Cross-checks trade tables with vendor shipment disclosures and foundry utilization calls.",
    title:
      "Analysis: What early chip import data suggests about inventory digestion",
    tickerTitle: "Analysis: chip imports vs inventory",
    excerpt:
      "Volatility is expected; the question is whether downstream orders stabilize before year end.",
  },
];

const ANALYSIS_DEFINITIONS_BATCH2 = [
  {
    analysisFocus:
      "Traces how memory pricing interacts with handset build plans and channel inventory.",
    methodologyNote:
      "Uses rolling 13-week sell-through where available; imputes gaps with industry shipment tables.",
    sourcesNote: null,
    title:
      "Analysis: Why DRAM spot prices are a noisy signal for smartphone demand",
    tickerTitle: "Analysis: DRAM spots vs phone demand",
    excerpt:
      "OEMs can delay purchases without canceling launches, blurring the link between spots and units.",
  },
  {
    analysisFocus:
      "Unpacks credential-stuffing success rates when MFA is optional on legacy portals.",
    methodologyNote:
      "Synthetic login experiments use public breach corpora; no live accounts were targeted.",
    sourcesNote: null,
    title:
      "Analysis: Where credential stuffing still wins without phishing users",
    tickerTitle: "Analysis: credential stuffing without phishing",
    excerpt:
      "Password reuse plus absent MFA on admin consoles remains the cheapest path for attackers.",
  },
  {
    analysisFocus:
      "Shows how latency arbitrage shows up in colocation and exchange matching debates.",
    sourcesNote:
      "Draws on exchange rule filings, academic measurement studies, and vendor marketing claims.",
    title:
      "Analysis: Parsing fairness claims in microwave vs fiber market data feeds",
    tickerTitle: "Analysis: microwave vs fiber feeds",
    excerpt:
      "Microseconds matter, but so does timestamp integrity when regulators compare access tiers.",
  },
  {
    analysisFocus:
      "Weighs backlog quality vs headline GPU unit shipments for AI infrastructure.",
    sourcesNote:
      "Uses segment footnotes, capex guides, and hyperscaler commentary from the last two quarters.",
    title: "Analysis: Backlog duration matters more than GPU shipment counts",
    tickerTitle: "Analysis: AI backlog vs GPU counts",
    excerpt:
      "Customers stretching payments and delaying racks can distort apparent demand strength.",
  },
  {
    analysisFocus:
      "Connects wildfire smoke models to indoor air sensor adoption in western states.",
    sourcesNote:
      "Combines EPA AirNow archives, state sensor grants, and retailer sell-through anecdotes.",
    title:
      "Analysis: Consumer air purifiers spike when smoke forecasts extend past 48 hours",
    tickerTitle: "Analysis: purifiers and smoke forecasts",
    excerpt:
      "Short windows trigger panic buys; longer horizons let big-box supply chains restock calmly.",
  },
];

const ANALYSIS_DEFINITIONS_ALL = [
  ...ANALYSIS_DEFINITIONS,
  ...ANALYSIS_DEFINITIONS_BATCH2,
];

const SPONSORED_DEFINITIONS = [
  {
    sponsorName: "Northwind Compute",
    sponsorUrl: "https://example.com/northwind-compute",
    disclosure:
      "Paid post from Northwind Compute. The newsroom had no involvement in sponsor messaging.",
    title:
      "Sponsored: Why enterprises batch AI inference jobs to tame power spikes",
    tickerTitle: "Partner: batching AI inference jobs",
    excerpt:
      "Northwind outlines scheduling strategies that align GPU bursts with off-peak tariffs and cooling capacity.",
  },
  {
    sponsorName: "Harborline Security",
    sponsorUrl: "https://example.com/harborline-security",
    disclosure:
      "Sponsored by Harborline Security. Content produced by the partner; editors reviewed for accuracy.",
    title: "Sponsored: Zero-trust checklists before your next VPN refresh",
    tickerTitle: "Partner: zero-trust before VPN refresh",
    excerpt:
      "Harborline shares a practical sequence for certificates, device posture, and IdP failover drills.",
  },
  {
    sponsorName: "Cedarstack Cloud",
    sponsorUrl: "https://example.com/cedarstack-cloud",
    disclosure:
      "Paid placement from Cedarstack Cloud. Product claims reflect partner materials; verify for your estate.",
    title:
      "Sponsored: FinOps lessons from teams consolidating observability spend",
    tickerTitle: "Partner: FinOps and observability spend",
    excerpt:
      "Cedarstack highlights customers who trimmed duplicate agents after aligning SLOs with business KPIs.",
  },
  {
    sponsorName: "Brightfield Devices",
    sponsorUrl: "https://example.com/brightfield-devices",
    disclosure:
      "Sponsored by Brightfield Devices. Includes partner perspectives on hardware refresh cycles.",
    title:
      "Sponsored: Refresh cycles lengthen—how partners support trade-in programs",
    tickerTitle: "Partner: longer refresh cycles",
    excerpt:
      "Brightfield explains logistics models that keep enterprise fleets current without launch-week churn.",
  },
  {
    sponsorName: "Meridian Data Co.",
    sponsorUrl: "https://example.com/meridian-data",
    disclosure:
      "Paid content from Meridian Data Co. The newsroom does not endorse any vendor solutions described.",
    title:
      "Sponsored: Building governance boards for cross-border data projects",
    tickerTitle: "Partner: governance for data projects",
    excerpt:
      "Meridian outlines steering committees, documentation habits, and audit cadences for global teams.",
  },
];

const SPONSORED_DEFINITIONS_BATCH2 = [
  {
    sponsorName: "Apex Continuity",
    sponsorUrl: "https://example.com/apex-continuity",
    disclosure:
      "Sponsored by Apex Continuity. Partner content; independent editorial review for factual accuracy only.",
    title:
      "Sponsored: Tabletop exercises that actually improve incident comms under pressure",
    tickerTitle: "Partner: incident comms drills",
    excerpt:
      "Apex shares scripts that stress-test escalation paths and legal hold notifications in real time.",
  },
  {
    sponsorName: "LatticeWorks Analytics",
    sponsorUrl: "https://example.com/latticeworks-analytics",
    disclosure:
      "Paid placement from LatticeWorks Analytics. Performance claims are illustrative; verify with your data.",
    title:
      "Sponsored: Why cohort dashboards beat vanity metrics for subscription retention",
    tickerTitle: "Partner: cohort dashboards vs vanity KPIs",
    excerpt:
      "LatticeWorks walks through leading indicators that predict churn before revenue cliffs appear.",
  },
  {
    sponsorName: "Harborline Media Labs",
    sponsorUrl: "https://example.com/harborline-media-labs",
    disclosure:
      "Sponsored by Harborline Media Labs. Content produced with partner input on product positioning.",
    title:
      "Sponsored: Creative testing frameworks for short-form video on news adjacencies",
    tickerTitle: "Partner: creative testing for short video",
    excerpt:
      "Harborline proposes holdout groups and brand-safety rubrics tuned for news-heavy feeds.",
  },
  {
    sponsorName: "Summit Forge IoT",
    sponsorUrl: "https://example.com/summit-forge-iot",
    disclosure:
      "Paid post from Summit Forge IoT. The newsroom did not participate in product messaging or pricing.",
    title:
      "Sponsored: Hardening OTA pipelines for firmware on industrial edge devices",
    tickerTitle: "Partner: OTA hardening at the edge",
    excerpt:
      "Summit Forge outlines signing chains, staged rollouts, and rollback telemetry for plant networks.",
  },
  {
    sponsorName: "Clearline Compliance",
    sponsorUrl: "https://example.com/clearline-compliance",
    disclosure:
      "Sponsored by Clearline Compliance. Partner perspectives on audit readiness; not legal advice.",
    title:
      "Sponsored: Mapping evidence lockers before your next SOC 2 renewal window",
    tickerTitle: "Partner: evidence for SOC 2 renewals",
    excerpt:
      "Clearline recommends artifact hygiene, ownership tags, and sampling cadences aligned to controls.",
  },
];

const SPONSORED_DEFINITIONS_ALL = [
  ...SPONSORED_DEFINITIONS,
  ...SPONSORED_DEFINITIONS_BATCH2,
];

async function run() {
  requireEnv();

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2025-01-01",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const { authors, categories, tags } = await fetchRequiredRefs(client);
  const perCategory = parsePositiveIntArg("--per-category", 10);
  const appendMode = hasFlag("--append");
  const postDefinitionsForRun = buildSeedDefinitions(
    POST_DEFINITIONS_ALL,
    categories.length * perCategory,
  );
  const analysisDefinitionsForRun = buildSeedDefinitions(
    ANALYSIS_DEFINITIONS_ALL,
    categories.length * perCategory,
  );
  const sponsoredDefinitionsForRun = buildSeedDefinitions(
    SPONSORED_DEFINITIONS_ALL,
    categories.length * perCategory,
  );
  const opinionDefinitionsForRun = OPINION_DEFINITIONS_ALL.map((def) => ({
    ...def,
  }));

  console.log("\nReference documents loaded:");
  console.log(
    `  authors: ${authors.length} (${authors.map((a) => a.name).join(", ")})`,
  );
  console.log(`  categories: ${categories.length}`);
  console.log(`  tags: ${tags.length}`);
  console.log(
    `  target per category (post/analysis/sponsored): ${perCategory}`,
  );
  console.log(
    `  mode: ${appendMode ? "append (keep existing)" : "replace (delete existing first)"}`,
  );

  if (appendMode) {
    console.log(
      "\nAppend mode enabled: skipping deletion of existing article-family documents.",
    );
  } else {
    await deleteExistingArticleFamilyDocs(client);
  }

  const totalDocs =
    postDefinitionsForRun.length +
    opinionDefinitionsForRun.length +
    analysisDefinitionsForRun.length +
    sponsoredDefinitionsForRun.length;

  if (UNSPLASH_IMAGE_URLS.length < totalDocs) {
    console.log(
      `  note: image pool has ${UNSPLASH_IMAGE_URLS.length} URLs for ${totalDocs} documents; URLs will be reused.`,
    );
  }

  const schedule = buildPublicationSchedule(totalDocs);

  let docIndex = 0;
  const toCreate = [];

  for (let i = 0; i < postDefinitionsForRun.length; i++) {
    const def = postDefinitionsForRun[i];
    const placement = { ...def.placement };
    const author = authors[i % 2];
    const cat = categories[Math.floor(i / perCategory) % categories.length];
    const categoryRef = { _type: "reference", _ref: cat._id };
    const authorRef = { _type: "reference", _ref: author._id };
    const imageUrl = getImageUrlForIndex(docIndex);
    const alt = `Lead photograph for: ${def.title.slice(0, 60)}`;
    const caption = def.tickerTitle;

    toCreate.push(
      buildPostDoc({
        title: def.title,
        tickerTitle: def.tickerTitle,
        excerpt: def.excerpt,
        placement,
        categoryRef,
        authorRef,
        tagDocs: tags,
        imageUrl,
        alt,
        caption,
        schedule: schedule[docIndex],
        postIndex: i,
        tagRotation: i * 2,
      }),
    );
    docIndex++;
  }

  for (let i = 0; i < opinionDefinitionsForRun.length; i++) {
    const def = opinionDefinitionsForRun[i];
    const author = authors[i % 2];
    const authorRef = { _type: "reference", _ref: author._id };
    const imageUrl = getImageUrlForIndex(docIndex);
    const alt = `Column art for opinion piece: ${def.title.slice(0, 50)}`;
    toCreate.push(
      buildOpinionDoc({
        title: def.title,
        tickerTitle: def.tickerTitle,
        excerpt: def.excerpt,
        disclosure: def.disclosure,
        authorRef,
        imageUrl,
        alt,
        caption: def.tickerTitle,
        schedule: schedule[docIndex],
        index: i,
      }),
    );
    docIndex++;
  }

  for (let i = 0; i < analysisDefinitionsForRun.length; i++) {
    const def = analysisDefinitionsForRun[i];
    const author = authors[i % 2];
    const authorRef = { _type: "reference", _ref: author._id };
    const cat = categories[Math.floor(i / perCategory) % categories.length];
    const categoryRef = { _type: "reference", _ref: cat._id };
    const imageUrl = getImageUrlForIndex(docIndex);
    const alt = `Chart-ready imagery for analysis: ${def.title.slice(0, 50)}`;
    toCreate.push(
      buildAnalysisDoc({
        title: def.title,
        tickerTitle: def.tickerTitle,
        excerpt: def.excerpt,
        analysisFocus: def.analysisFocus,
        methodologyNote: def.methodologyNote,
        sourcesNote: def.sourcesNote,
        categoryRef,
        authorRef,
        tagDocs: tags,
        imageUrl,
        alt,
        caption: def.tickerTitle,
        schedule: schedule[docIndex],
        index: i,
        tagRotation: i * 3 + 1,
      }),
    );
    docIndex++;
  }

  for (let i = 0; i < sponsoredDefinitionsForRun.length; i++) {
    const def = sponsoredDefinitionsForRun[i];
    const author = authors[i % 2];
    const authorRef = { _type: "reference", _ref: author._id };
    const cat = categories[Math.floor(i / perCategory) % categories.length];
    const categoryRef = { _type: "reference", _ref: cat._id };
    const imageUrl = getImageUrlForIndex(docIndex);
    const alt = `Partner visual for sponsored article: ${def.sponsorName}`;
    toCreate.push(
      buildSponsoredDoc({
        title: def.title,
        tickerTitle: def.tickerTitle,
        excerpt: def.excerpt,
        sponsorAttribution: {
          sponsorName: def.sponsorName,
          sponsorUrl: def.sponsorUrl,
          disclosure: def.disclosure,
        },
        categoryRef,
        authorRef,
        tagDocs: tags,
        imageUrl,
        alt,
        caption: def.tickerTitle,
        schedule: schedule[docIndex],
        index: i,
        tagRotation: i * 4 + 2,
      }),
    );
    docIndex++;
  }

  const existingSlugs = appendMode
    ? await client.fetch(
        `*[_type in ["post","opinion","analysis","sponsored"] && defined(slug.current)]{
          _type,
          "slug": slug.current
        }`,
      )
    : [];

  applyUniqueArticleSlugs(toCreate, existingSlugs);
  assertUniqueArticleSlugs(toCreate);

  console.log("\nCreating documents...");
  const createdByType = { post: 0, opinion: 0, analysis: 0, sponsored: 0 };

  for (const doc of toCreate) {
    try {
      await client.create(doc);
      createdByType[doc._type]++;
      console.log(`  Created [${doc._type}] ${doc.title}`);
    } catch (err) {
      console.error(
        `Failed to create [${doc._type}] ${doc.title}:`,
        err.message,
      );
      console.error(JSON.stringify(doc, null, 2).slice(0, 2000));
      process.exit(1);
    }
  }

  console.log("\n=== Seed summary ===");
  console.log(`  post: ${createdByType.post}`);
  console.log(`  opinion: ${createdByType.opinion}`);
  console.log(`  analysis: ${createdByType.analysis}`);
  console.log(`  sponsored: ${createdByType.sponsored}`);
  console.log(
    `  total: ${Object.values(createdByType).reduce((a, b) => a + b, 0)}`,
  );
  console.log("\nDone seeding articles.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
