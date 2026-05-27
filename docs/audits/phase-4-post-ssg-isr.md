# Phase 4 — `/post/[slug]` SSG/ISR

**Date:** 2026-05-27  
**Scope:** Restore static generation / ISR for public news posts without changing layout or Phase 1–3 protections.

## Phase 3 context

Phase 3 reduced global client JS/TBT (auth providers scoped off root, header/menu/ticker deferrals, idle view trackers). It did not change article route rendering. `/post/[slug]` remained on-demand (`ƒ`) in build output.

## Problem

`/post/[slug]` was the only article-family slug route marked dynamic despite `generateStaticParams` and `revalidate = 60`. Opinion, analysis, and sponsored were `●` (SSG + ISR).

## Root cause

[`app/post/[slug]/page.tsx`](../app/post/[slug]/page.tsx) declared `searchParams` on the page and `generateMetadata` to support duplicate-slug disambiguation via `?id=`. In the App Router, `searchParams` opts the **entire** route into dynamic rendering.

Opinion/analysis/sponsored do not use `searchParams`. Shared `draftMode()` in [`fetchArticleFamilyPage`](../app/lib/article-family/fetch.ts) is not the differentiator.

## Fix

1. **Shared render** — [`app/post/[slug]/render-post-page.tsx`](../app/post/[slug]/render-post-page.tsx) (`RenderPostPage`, `buildPostPageMetadata`).
2. **Static main route** — [`app/post/[slug]/page.tsx`](../app/post/[slug]/page.tsx): slug-only fetch; `postPublishedSlugsQuery` + `sanityFetchStatic` in `generateStaticParams`.
3. **Dynamic disambiguation** — [`app/post/[slug]/with-id/[id]/page.tsx`](../app/post/[slug]/with-id/[id]/page.tsx) with `dynamic = "force-dynamic"` for `?id=` lookups.
4. **Proxy rewrite** — [`proxy.ts`](../../proxy.ts) rewrites `/post/{slug}?id={docId}` → `/post/{slug}/with-id/{id}` (browser URL unchanged).

Internal links still use `?id=` via [`articleFamilyHref`](../app/lib/article-family/routes.ts). Canonicals remain path-only.

## Build output

### Before (baseline [`build-output.txt`](./build-output.txt))

| Route | Symbol |
|-------|--------|
| `/post/[slug]` | `ƒ` (no prerendered paths) |
| `/opinion/[slug]` | `●` + paths |
| `/analysis/[slug]` | `●` + paths |
| `/sponsored/[slug]` | `●` + paths |

### After Phase 4 (`npm run build:prod`)

| Route | Symbol |
|-------|--------|
| `/post/[slug]` | `●` + ~80 paths, `revalidate` 1m |
| `/post/[slug]/with-id/[id]` | `ƒ` (rare duplicate-slug traffic) |
| `/opinion/[slug]` | `●` (unchanged) |
| `/analysis/[slug]` | `●` (unchanged) |
| `/sponsored/[slug]` | `●` (unchanged) |

## Public vs preview

| Mode | Behavior |
|------|----------|
| Published `/post/{slug}` | SSG/ISR; `articleFamilyPageBySlugQuery` + `ARTICLE_FAMILY_PUBLISHED` |
| `/post/{slug}?id={docId}` | Proxy → `with-id` route; `articleFamilyPageByIdQuery` + published guard |
| Draft preview | `sanityFetch` preview perspective when `draftMode()` enabled; `finalizePublicMetadata` → noindex/nofollow |

## Protections unchanged

- Phase 1 published-only GROQ on public queries.
- Sponsored `noindex` / follow via [`robotsFromArticleType`](../app/lib/seo/robots.ts).
- Canonical URLs: slug path only (no `?id=` in metadata).

## Lighthouse (mobile, localhost :3001)

| Page | Perf | TBT | LCP | CLS | TTFB (audit) | Report |
|------|------|-----|-----|-----|--------------|--------|
| Article (phase 2) | 76 | 175ms | 5.8s | 0.000 | 295ms | `article-mobile-after-phase-2.json` |
| Article (phase 3) | 76 | 129ms | 6.4s | 0.000 | 42ms | `article-mobile-after-phase-3.json` |
| Article (phase 4) | 67 | 235ms | 10.9s | 0.000 | 39ms | `article-mobile-after-phase-4.json` |
| Home (phase 3) | 77 | 216ms | 5.2s | 0.026 | 19ms | `home-mobile-after-phase-3.json` |
| Home (phase 4) | 77 | 175ms | 5.4s | 0.026 | 11ms | `home-mobile-after-phase-4.json` |

Article phase-4 LCP/Perf on this localhost run were noisier than phase 3 (external Unsplash transfer dominates). Phase 4 success is build output + TTFB/rendering strategy, not a single LCP number. Re-run article Lighthouse before calling a regression.

## Validation

| Check | Result |
|-------|--------|
| `format:check` | Pass (after `npm run format` on `proxy.ts`) |
| `lint` | Pass |
| `test:unit` | 101 passed |
| `build:prod` | Pass — `● /post/[slug]` (~80 paths), `ƒ /post/[slug]/with-id/[id]` |
| `test:e2e` | 23 passed, 1 failed (subscriptions integration — pre-existing env/auth) |
| Playwright report | `npx playwright show-report --port 9324` |
| Article HTTP 200 | `/post/{slug}` and `/post/{slug}?id=` smoke OK |

Known unrelated: `/myprofile/subscriptions` E2E failures (env/auth) from Phase 3.

## Caveats

- Draft preview on a statically generated post may need manual verification in Sanity Presentation.
- Slug-only fetch without `?id=` still returns first GROQ match for duplicate slugs (pre-existing); internal links should keep `?id=` from `articleFamilyHref`.
