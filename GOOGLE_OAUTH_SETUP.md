# Google OAuth Setup Guide

This guide walks through configuring Google OAuth authentication in Supabase.

## Prerequisites

- A Supabase project
- A Google Cloud Console project with OAuth 2.0 credentials

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in testing mode
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Your app name
   - **Authorized redirect URIs**: Add the following:
     - `https://[your-project-ref].supabase.co/auth/v1/callback`
     - For local development: `http://localhost:3000/auth/callback`
     - For production: `https://yourdomain.com/auth/callback`
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and click to enable it
4. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste the Client ID from Google Cloud Console
   - **Client Secret (for OAuth)**: Paste the Client Secret from Google Cloud Console
5. Click **Save**

## Step 3: Configure Redirect URLs

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Set **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
   - `https://[your-project-ref].supabase.co/auth/v1/callback`

## Step 4: Run Database Migration

Run the migration file to add `email` and `avatar_url` columns to the profiles table:

```sql
-- Run in Supabase SQL Editor
-- File: supabase-migrations/add-email-avatar-to-profiles.sql
```

## Step 5: Verify Setup

1. Start your Next.js dev server: `npm run dev`
2. Navigate to `/signin`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorizing, you should be redirected back to `/myprofile`
6. Your profile should display your Google name, email, and avatar

**Note:** When logging in via Google OAuth for the first time:

- Your **first name** and **last name** will be automatically extracted from Google and stored in the database
- Your **email** will be stored from your Google account
- Your **avatar** (profile picture) will be stored from Google
- **Date of birth** is NOT provided by Google OAuth (it's not part of standard OAuth scopes), so this field will remain empty unless manually entered

## Troubleshooting

### "Redirect URI mismatch" error

- Verify the redirect URI in Google Cloud Console matches exactly: `https://[your-project-ref].supabase.co/auth/v1/callback`
- Check that the redirect URL is added in Supabase dashboard

### Profile not hydrating

- Check browser console for errors
- Verify the migration was run successfully
- Check Supabase logs for profile upsert errors

### OAuth button not appearing

- Verify Google provider is enabled in Supabase dashboard
- Check that credentials are saved correctly
- Restart your dev server

## Running Playwright Tests

To run end-to-end tests for the authentication flow:

1. Install Playwright (if not already installed):

   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. Run the tests:

   ```bash
   npx playwright test tests/auth.spec.ts
   ```

3. View test results:
   ```bash
   npx playwright show-report
   ```

**Note:** Some tests require authentication. For CI/CD, you may need to:

- Use test credentials via environment variables (`PLAYWRIGHT_TEST_EMAIL`, `PLAYWRIGHT_TEST_PASSWORD`)
- Mock the OAuth redirect flow
- Use Supabase test users with password authentication

## Environment Variables

No additional environment variables are needed for OAuth. The OAuth credentials are stored securely in the Supabase dashboard.

Existing variables (already configured):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional (for Playwright tests):

- `PLAYWRIGHT_TEST_EMAIL` - Test user email
- `PLAYWRIGHT_TEST_PASSWORD` - Test user password
- `PLAYWRIGHT_TEST_BASE_URL` - Base URL for tests (defaults to http://localhost:3000)
