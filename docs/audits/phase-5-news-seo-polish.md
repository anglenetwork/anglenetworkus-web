# Phase 5 — News SEO polish

**Date:** 2026-05-27  
**Scope:** Structured data, discovery feeds, author archives, sitemap hardening — no visual redesign, no Phase 4 regression.

## Phase 4 context

`/post/[slug]` is SSG/ISR (`●`); duplicate-slug `?id=` uses proxy rewrite to `/post/[slug]/with-id/[id]`. Phase 5 does not change that routing.

## Structured data changes

### Article JSON-LD

- [`buildArticleImagesJsonLd`](../app/lib/seo/json-ld.ts): Sanity cover with `dimensions` → `ImageObject` (url, width, height).
- External / dimensionless covers → URL string in `image` array (no fake dimensions).
- GROQ: `dimensions` on `image.asset->metadata` in [`image-fields-projection.ts`](../sanity/lib/image-fields-projection.ts).
- `Person` author includes `url` when `author.slug` is present (`/author/{slug}`).

### Homepage

- Standalone `NewsMediaOrganization` JSON-LD (`@id` `{siteUrl}/#organization`, logo from settings OG image when available).
- `WebSite` JSON-LD with `SearchAction` → `/search?q={search_term_string}`; publisher references org `@id`.
- `/search` remains **noindex, follow** (`robotsUtilityNoindex`) — compatible with SearchAction.

### Author pages

- New [`app/author/[slug]/page.tsx`](../app/author/[slug]/page.tsx): SSG/ISR, published articles (post/opinion/analysis), `Person` + `BreadcrumbList` JSON-LD, optional `sameAs` from real social fields.

## RSS feed

- [`app/feed.xml/route.ts`](../app/feed.xml/route.ts): RSS 2.0, 40 latest items.
- Types: **post, opinion, analysis** (matches `/latest` / `FEED_MIXED_EDITORIAL_TYPES`).
- **Excluded:** sponsored, drafts, `/with-id`, `?id=` URLs (canonical paths only).
- `<link rel="alternate" type="application/rss+xml" href="/feed.xml" />` in root layout.

## Sitemap / news sitemap / robots

| Surface | Behavior |
|---------|----------|
| `sitemap.xml` | `articleFamilyCanonicalHref`; author URLs for authors with published articles |
| `news-sitemap.xml` | Unchanged: **post + analysis**, 48h window only — **no opinion** |
| `robots.txt` | Unchanged disallow: `/studio`, `/api/`, `/myprofile`, `/logineditor` |
| Sponsored | Still **noindex, follow** |

## Editorial / product decisions (documented)

| Question | Decision |
|----------|----------|
| Opinion in Google News sitemap? | **No** (unchanged) |
| Opinion in RSS? | **Yes** (matches mixed editorial feed policy) |
| Sponsored in RSS? | **No** |
| Author archive pages? | **Yes** — minimal `/author/[slug]` |
| Signin / pricing indexable? | Not changed in Phase 5; verify separately if needed |

## Unlighthouse

**Not added.** Existing `lighthouse:*:after:phase-*` scripts cover home + article; Phase 5 is SEO metadata/feed completeness.

## Manual validation checklist

- [ ] Rich Results Test: homepage, one `/post/`, one `/author/`
- [ ] `curl -s http://localhost:3001/feed.xml | head`
- [ ] `curl -s http://localhost:3001/sitemap.xml | grep -E 'with-id|\\?id='` → empty
- [ ] Article page JSON-LD: ImageObject when Sanity hero has dimensions
- [ ] Draft preview: noindex/nofollow when draft mode enabled

## Lighthouse (mobile, localhost :3001)

| Page | Perf | SEO | A11y | LCP | TBT | CLS | TTFB | Report |
|------|------|-----|------|-----|-----|-----|------|--------|
| Article (phase 4) | 67 | 100 | 92 | 10.9s | 235ms | 0.000 | 39ms | `article-mobile-after-phase-4.json` |
| Article (phase 5) | 63 | 100 | 92 | 9.4s | 455ms | 0.000 | 21ms | `article-mobile-after-phase-5.json` |
| Home (phase 4) | 77 | 100 | 92 | 5.4s | 175ms | 0.026 | 11ms | `home-mobile-after-phase-4.json` |
| Home (phase 5) | 72 | 100 | 92 | 5.4s | 345ms | 0.026 | 19ms | `home-mobile-after-phase-5.json` |

Phase 5 SEO score should remain strong; performance varies on localhost (Unsplash LCP).

## Validation

| Check | Result |
|-------|--------|
| `format:check` | Pass |
| `lint` | Pass |
| `test:unit` | 110 passed |
| `build:prod` | Pass — `● /post/[slug]` unchanged |
| Manual smoke | post 200, post `?id=` 200, feed 200, author 200; no `with-id`/`?id=` in sitemap/feed |
| `test:e2e` | 22 passed, 2 failed (subscriptions — pre-existing) |
| Playwright report | `npx playwright show-report --port 9324` |
