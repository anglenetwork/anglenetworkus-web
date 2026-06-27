# Angle Sanity Schema Reference

Concise reference for the current CMS shape. Source of truth: `sanity/schemas/` in this repo. Operational runbooks: [`docs/sanity-publishing.md`](../docs/sanity-publishing.md).

## Project

| Setting | Value |
|---------|-------|
| Project | Angle Network (`hxfedc5p`) |
| Dataset | `production` |
| Studio (local) | `http://localhost:3000/studio` |
| Studio (hosted) | `https://angle-studio.sanity.studio/` |

Deploy schema changes: `npx sanity schema deploy` then `npx sanity deploy`.

---

## Document types

| Type | Purpose | Extra fields beyond shared article base |
|------|---------|----------------------------------------|
| `post` | Standard news | Homepage booleans, `priority`, `readTime`, `labels` |
| `opinion` | Viewpoint / commentary | `disclosure` (optional); **author required** |
| `analysis` | Explainer journalism | `analysisFocus` (required, max 120); optional `methodologyNote`, `sourcesNote`; **author required** |
| `sponsored` | Paid / partner content | `sponsorAttribution` (required object) |
| `author` | Byline + optional Studio access | name, slug, picture, email, bio, social, `seo` |
| `category` | Top-level taxonomy | name, slug; optional parent, hero, nav metadata |
| `tag` | Sub-taxonomy (category-scoped) | title, slug, **required** ref → `category` |
| `settings` | Site singleton | site title, description, footer, OG image |

The `topic` document type was removed. Do not create or reference it.

---

## How schemas connect

```
post ──→ category (required ref)
     ──→ tags[] (refs, filtered to selected category)
     ──→ author (optional ref on post; required on opinion/analysis)
     ──→ cover (coverMedia object)
     ──→ body (blockContent array)
     ──→ seo (seo object)

tag ──→ category (required parent ref)

blockContent ──→ block | editorialImage | pullQuote | articleDivider | videoEmbed | tweetEmbed
```

Article types (`post`, `opinion`, `analysis`, `sponsored`) share core fields from `sanity/schemas/helpers/articleBaseFields.ts`.

---

## Shared article fields

### Core metadata

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Min 4 characters |
| `tickerTitle` | Yes | Max 40 characters; short ticker headline |
| `excerpt` | No | Max 280; card/subhead text (no separate `dek` field) |
| `slug` | Yes | `{ _type: "slug", current: "kebab-case" }`; unique per `_type` |

### Body

| Field | Required when published | Notes |
|-------|-------------------------|-------|
| `body` | Yes | Portable Text (`blockContent`); canonical content stream |

**Never write:** `bodyTextOne`, `bodyRich`, `bodyBlocks`, `date`.

### Media

| Field | Required when published | Notes |
|-------|-------------------------|-------|
| `cover` | Yes | `coverMedia` object with valid source + alt |
| `imageGallery` | No | Array of `galleryImageItem` |

### Taxonomy

| Field | Required | Notes |
|-------|----------|-------|
| `category` | Yes | Reference → `category` |
| `tags` | No | Array of references → `tag`; Studio filters to selected category |
| `author` | Varies | Optional on `post`; required on `opinion` and `analysis` |

### Publishing

| Field | Required when published | Notes |
|-------|-------------------------|-------|
| `status` | — | `draft` \| `scheduled` \| `published` (default: `published`) |
| `publishedAt` | Yes | UTC datetime |
| `updatedAt` | No | UTC datetime |

### SEO

| Field | Notes |
|-------|-------|
| `seo.title` | Optional override |
| `seo.description` | Optional override |
| `seo.ogImage` | Optional image |
| `seo.canonicalUrl` | Optional URL |

### Other

| Field | Notes |
|-------|-------|
| `searchText` | Optional; auto-backfillable via `npm run backfill:article-search-text`; do not overwrite if already set |

---

## `post`-specific fields

### Homepage curation (booleans only)

There are **no `*Rank` or `*Until` fields** in the current schema. The frontend filters by boolean flags and orders by `publishedAt desc`.

| Field | Default | Notes |
|-------|---------|-------|
| `mainHeadline` | `false` | Hero rail — mutually exclusive with other primary rails |
| `frontline` | `false` | Two top stories below main headline |
| `rightHeadline` | `false` | Right column rail |
| `justIn` | `false` | Left-column "Just In" rail |
| `breakingNews` | `false` | Only visible when `justIn` is true; mutually exclusive with `developingStory` |
| `developingStory` | `false` | Only visible when `justIn` is true |
| `featured` | `false` | Editorial boost; not a rail slot |
| `priority` | — | Integer 0–10 (10 = highest) |
| `readTime` | — | Estimated minutes |
| `labels` | — | Internal array: `breaking`, `exclusive`, `live` |

**Rail exclusivity:** Only one of `mainHeadline`, `frontline`, `rightHeadline`, `justIn` may be true at a time.

---

## Object types

### `coverMedia`

Hero image for articles.

| Field | Notes |
|-------|-------|
| `source` | `"asset"` \| `"external"` (required) |
| `externalUrl` | Required when `source === "external"` |
| `image` | Sanity asset; required when `source === "asset"` |
| `alt` | Required for published posts |
| `caption` | Visible caption below image |
| `creditAuthor` | Creator / photographer |
| `creditSource` | Provider or platform (e.g. "Wikimedia Commons") |
| `licenseOrRights` | Rights note (e.g. "CC BY-SA 4.0") |

