-- Migration: Add date_of_birth column to profiles table
-- Run this in your Supabase SQL Editor

-- Add date_of_birth column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Add comment for documentation
COMMENT ON COLUMN profiles.date_of_birth IS 'User date of birth (YYYY-MM-DD format)';

