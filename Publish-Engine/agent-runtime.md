# Agent runtime brief

Always-on checklist for Angle publishing agents and automations.
Load this file by default. Open deeper docs **only when needed** (see bottom).

**Deep source of truth:** [`instructions-to-publish.md`](instructions-to-publish.md). If this brief and that playbook conflict, the playbook wins—unless the run prompt states an explicit override (e.g. Unsplash stock for this run).

---

## Role

Rewrite source text in original Angle style, classify with existing taxonomy, generate metadata, and create/publish a Sanity `post`.

## Target

| Setting | Value |
|---------|--------|
| Project | `hxfedc5p` (Angle Network) |
| Dataset | `production` |
| Type | `post` |
| Author | Ashley Simmons — `_ref`: `59d2b194-17eb-4526-ad4f-35aaf3ea874c` |
| Status | `published` |
| Priority | `3` |
| Homepage flags | all `false` unless explicitly requested |
| Body field | `body` only |

Never invent categories, tags, or authors.

## Critical rules

* Never invent facts, quotes, numbers, timelines, sources, image credits, licenses, URLs, or Sanity IDs.
* Preserve facts, names, numbers, chronology, quotes, and context from the source.
* Rewrite in original Angle style; do not closely copy the source.
* Tone: clear, direct, factual, U.S.-focused. No promotion, speculation, or unsupported conclusions.
* `publishedAt` = `new Date().toISOString()` at publish time; `updatedAt` = same unless intentionally updating.
* Never use future, rounded, example, source-article, or guessed publish times.
* Leave `searchText` empty.

**Never write:** `bodyTextOne`, `bodyRich`, `bodyBlocks`, `date`, `dek`, `topic`, `views*`, `*Rank`, `*Until`.

**Image attribution fields (exact names):** `caption`, `creditAuthor`, `creditSource`, `licenseOrRights`.

## Publish when

Direct publish if the user/run says publish / rewrite and publish / post this / a homepage placement phrase.

Draft first if asked for preview/review, or if source/rights/metadata are unverifiable or ambiguous.

## Required published fields

```txt
_type, title (≥4), tickerTitle (≤40), excerpt (≤280),
slug.current (kebab-case, unique), body[] (Portable Text),
category, cover (coverMedia), status=published,
publishedAt, updatedAt, seo { title, description },
readTime (whole minutes ~200 wpm), priority=3
```

Body: one block per paragraph; stable `_key`s (`body-b0`, `body-s0`, …). Styles: `normal` | `h2` | `h3` | `h4` | `blockquote`; lists; links via `markDefs`. Optional embeds: `editorialImage`, `pullQuote`, `articleDivider`, `videoEmbed`, `tweetEmbed`.

SEO: nested `{ _type: "seo", title, description }` — not top-level SEO fields.

## Taxonomy (canonical)

One category; tags only from that category. If no tag fits, category alone.

| Category | Tags |
|----------|------|
| `category.us` | trump, iran-war, crime, abortion, education, weather |
| `category.world` | china, europe, middle-east, latin-america, africa |
| `category.politics` | immigration, white-house, congress, elections, supreme-court |
| `category.business` | markets, economy, finance, tariffs, inflation, real-estate |
| `category.science` | space, life-sciences, climate |
| `category.entertainment` | movies, television, fashion, music, celebrity |
| `category.tech` | artificial-intelligence, social-media |
| `category.lifestyle` | food, travel, culture, health, beauty |

Refs: `category.{slug}`, `tag.{categorySlug}.{tagSlug}` (e.g. `tag.politics.congress`).

## Homepage

All flags false by default. Primary rails (only one true): `mainHeadline` | `frontline` | `rightHeadline` | `justIn`.  
`breakingNews` / `developingStory` only when `justIn` is true (mutually exclusive).

## Images (summary)

* Do **not** reuse the source article image unless the user supplies an approved URL with clear reuse rights.
* Stock (including Unsplash) is **disallowed by default** unless the run/user explicitly allows it.
* Prefer Wikimedia Commons and other approved public-domain / open-license sources (see full playbook).
* Reject: Getty, AP, Reuters, Shutterstock, news-site images, unclear rights, NC/ND/editorial-only.
* Never invent credits — extract from the photo page.
* Do not apply cover styling unless explicitly requested; never mention styling in public fields.
* No safe image → Angle placeholder (`creditAuthor`/`creditSource` `"Angle"`, `licenseOrRights` `"The Angle Media Network."`).

### Cover shape

```txt
cover._type = coverMedia
cover.source = external | asset
cover.externalUrl or cover.image
cover.alt, cover.caption, cover.creditAuthor, cover.creditSource, cover.licenseOrRights
```

### External URL templates (normalize before write)

```txt
Unsplash:  https://images.unsplash.com/photo-{ID}?w=800&q=80&auto=format&fit=crop
Wikimedia: https://upload.wikimedia.org/wikipedia/commons/{a}/{ab}/{Filename.ext}
```

Never store page URLs, `/download`, `Special:FilePath`, or Wikimedia `/thumb/` URLs.  
`mainHeadline` → Unsplash or Sanity asset only (not Wikimedia).

## Efficiency

* Call `get_schema` at most once per run.
* Batch duplicate checks (GROQ) before rewriting.
* Open deeper docs only when needed (below). Do not load [`image-styling.md`](image-styling.md) unless styling was requested.

## When to open deeper docs

| Need | Open |
|------|------|
| Edge cases, failure rules, full image rights lists, tweet embeds, verification GROQ | [`instructions-to-publish.md`](instructions-to-publish.md) |
| Exact field shapes, object types, forbidden fields | [`sanity-schema-reference.md`](sanity-schema-reference.md) |
| Unsplash/Wikimedia URL normalization details | [`cover-image-urls.md`](cover-image-urls.md) |
| Named cover style / collage treatment | [`image-styling.md`](image-styling.md) |

## Post-publish (minimum check)

Confirm `status == "published"`, `body` non-empty, no legacy body fields, cover attribution present, and external cover URL matches a normalized Unsplash or Wikimedia pattern when `source == "external"`. Full GROQ: see playbook.
