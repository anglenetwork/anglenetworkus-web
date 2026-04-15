// scripts/seed-categories.mjs
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

// --- Category definitions ---
const CATEGORIES = [
  { name: 'US', slug: 'us' },
  { name: 'World', slug: 'world' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Business', slug: 'business' },
  { name: 'Science', slug: 'science' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Tech', slug: 'tech' },
  { name: 'Lifestyle', slug: 'lifestyle' },
];

async function deleteAllPosts() {
  console.log('Deleting all existing posts...');
  
  // Fetch all posts
  const allPosts = await client.fetch(
    `*[_type=="post"]{_id}`
  );

  if (allPosts.length === 0) {
    console.log('No existing posts to delete.');
    return;
  }

  console.log(`Found ${allPosts.length} posts to delete.`);

  // Delete each post
  let deletedCount = 0;
  for (const post of allPosts) {
    try {
      await client.delete(post._id);
      deletedCount++;
      if (deletedCount % 10 === 0) {
        console.log(`Deleted ${deletedCount}/${allPosts.length} posts...`);
      }
    } catch (error) {
      console.error(`Error deleting post ${post._id}:`, error.message);
    }
  }

  console.log(`Successfully deleted ${deletedCount} posts.`);
}

async function deleteAllCategories() {
  console.log('\nDeleting all existing categories...');
  
  // Fetch all categories
  const allCategories = await client.fetch(
    `*[_type=="category"]{_id}`
  );

  if (allCategories.length === 0) {
    console.log('No existing categories to delete.');
    return;
  }

  console.log(`Found ${allCategories.length} categories to delete.`);

  // Delete each category
  let deletedCount = 0;
  for (const category of allCategories) {
    try {
      await client.delete(category._id);
      deletedCount++;
      console.log(`Deleted category: ${category._id}`);
    } catch (error) {
      console.error(`Error deleting category ${category._id}:`, error.message);
    }
  }

  console.log(`Successfully deleted ${deletedCount} categories.`);
}

async function createCategory({ name, slug }, orderIndex) {
  const categorySlug = slugify(slug);

  // Create new category (we deleted all, so no need to check)
  await client.create({
    _type: 'category',
    name,
    slug: { _type: 'slug', current: categorySlug },
    featured: false,
    hidden: false,
    order: orderIndex,
    views: 0,
  });

  console.log(`Created: ${name} (${categorySlug})`);
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN in env');
  }

  try {
    // Step 1: Delete all existing posts (to remove references to categories)
    await deleteAllPosts();

    // Step 2: Delete all existing categories
    await deleteAllCategories();

    // Step 3: Create new categories
    console.log('\nCreating new categories...');
    for (let i = 0; i < CATEGORIES.length; i++) {
      await createCategory(CATEGORIES[i], i);
    }

    console.log('\nDone seeding categories.');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

