// scripts/report-duplicate-slugs.mjs
// Read-only report for duplicate article-family slugs.
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const ARTICLE_DOCUMENT_TYPES = ['post', 'opinion', 'analysis', 'sponsored'];

function requireEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push('NEXT_PUBLIC_SANITY_DATASET');
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function groupDuplicateSlugs(docs) {
  const groups = new Map();

  for (const doc of docs) {
    if (!doc.slug) continue;
    const key = `${doc._type}:${doc.slug}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(doc);
  }

  return [...groups.entries()]
    .filter(([, docsForSlug]) => docsForSlug.length > 1)
    .map(([key, docsForSlug]) => {
      const [type, ...slugParts] = key.split(':');
      return { type, slug: slugParts.join(':'), docs: docsForSlug };
    });
}

async function main() {
  requireEnv();

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-28',
    token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const docs = await client.fetch(
    `*[_type in $types]{
      _id,
      _type,
      title,
      "slug": slug.current
    } | order(_type asc, slug.current asc, _id asc)`,
    { types: ARTICLE_DOCUMENT_TYPES },
  );

  const missingSlugs = docs.filter((doc) => !doc.slug);
  const duplicateGroups = groupDuplicateSlugs(docs);

  if (missingSlugs.length > 0) {
    console.log('Article documents missing slugs:');
    for (const doc of missingSlugs) {
      console.log(`- [${doc._type}] ${doc._id} ${doc.title || '(untitled)'}`);
    }
    console.log('');
  }

  if (duplicateGroups.length === 0) {
    console.log('No duplicate article slugs found.');
    return;
  }

  console.log('Duplicate article slugs found:\n');
  for (const group of duplicateGroups) {
    console.log(`_type: ${group.type}`);
    console.log(`slug: ${group.slug}`);
    console.log(`count: ${group.docs.length}`);
    for (const doc of group.docs) {
      console.log(`- id: ${doc._id} title: ${doc.title || '(untitled)'}`);
    }
    console.log('');
  }

  process.exit(1);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
