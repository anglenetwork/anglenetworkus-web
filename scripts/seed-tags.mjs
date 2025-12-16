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
  { title: 'Economy', aliases: ['economic growth', 'GDP', 'recession', 'consumer spending'] },
  { title: 'Markets', aliases: ['stocks', 'Wall Street', 'equities', 'S&P 500'] },
  { title: 'Artificial Intelligence', aliases: ['AI', 'machine learning', 'generative AI'] },
  { title: 'Climate', aliases: ['climate change', 'global warming', 'emissions'] },
  { title: 'China', aliases: ['Beijing', 'Chinese', 'PRC', 'mainland China', "People's Republic of China"] },
  {
    title: 'Ukraine / Russia War',
    aliases: [
      'ukraine',
      'russia',
      'war',
      'invasion',
      'putin',
      'zelensky',
      'kremlin',
      'kyiv',
    ],
  },
];

async function deleteAllTags() {
  console.log('Deleting all existing tags...');
  
  // Fetch all tags
  const allTags = await client.fetch(
    `*[_type=="tag"]{_id}`
  );

  if (allTags.length === 0) {
    console.log('No existing tags to delete.');
    return;
  }

  console.log(`Found ${allTags.length} tags to delete.`);

  // Delete each tag
  let deletedCount = 0;
  for (const tag of allTags) {
    try {
      await client.delete(tag._id);
      deletedCount++;
      if (deletedCount % 10 === 0) {
        console.log(`Deleted ${deletedCount}/${allTags.length} tags...`);
      }
    } catch (error) {
      console.error(`Error deleting tag ${tag._id}:`, error.message);
    }
  }

  console.log(`Successfully deleted ${deletedCount} tags.`);
}

async function createTag({ title, aliases = [] }) {
  const slug = slugify(title);

  // Create new tag
  await client.create({
    _type: 'tag',
    title,
    slug: { _type: 'slug', current: slug },
    aliases: uniq(aliases),
    featured: false,
    hidden: false,
    deprecated: false,
  });

  console.log(`Created: ${title} (${slug})`);
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN in env');
  }

  try {
    // Step 1: Delete all existing tags
    await deleteAllTags();

    // Step 2: Create all tags fresh
    console.log('\nCreating new tags...');
    for (const t of TAGS) {
      await createTag(t);
    }

    console.log('\nDone seeding tags.');
  } catch (error) {
    console.error('Error seeding tags:', error);
    throw error;
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
