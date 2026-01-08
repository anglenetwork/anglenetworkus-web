# Supabase MCP Setup Guide

## ✅ Configuration Complete

The Supabase MCP server has been added to your Cursor configuration at `~/.cursor/mcp.json`.

## 🔑 Next Steps: Get Your Supabase Personal Access Token

To complete the setup, you need to:

### 1. Generate a Personal Access Token (PAT) in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to **Settings** → **Access Tokens** (or **Account Settings** → **Access Tokens**)
4. Click **Generate New Token**
5. Give it a name (e.g., "Cursor MCP Server")
6. Copy the token immediately (it won't be shown again!)

### 2. Update the MCP Configuration

1. Open `~/.cursor/mcp.json`
2. Find the `"supabase"` entry
3. Replace `"YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN_HERE"` with your actual token:

```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--access-token",
    "sbp_your_actual_token_here"
  ]
}
```

### 3. Restart Cursor

After updating the token:
1. **Quit Cursor completely** (Cmd+Q on Mac, Alt+F4 on Windows/Linux)
2. **Restart Cursor**
3. The MCP server will automatically start when Cursor launches

### 4. Verify the Setup

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to **Features** → **MCP**
3. Verify that "supabase" appears in the list and is **enabled**
4. If it shows as disabled, toggle it on

### 5. Test the Connection

Try asking Cursor to interact with your Supabase database, for example:
- "List all tables in my Supabase database"
- "Show me the schema of the profiles table"
- "Query the entitlements table"

## 🔒 Security Notes

- **Never commit your access token** to version control
- The token in `~/.cursor/mcp.json` is stored locally on your machine
- Consider using environment variables if you need to share the config (see alternative below)

## 🔄 Alternative: Using Environment Variables

If you prefer to use environment variables instead of hardcoding the token:

1. Set the environment variable in your shell:
   ```bash
   export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"
   ```

2. Update `~/.cursor/mcp.json` to reference the environment variable:
   ```json
   "supabase": {
     "command": "npx",
     "args": [
       "-y",
       "@supabase/mcp-server-supabase@latest",
       "--access-token",
       "${SUPABASE_ACCESS_TOKEN}"
     ],
     "env": {
       "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
     }
   }
   ```

## 📚 Resources

- [Supabase MCP Documentation](https://supabase.com/mcp)
- [Supabase Access Tokens Guide](https://supabase.com/docs/guides/platform/access-tokens)

## ❓ Troubleshooting

**MCP server not appearing in Cursor:**
- Ensure the JSON syntax is valid (no trailing commas, proper quotes)
- Restart Cursor completely
- Check Cursor Settings → Features → MCP

**Connection errors:**
- Verify your access token is correct
- Ensure your Supabase project is accessible
- Check that the MCP server package can be installed (`npx -y @supabase/mcp-server-supabase@latest`)

**Permission errors:**
- Ensure your access token has the necessary permissions
- Check your Supabase project settings



