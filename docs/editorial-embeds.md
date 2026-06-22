# Editorial embeds

This project supports structured embeds inside article body Portable Text. Editors insert embed blocks in Sanity Studio; the frontend renders them from typed fields—never from raw HTML or script tags.

## Tweet/X embeds

### Adding a tweet to an article

1. Open an article in Sanity Studio (`/studio`).
2. In **Article Body**, insert a **Tweet/X Embed** block between paragraphs.
3. Paste the full Twitter/X status URL into **Tweet URL**.
4. Optionally add a **Caption**—an editor note shown below the embed on the site.

Save and publish as usual. The embed appears in the article body on the frontend.

Example URL:

`https://x.com/CNN/status/2068574911484907971`

The app extracts the numeric Tweet ID from the URL automatically. Editors do not need to enter the ID separately.

### Supported URL formats

These URL patterns are accepted:

- `https://twitter.com/{handle}/status/{numericId}`
- `https://x.com/{handle}/status/{numericId}`
- `https://mobile.twitter.com/{handle}/status/{numericId}`
- `www.` variants of the above
- URLs with query strings after the ID (e.g. `?s=20`)

Non-status URLs and non-numeric IDs are rejected by Studio validation.

### Why raw embed HTML is not supported

Article bodies store structured Portable Text objects, not arbitrary HTML. Tweet/X embed blocks store:

- `_type: "tweetEmbed"`
- `url`
- optional `caption`

This approach is safer than pasting Twitter’s iframe/script embed code: no third-party scripts in CMS content, predictable rendering, and validation in Studio.

### How tweets render on the site

The Next.js article renderer uses [`react-tweet`](https://github.com/vercel/react-tweet). The numeric Tweet ID is derived from the stored URL at render time. No Twitter/X API credentials are required for display.

### Troubleshooting

| Issue | What to check |
|-------|----------------|
| Embed missing on site | Confirm **Tweet URL** is a valid `twitter.com` or `x.com` status link with a numeric ID. |
| Studio validation error | URL must be a `twitter.com` or `x.com` status link. |
| Tweet shows as unavailable | The post may be deleted, private, or restricted by X. The page will not crash; the embed may show an unavailable state or nothing. |
| Wrong tweet shown | Re-check the pasted **Tweet URL**. |

### Video embeds

Video embeds use a separate **Video Embed** block (YouTube, Vimeo). See the Video Embed fields in Studio for URL requirements.
