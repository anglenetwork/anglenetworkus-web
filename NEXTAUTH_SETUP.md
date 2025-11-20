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

## Update Allowed Email

In `app/lib/auth.ts`, update the email check to your actual email:

```typescript
if (user.email !== "your-email@example.com") return false;
```

## Production Setup

When deploying to Vercel (or other platforms):

1. Set `NEXTAUTH_URL` to your production URL: `https://your-domain.com`
2. Update GitHub OAuth App callback URL to: `https://your-domain.com/api/auth/callback/github`
3. Add all environment variables in your hosting platform's dashboard

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to `/studio` - you should be redirected to `/login`
3. Click "Login with GitHub"
4. After authentication, you'll be redirected back and can access Studio
