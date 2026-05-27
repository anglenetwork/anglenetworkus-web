# Final SEO and performance summary (Phases 0–6)

**Date:** 2026-05-27  
**Workflow:** [performance-seo-audit-workflow.md](./performance-seo-audit-workflow.md)

This document summarizes the full audit program. Phase 6 added workflow hardening and final verification only—no new product SEO features.

---

## Program overview

| Phase | Focus | Outcome |
|-------|--------|---------|
| 0–2 | Baseline, indexing safety, LCP images | Published-only protection, draft `noindex`, robots private disallows, hero preload / image tuning |
| 3 | Global client JS / TBT | Auth scoped to private routes; deferred trackers; header/menu optimizations |
| 4 | Post route SSG/ISR | `/post/[slug]` static + ISR; `?id=` via proxy rewrite to internal `with-id` route |
| 5 | News SEO polish | ImageObject JSON-LD, author pages, RSS, homepage org/website JSON-LD, sitemap authors |
| 6 | Final hardening | Biome/gitignore hygiene, final Lighthouse scripts, audit runbook, consolidated validation |

---

## Major wins

- **Indexing safety:** Published-only public surfaces; draft preview `noindex,nofollow`; sponsored `noindex,follow`.
- **robots.txt:** Disallows `/studio`, `/api/`, `/myprofile`, `/logineditor`.
- **Performance (Phases 2–3):** Homepage/article LCP improvements; reduced TBT from deferred client work.
- **Routing (Phase 4):** `/post/[slug]` SSG/ISR restored; `?id=` compatibility without polluting sitemap/feed/canonical.
- **Discovery (Phase 5):** Valid RSS; author archives; rich homepage/article/author JSON-LD; canonical sitemap URLs only.
- **DX (Phase 6):** Documented audit workflow; final Lighthouse scripts; generated artifact ignores; known E2E classification.

---

## Final Lighthouse (mobile, localhost :3001)

> Metrics below are filled after `npm run lighthouse:mobile:final`. Compare to phase 4/5 JSON in `docs/audits/lighthouse-reports/` (gitignored locally).

| Page | Perf | SEO | A11y | LCP | TBT | CLS | TTFB | Report |
|------|------|-----|------|-----|-----|-----|------|--------|
| Home (phase 4) | 77 | 100 | 92 | 5.4s | 175ms | 0.026 | 11ms | `home-mobile-after-phase-4.json` |
| Home (phase 5) | 72 | 100 | 92 | 5.4s | 345ms | 0.026 | 19ms | `home-mobile-after-phase-5.json` |
| Home (final) | 79 | 100 | 92 | 5.2s | 162ms | 0.026 | 9ms | `home-mobile-final.json` |
| Article (phase 4) | 67 | 100 | 92 | 10.9s | 235ms | 0.000 | 39ms | `article-mobile-after-phase-4.json` |
| Article (phase 5) | 63 | 100 | 92 | 9.4s | 455ms | 0.000 | 21ms | `article-mobile-after-phase-5.json` |
| Article (final) | 74 | 100 | 92 | 10.9s | 105ms | 0.000 | 10ms | `article-mobile-final.json` |

Localhost performance scores vary run-to-run; **SEO 100** on home/article is the stability target.

---

## Final SEO state

| Check | Status |
|-------|--------|
| Homepage `NewsMediaOrganization` + `WebSite` / `SearchAction` JSON-LD | Expected |
| Article `NewsArticle` / `Article` JSON-LD with ImageObject when dimensions exist | Expected |
| Author `Person` + breadcrumb JSON-LD | Expected |
| `/feed.xml` RSS 2.0 (post, opinion, analysis; no sponsored) | Expected |
| `sitemap.xml` canonical URLs; author URLs | Expected |
| `news-sitemap.xml` post + analysis only, 48h | Unchanged |
| No `?id=` or `/with-id/` in sitemap, feed, canonical | Expected |
| `/post/[slug]` SSG/ISR (`revalidate = 60`) | Expected |
| `/post/[slug]?id=` proxy compatibility | Expected |

---

## Final testing state

> Filled after consolidated validation pass.

| Check | Result |
|-------|--------|
| `format:check` | Pass (after Biome format on 20 pre-existing heading files) |
| `lint` | Pass |
| `test:unit` | 110 passed |
| `typegen` | Pass |
| `build:prod` | Pass — `● /post/[slug]` SSG/ISR confirmed |
| `test:e2e` | 22 passed, 2 failed (subscriptions — pre-existing), 7 skipped |
| Playwright report (`:9324`) | `npx playwright show-report --port 9324` |

### Known pre-existing failures

- `tests/smoke/subscriptions.smoke.spec.ts`
- `tests/integration/subscriptions.integration.spec.ts`

Auth/env under `/myprofile/subscriptions` — not public SEO regressions unless subscription code changes.

---

## Phase 6 validation

| Item | Notes |
|------|--------|
| Biome ignores lighthouse reports, build dirs, typegen noise | `biome.json` + `.gitignore` |
| ESLint ignores same + `schema.json` | `eslint.config.mjs` |
| Final Lighthouse scripts | `lighthouse:home:mobile:final`, `lighthouse:article:mobile:final`, `lighthouse:mobile:final` |
| Unlighthouse | Not added (see workflow doc) |
| Prettier | Not added |
| Manual curl (`:3001`) | Public routes 200; robots/sitemap/feed OK; no `with-id`/`?id=` in discovery; `post?id=` 200; sponsored/search `noindex, follow`; canonical/OG/sitemap/feed use `localhost:3001` when built with matching `NEXT_PUBLIC_SITE_URL` |
| Final Lighthouse | Home/article SEO 100; perf/TBT improved vs phase 5 on this run (localhost variance expected) |

---

## Remaining product decisions

| Topic | Current state |
|-------|----------------|
| Opinion in Google News sitemap | **No** (post + analysis only) |
| Opinion in RSS | **Yes** |
| Sponsored in RSS | **No** |
| Signin / pricing indexability | Not changed in audit program — verify if needed |
| Subscriptions E2E / auth-env | Pre-existing failures; stabilize separately |
| External / Unsplash images on article LCP | Dominates localhost LCP; out of scope for Phases 5–6 |

---

## How to rerun audits

1. Follow [performance-seo-audit-workflow.md](./performance-seo-audit-workflow.md).
2. `build:prod` + prod server on `:3001` with matching `NEXT_PUBLIC_SITE_URL`.
3. Manual curl checklist, then `npm run lighthouse:mobile:final`.
4. Update this file’s Lighthouse and validation tables.