**Published validation:** alt required; `licenseOrRights` required when image present; `creditAuthor` **or** `creditSource` required.

**Legacy names removed — do not use:** `epigraph`, `creditProvider`, `creditLicense`, `creditSourceUrl`.

**Frontend rule:** If `cover.caption` is empty, render no caption line (do not fall back to excerpt).

### `blockContent`

Portable Text array for article body.

- **Text blocks:** styles `normal`, `h2`, `h3`, `h4`, `blockquote`; lists `bullet`, `number`; inline links via `markDefs`
- **Embeds:** `editorialImage`, `pullQuote`, `articleDivider`, `videoEmbed`, `tweetEmbed`

Block shape:

```json
{
  "_type": "block",
  "_key": "body-b0",
  "style": "normal",
  "children": [{ "_type": "span", "_key": "body-s0", "text": "...", "marks": [] }],
  "markDefs": []
}
```

### `editorialImage`

Inline body image. Same media fields as `coverMedia` plus required `layout`: `inline` \| `wide` \| `full`.

### `galleryImageItem`

Gallery/carousel item. Same media attribution fields as cover; used in `imageGallery` array.

### `seo`

Nested SEO object: `title`, `description`, `ogImage`, `canonicalUrl`.

### `pullQuote`

Fields: `quote` (required), `attribution`, `sourceLabel`.

### `articleDivider`

Visual section break in body content.

### `videoEmbed`

Fields: `provider` (`youtube` \| `vimeo` \| `generic`), `url` (required), optional `title`.

### `tweetEmbed`

Fields: `url` (required Twitter/X status URL), optional `caption`. No raw embed HTML.

### `sponsorAttribution`

For `sponsored` type only. Fields: `sponsorName` (required), `sponsorUrl`, `disclosure` (required).

---

## Reference ID patterns

| Entity | Pattern | Example |
|--------|---------|---------|
| Category | `category.{slug}` | `category.politics` |
| Tag | `tag.{categorySlug}.{tagSlug}` | `tag.politics.congress` |
| Author | Document `_id` in Sanity | Ashley Simmons: `59d2b194-17eb-4526-ad4f-35aaf3ea874c` |

Reference shape: `{ _type: "reference", _ref: "category.politics" }`.

Tags in arrays also need `_key`: `{ _key: "tag-0", _type: "reference", _ref: "tag.politics.congress" }`.

Verify author IDs exist in production before publishing.

---

## Canonical taxonomy

8 categories, 37 tags. Tags must belong to the selected category. Never invent new categories or tags.

| Category | Tags |
|----------|------|
| **US** (`us`) | Trump, Iran War, Crime, Abortion, Education, Weather |
| **World** (`world`) | China, Europe, Middle East, Latin America, Africa |
| **Politics** (`politics`) | Immigration, White House, Congress, Elections, Supreme Court |
| **Business** (`business`) | Markets, Economy, Finance, Tariffs, Inflation, Real Estate |
| **Science** (`science`) | Space, Life Sciences, Climate |
| **Entertainment** (`entertainment`) | Movies, Television, Fashion, Music, Celebrity |
| **Tech** (`tech`) | Artificial Intelligence, Social Media |
| **Lifestyle** (`lifestyle`) | Food, Travel, Culture, Health, Beauty |

Slug reference (for `_ref` IDs):

- **US:** `trump`, `iran-war`, `crime`, `abortion`, `education`, `weather`
- **World:** `china`, `europe`, `middle-east`, `latin-america`, `africa`
- **Politics:** `immigration`, `white-house`, `congress`, `elections`, `supreme-court`
- **Business:** `markets`, `economy`, `finance`, `tariffs`, `inflation`, `real-estate`
- **Science:** `space`, `life-sciences`, `climate`
- **Entertainment:** `movies`, `television`, `fashion`, `music`, `celebrity`
- **Tech:** `artificial-intelligence`, `social-media`
- **Lifestyle:** `food`, `travel`, `culture`, `health`, `beauty`

Source: `news-ingestion/src/utils/data/canonical-taxonomy.ts`.

---

## Legacy / forbidden fields

Do **not** write these on new or updated documents:

| Field | Reason |
|-------|--------|
| `bodyTextOne`, `bodyRich`, `bodyBlocks` | Replaced by `body` |
| `date` | Replaced by `publishedAt` |
| `dek` | Replaced by `excerpt` |
| `*Rank` (`mainHeadlineRank`, `frontlineRank`, etc.) | Removed from schema |
| `*Until` (`frontlineUntil`, `justInUntil`, etc.) | Removed from schema |
| `views`, `viewsAll`, `views7d`, `views30d` | Article views tracked in Supabase |
| `topic` | Document type removed |
| `epigraph`, `creditProvider`, `creditSourceUrl`, `creditLicense` | Renamed or removed from `coverMedia` |

Schema deploy does not remove stored legacy keys on existing documents. Old keys may still appear in dataset data until manually unset.

---

## Required fields checklist (published `post`)

| Field | Rule |
|-------|------|
| `_type` | `"post"` |
| `title` | ≥ 4 chars |
| `tickerTitle` | ≤ 40 chars |
| `slug.current` | Unique kebab-case |
| `body` | Non-empty Portable Text |
| `category` | Valid reference |
| `cover` | Valid `coverMedia` with source, alt, license, credit |
| `status` | `"published"` |
| `publishedAt` | UTC ISO datetime |
| `seo` | Nested object with title and description |

Recommended defaults for automated publishing: see [`instructions-to-publish.md`](instructions-to-publish.md).
