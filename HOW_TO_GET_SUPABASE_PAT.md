# How to Get Your Supabase Personal Access Token (PAT)

## Step-by-Step Guide

### Step 1: Log in to Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in with your Supabase account credentials

### Step 2: Navigate to Account Settings

1. Click on your **profile icon** (usually in the top-right corner of the dashboard)
2. From the dropdown menu, select **"Account Settings"** or **"Account"**

### Step 3: Access Access Tokens Section

1. In the Account Settings page, look for the **"Access Tokens"** section in the left sidebar
2. Click on **"Access Tokens"** (it may also be labeled as "API Tokens" or "Personal Access Tokens")

   **Alternative path if not in Account Settings:**
   - Some Supabase versions have it under: **Settings** → **Access Tokens**
   - Or directly at: [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)

### Step 4: Generate a New Token

1. On the Access Tokens page, you'll see a list of existing tokens (if any)
2. Click the **"Generate New Token"** button (usually green or blue)
3. A dialog/modal will appear asking for:
   - **Token Name**: Give it a descriptive name like:
     - `Cursor MCP Server`
     - `MCP Integration`
     - `Development MCP Token`

### Step 5: Copy the Token

1. After clicking **"Generate"** or **"Create Token"**, Supabase will display your new token
2. **⚠️ IMPORTANT**: Copy the token immediately - it starts with `sbp_` followed by a long string
   - Example format: `sbp_1234567890abcdefghijklmnopqrstuvwxyz`
3. **⚠️ WARNING**: This token will only be shown once. If you close the dialog without copying it, you'll need to generate a new one.

### Step 6: Store the Token Securely

- Save the token in a secure password manager or note-taking app
- You'll need it to update your MCP configuration

## Visual Guide (UI Elements to Look For)

### Where to Find It:

```
Supabase Dashboard
  └─> Profile Icon (top-right)
      └─> Account Settings
          └─> Access Tokens (left sidebar)
              └─> Generate New Token button
```

### What the Token Looks Like:

- **Format**: `sbp_` followed by a long alphanumeric string
- **Length**: Typically 40-60+ characters
- **Example**: `sbp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

## Quick Access URL

If you're logged in, you can go directly to:

- **Access Tokens Page**: [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)

## After Getting the Token

Once you have your PAT:

1. **Update MCP Configuration**:
   - Open `~/.cursor/mcp.json`
   - Find the `"supabase"` section
   - Replace `"SUPABASE_ACCESS_TOKEN": "sb_publishable_..."`
   - With: `"SUPABASE_ACCESS_TOKEN": "sbp_your_actual_token_here"`

2. **Restart Cursor**:
   - Quit Cursor completely (Cmd+Q on Mac, Alt+F4 on Windows)
   - Restart Cursor to load the new configuration

3. **Test the Connection**:
   - Ask me to "List all tables in my Supabase database"
   - The MCP server should now connect successfully

## Troubleshooting

### "I don't see Access Tokens in Account Settings"

- Try: **Settings** → **Access Tokens** (project-level)
- Or: Check if you're on the correct account/organization
- Some organizations may restrict token creation

### "The token doesn't start with 'sbp\_'"

- Make sure you're generating a **Personal Access Token**, not:
  - Project API keys (anon/service role keys)
  - Publishable keys
  - Other API credentials

### "I lost my token"

- You'll need to generate a new one
- Old tokens cannot be retrieved (they're only shown once)
- You can revoke old tokens from the Access Tokens page

### "Token doesn't work"

- Verify the token is copied completely (no extra spaces)
- Ensure you restarted Cursor after updating the config
- Check that the token hasn't been revoked
- Verify the token format starts with `sbp_`

## Security Best Practices

1. **Never commit tokens to Git** - They're already in `.gitignore` for `.env.local`, but also avoid committing `mcp.json` with tokens
2. **Use descriptive names** - Name tokens clearly so you know what they're for
3. **Rotate tokens regularly** - Generate new tokens periodically and revoke old ones
4. **Revoke unused tokens** - Delete tokens you're no longer using
5. **Limit token scope** - Use tokens only for their intended purpose

## Need Help?

If you're still having trouble:

1. Check the [Supabase Documentation on Access Tokens](https://supabase.com/docs/guides/platform/access-tokens)
2. Verify you have the correct permissions on your Supabase account
3. Try generating the token from a different browser or incognito mode
