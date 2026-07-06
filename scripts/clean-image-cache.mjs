#!/usr/bin/env node
/**
 * Remove 0-byte files from Next.js image cache directories.
 *
 * A single empty cache file poisons the disk-LRU singleton for the process
 * lifetime (next/image logs "calculateSize returned 0"). Common when dev is
 * killed mid-write or upstream returns an empty 200.
 *
 * @see https://github.com/vercel/next.js/issues/93757
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const NEXT_DIR = join(ROOT, ".next");

async function walkFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function findImageCacheRoots() {
  const roots = [];
  let topLevel;
  try {
    topLevel = await readdir(NEXT_DIR, { withFileTypes: true });
  } catch {
    return roots;
  }

  for (const entry of topLevel) {
    if (!entry.isDirectory()) continue;
    const cacheImages = join(NEXT_DIR, entry.name, "cache", "images");
    try {
      const st = await stat(cacheImages);
      if (st.isDirectory()) roots.push(cacheImages);
    } catch {
      // no cache dir for this build mode
    }
  }

  const legacy = join(NEXT_DIR, "cache", "images");
  try {
    const st = await stat(legacy);
    if (st.isDirectory()) roots.push(legacy);
  } catch {
    // no legacy cache dir
  }

  return [...new Set(roots)];
}

async function main() {
  const roots = await findImageCacheRoots();
  if (roots.length === 0) return;

  let removed = 0;
  for (const root of roots) {
    const files = await walkFiles(root);
    for (const file of files) {
      const fileStat = await stat(file);
      if (fileStat.size === 0) {
        await unlink(file);
        removed += 1;
        console.log(`[clean-image-cache] removed 0-byte file: ${file}`);
      }
    }
  }

  if (removed > 0) {
    console.log(`[clean-image-cache] removed ${removed} corrupt cache file(s)`);
  }
}

main().catch((error) => {
  console.error("[clean-image-cache] failed:", error);
  process.exit(1);
});
