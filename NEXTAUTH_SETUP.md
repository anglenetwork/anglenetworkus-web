# NextAuth Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# GitHub OAuth (get these from https://github.com/settings/developers)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth (get these from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Setup GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

## Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in required fields (App name, User support email, Developer contact)
     - Add scopes: `email`, `profile`, `openid`
     - Add test users (your email addresses that will access the app)
     - Save and continue
5. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Your App Name
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.com/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret to your `.env.local`

**Important Notes:**

- For development, you can use test users without publishing the app
- For production, you'll need to publish your OAuth consent screen (requires verification if using sensitive scopes)
- The consent screen must be configured before creating OAuth credentials

## Update Allowed Email

In `app/lib/auth.ts`, update the email check to your actual email:

```typescript
if (user.email !== "your-email@example.com") return false;
```

## Production Setup

When deploying to Vercel (or other platforms):

1. Set `NEXTAUTH_URL` to your production URL: `https://your-domain.com`
2. Update OAuth App callback URLs:
   - GitHub: `https://your-domain.com/api/auth/callback/github`
   - Google: `https://your-domain.com/api/auth/callback/google`
3. Add all environment variables in your hosting platform's dashboard:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to `/studio` - you should be redirected to `/login`
3. Choose either "Login with GitHub" or "Login with Google"
4. After authentication, you'll be redirected back and can access Studio
