// scripts/reset-sanity-articles.mjs
// Safe development reset for article-family Sanity documents only.
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const ARTICLE_DOCUMENT_TYPES = ['post', 'opinion', 'analysis', 'sponsored'];
const UNSAFE_DATASET_NAMES = new Set(['production', 'prod', 'main']);
const DELETE_CHUNK_SIZE = 50;

function hasFlag(flagName) {
  return process.argv.includes(flagName);
}

function requireEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push('NEXT_PUBLIC_SANITY_DATASET');
  if (!process.env.SANITY_API_WRITE_TOKEN) missing.push('SANITY_API_WRITE_TOKEN');
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function assertSafeToDelete({ dataset, confirmed }) {
  if (!confirmed) return;

  const nodeEnvAllowsReset =
    process.env.NODE_ENV !== 'production' ||
    process.env.SANITY_ALLOW_DEV_CONTENT_RESET === 'true';
  if (!nodeEnvAllowsReset) {
    throw new Error(
      'Refusing to delete content while NODE_ENV=production. Set SANITY_ALLOW_DEV_CONTENT_RESET=true to override for development resets.',
    );
  }

  if (
    UNSAFE_DATASET_NAMES.has(String(dataset).toLowerCase()) &&
    process.env.SANITY_ALLOW_PRODUCTION_CONTENT_RESET !== 'true'
  ) {
    throw new Error(
      `Refusing to delete from dataset "${dataset}". Set SANITY_ALLOW_PRODUCTION_CONTENT_RESET=true only for an approved development reset.`,
    );
  }
}

function countByType(docs) {
  return ARTICLE_DOCUMENT_TYPES.reduce((acc, type) => {
    acc[type] = docs.filter((doc) => doc._type === type).length;
    return acc;
  }, {});
}

function printSummary({ projectId, dataset, docs, confirmed }) {
  const byType = countByType(docs);
  const draftCount = docs.filter((doc) => doc._id.startsWith('drafts.')).length;

  console.log('\nSanity article reset summary');
  console.log(`  projectId: ${projectId}`);
  console.log(`  dataset: ${dataset}`);
  console.log(`  mode: ${confirmed ? 'CONFIRMED DELETE' : 'DRY RUN'}`);
  console.log(`  article types: ${ARTICLE_DOCUMENT_TYPES.join(', ')}`);
  console.log(`  found: ${docs.length} article document(s) (${draftCount} draft document(s) included)`);
  for (const type of ARTICLE_DOCUMENT_TYPES) {
    console.log(`    ${type}: ${byType[type]}`);
  }
}

async function deleteInChunks(client, docs) {
  if (docs.length === 0) {
    console.log('\nNo article documents to delete.');
    return;
  }

  const totalChunks = Math.ceil(docs.length / DELETE_CHUNK_SIZE);
  let deleted = 0;

  for (let i = 0; i < docs.length; i += DELETE_CHUNK_SIZE) {
    const chunk = docs.slice(i, i + DELETE_CHUNK_SIZE);
    const tx = client.transaction();
    for (const doc of chunk) {
      tx.delete(doc._id);
    }
    console.log(`Deleting chunk ${Math.floor(i / DELETE_CHUNK_SIZE) + 1}/${totalChunks} (${chunk.length} docs)...`);
    await tx.commit();
    deleted += chunk.length;
  }

  console.log(`\nDeleted ${deleted} article document(s).`);
}

async function main() {
  requireEnv();

  const confirmed = hasFlag('--confirm');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  assertSafeToDelete({ dataset, confirmed });

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-28',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const docs = await client.fetch(
    `*[_type in $types]{
      _id,
      _type,
      title,
      "slug": slug.current
    } | order(_type asc, _id asc)`,
    { types: ARTICLE_DOCUMENT_TYPES },
  );

  printSummary({ projectId, dataset, docs, confirmed });

  if (!confirmed) {
    console.log('\nDry run only. Re-run with --confirm to delete these article documents.');
    return;
  }

  await deleteInChunks(client, docs);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
