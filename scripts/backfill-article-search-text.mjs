// Backfill generated searchText for article-family editorial documents.
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { resolveSearchTextBackfill } from './lib/backfill-article-search-text-logic.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const ARTICLE_TYPES = ['post', 'opinion', 'analysis', 'sponsored'];
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

function requireEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push('NEXT_PUBLIC_SANITY_DATASET');
  if (!process.env.SANITY_API_WRITE_TOKEN) missing.push('SANITY_API_WRITE_TOKEN');
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const articleSearchTextQuery = `
*[
  _type in ["post", "opinion", "analysis", "sponsored"] &&
  !(_id in path("drafts.**"))
]{
  _id,
  _type,
  title,
  tickerTitle,
  excerpt,
  "coverEpigraph": cover.epigraph,
  body[]{
    _type,
    children[]{text},
    epigraph,
    alt
  },
  opinionFormat,
  disclosure,
  analysisFocus,
  methodologyNote,
  sourcesNote,
  sponsorAttribution{
    sponsorName,
    disclosure
  },
  "sponsorName": sponsorAttribution.sponsorName,
  "sponsorDisclosure": sponsorAttribution.disclosure,
  "categoryName": category->name,
  "categoryNavTitle": category->navTitle,
  "tags": tags[]->{
    title,
    name,
    aliases
  },
  "authorName": author->name,
  searchText
}
`;

async function main() {
  requireEnv();

  const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  const docs = await sanity.fetch(articleSearchTextQuery);
  const byType = Object.fromEntries(ARTICLE_TYPES.map((type) => [type, 0]));
  let patched = 0;
  let preserved = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of docs || []) {
    if (!doc?._id || !ARTICLE_TYPES.includes(doc._type)) {
      skipped += 1;
      continue;
    }

    byType[doc._type] += 1;
    const decision = resolveSearchTextBackfill(doc);

    if (decision.action === 'preserve') {
      preserved += 1;
      continue;
    }

    if (decision.action === 'skip') {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      patched += 1;
      continue;
    }

    try {
      await sanity
        .patch(doc._id)
        .set({ searchText: decision.nextSearchText })
        .commit({ autoGenerateArrayKeys: true });
      patched += 1;
    } catch (error) {
      errors += 1;
      console.error(`Failed to patch ${doc._type} ${doc._id}:`, error);
    }
  }

  console.log('--- backfill:article-search-text summary ---');
  console.log('Mode:', dryRun ? 'dry run' : 'write');
  console.log('Documents by type:', byType);
  console.log('Documents fetched:', Array.isArray(docs) ? docs.length : 0);
  console.log('Documents preserved (manual searchText):', preserved);
  console.log(dryRun ? 'Documents that would be patched (empty searchText):' : 'Documents patched (empty searchText):', patched);
  console.log('Documents skipped:', skipped);
  console.log('Patch errors:', errors);

  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
