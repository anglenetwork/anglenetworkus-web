-- Migration: Add first_name and last_name columns to profiles table
-- Run this in your Supabase SQL Editor

-- Add first_name and last_name columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Add comments for documentation
COMMENT ON COLUMN profiles.first_name IS 'User first name';
COMMENT ON COLUMN profiles.last_name IS 'User last name';

