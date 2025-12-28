-- Migration: Add article_title column to bookmarks table
-- Run this in your Supabase SQL Editor after creating the initial bookmarks table

-- Add article_title column to bookmarks table
ALTER TABLE bookmarks
ADD COLUMN IF NOT EXISTS article_title text;

-- Add comment for documentation
COMMENT ON COLUMN bookmarks.article_title IS 'Stores the article title from Sanity for display purposes';

