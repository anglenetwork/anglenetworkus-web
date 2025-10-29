// scripts/seed-tags.mjs
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✓ Found' : '✗ Missing');
console.log('NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET ? '✓ Found' : '✗ Missing');
console.log('SANITY_API_WRITE_TOKEN:', process.env.SANITY_API_WRITE_TOKEN ? '✓ Found' : '✗ Missing');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uniq(arr) {
  return Array.from(new Set((arr || []).map((s) => String(s).trim()).filter(Boolean)));
}

// --- Your tag definitions ---
const TAGS = [
  { title: 'Elections', aliases: ['election', 'vote', 'voting', 'polls', 'campaign'] },
  { title: 'White House', aliases: ['presidency', 'administration', 'Oval Office'] },
  { title: 'Congress', aliases: ['Capitol Hill', 'House', 'Senate', 'lawmakers'] },
  { title: 'Supreme Court', aliases: ['SCOTUS', 'high court', 'justices'] },
  { title: 'Economy', aliases: ['economic growth', 'GDP', 'recession', 'consumer spending'] },
  { title: 'Inflation', aliases: ['prices', 'cost of living', 'CPI'] },
  { title: 'Jobs & Labor', aliases: ['employment', 'unemployment', 'unions', 'strikes'] },
  { title: 'Markets', aliases: ['stocks', 'Wall Street', 'equities', 'S&P 500'] },
  { title: 'Small Business', aliases: ['SMB', 'entrepreneurs', 'startups'] },
  { title: 'Big Tech', aliases: ['FAANG', 'tech giants', 'platforms'] },
  { title: 'Artificial Intelligence', aliases: ['AI', 'machine learning', 'generative AI'] },
  { title: 'Social Media', aliases: ['platforms', 'X/Twitter', 'Facebook', 'Instagram', 'TikTok'] },
  { title: 'Cybersecurity', aliases: ['hacking', 'ransomware', 'data breach'] },
  { title: 'Climate', aliases: ['climate change', 'global warming', 'emissions'] },
  { title: 'Energy', aliases: ['oil', 'gas', 'renewables', 'grid', 'electricity'] },
  { title: 'Immigration', aliases: ['border', 'migrants', 'asylum'] },
  { title: 'Public Health', aliases: ['health policy', 'outbreaks', 'CDC', 'vaccines'] },
  { title: 'Education', aliases: ['schools', 'universities', 'curriculum', 'student loans'] },
  { title: 'Criminal Justice', aliases: ['police', 'crime', 'courts', 'prosecutors'] },
  { title: 'Foreign Policy', aliases: ['diplomacy', 'sanctions', 'geopolitics'] },
];

async function upsertTag({ title, aliases = [] }) {
  const slug = slugify(title);

  // Look up by slug to keep IDs stable across runs
  const existing = await client.fetch(
    `*[_type=="tag" && slug.current==$slug][0]{_id, title, aliases, featured, hidden, deprecated}`,
    { slug }
  );

  if (!existing?._id) {
    // Create new tag; satisfy your schema's fields with sensible defaults
    await client.create({
      _type: 'tag',
      title,
      slug: { _type: 'slug', current: slug },
      aliases: uniq(aliases),
      featured: false,
      hidden: false,
      deprecated: false,
      // optional fields you can add here if you want:
      // description: '',
      // emoji: '',
      // color: '#0ea5e9',
      // order: 0,
      // analyticsKey: '',
    });
    console.log(`Created: ${title}`);
    return;
  }

  // Merge aliases; do not flip featured/hidden/deprecated automatically
  const mergedAliases = uniq([...(existing.aliases || []), ...aliases]);

  await client
    .patch(existing._id)
    .set({
      title,
      aliases: mergedAliases,
      // keep featured/hidden/deprecated as-is unless you want to control them here
    })
    .commit();

  console.log(`Updated: ${title}`);
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN in env');
  }
  for (const t of TAGS) {
    await upsertTag(t);
  }
  console.log('Done seeding tags.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
