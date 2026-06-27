# Sanity publishing rules (agents and automation)

## Source of truth

- **Schema:** [`sanity/schemas/`](../sanity/schemas/) and extracted [`schema.json`](../schema.json)
- **Do not rely on MCP `get_schema` alone** — it can lag until embedded Studio at `/studio` has been deployed and opened once against production.
- **Content shape:** GROQ on real documents beats string search for `"body"` (which also matches `bodyTextOne`, block type titles, etc.).

## Body field (required)

Article content belongs in **`body`** only — Portable Text (`blockContent`):

- One array of blocks with `_type: "block"`, `style`, `children` spans, and optional embed types (`editorialImage`, `tweetEmbed`, etc.).
- **Never write** `bodyTextOne`, `bodyBlocks`, `bodyRich`, or document-level `date` — legacy fields; the frontend ignores them.

Convert plain-text paragraphs with `paragraphsToPortableText()` in `news-ingestion/src/gunnerWorker/portableText.ts`.

## Ingestion pipeline (preferred)

1. Fetcher → Supabase `pending`
2. AI worker → `processed`
3. Gunner worker → Sanity **draft only** (`drafts.ingest-{id}`, `status: "draft"`, `body` set)
4. Human publishes in Studio after replacing placeholder cover

Gunner **never** publishes. See `news-ingestion/docs/step-4-gunner-worker.md`.

## Direct API / MCP publish

Minimum fields for a published `post`:

| Field | Requirement |
|-------|-------------|
| `_type` | `"post"` |
| `title` | ≥ 4 characters |
| `tickerTitle` | ≤ 40 characters |
| `slug` | `{ _type: "slug", current: "..." }` |
| `excerpt` | ≤ 280 characters (recommended) |
| `body` | Non-empty Portable Text |
| `status` | `"published"` |
| `publishedAt` / `updatedAt` | ISO datetimes |
| `category` | Reference to a category doc |
| `tags` | Category-scoped tag references (optional) |
| `cover` | `coverMedia` with alt, caption, credits, `licenseOrRights` |
| `seo` | `{ _type: "seo", title, description }` |
| Homepage rails | All `false` unless explicitly requested |

Draft validator reference: `news-ingestion/src/gunnerWorker/validateSanityDraftPayload.ts`.

## Post-publish verification

```groq
*[_type == "post" && slug.current == $slug][0]{
  _id,
  status,
  publishedAt,
  "bodyBlockCount": count(body),
  defined(bodyTextOne),
  defined(bodyRich)
}
```

Expect `bodyBlockCount > 0` and legacy fields undefined.

## Legacy field audit

```bash
npm run sanity:audit-legacy-fields
```

## Seed / reset (destructive)

Only on empty or approved datasets:

```bash
# news-ingestion
npm run milestone3:dry-run
CONFIRM_SANITY_ARTICLE_RESEED=YES npm run milestone3:reseed
```
