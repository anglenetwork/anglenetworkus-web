# Lighthouse Phases 0–2 Baseline and Results

**Date started:** 2026-05-27  
**Related audit:** [lighthouse-seo-performance-audit.md](./lighthouse-seo-performance-audit.md)

This document tracks the repeatable Lighthouse workflow and before/after metrics for Phases 0–2 (baseline setup, SEO/indexing safety, LCP image tuning).

---

## Environment variables

`NEXT_PUBLIC_SITE_URL` must match the origin you audit. Canonical URLs, Open Graph, JSON-LD, and sitemap `loc` values all derive from it via [`app/lib/seo/site-url.ts`](../../app/lib/seo/site-url.ts).

| Environment | Value |
|-------------|--------|
| Local production (port 3001) | `NEXT_PUBLIC_SITE_URL=http://localhost:3001` |
| Production | `NEXT_PUBLIC_SITE_URL=https://your-production-domain.com` |

Set this in `.env.local` before `next build` and `next start`.

---

## Repeatable workflow (production only)

Do **not** run Lighthouse against `next dev`.

```bash
# 1. Build (skips prebuild format if .open-next/ causes Biome parse errors)
npm run build:prod

# 2. Start production server on a dedicated port
PORT=3001 npm run start

# 3. Run Lighthouse (separate terminal)
npm run lighthouse:home:mobile
npm run lighthouse:article:mobile
# Or full sample set:
npm run lighthouse:seo:sample
```

### Build note

`npm run build` runs `prebuild` format, which can fail if `.open-next/` build artifacts exist on disk. Prefer `npm run build:prod` (`typegen` + `next build` only).

---

## Commands and categories

| Item | Value |
|------|--------|
| Lighthouse CLI | `npx lighthouse` (no global install required) |
| Chrome flags | `--headless=new --no-sandbox` |
| Categories | `performance`, `seo`, `accessibility` |
| Mobile emulation | `--form-factor=mobile --screenEmulation.mobile=true` |
| Output | JSON under `docs/audits/lighthouse-reports/` |

### URLs audited

| Page | Path |
|------|------|
| Homepage | `/` |
| Article | `/post/cyber-agencies-flag-vpn-supply-chain-exposure-after-vendor-patch-delays` |
| Category | `/category/business` |
| Tag | `/tag/artificial-intelligence` |
| Opinion index | `/opinion` |
| Analysis index | `/analysis` |
| Search | `/search?q=news` |

---

## Pre-change baseline metrics (mobile)

Captured before Phases 0–2 code changes. Source: [lighthouse-seo-performance-audit.md](./lighthouse-seo-performance-audit.md), local prod on port 3001.

| Page | Perf | SEO | A11y | FCP | LCP | CLS | TBT | Report file |
|------|------|-----|------|-----|-----|-----|-----|-------------|
| Homepage | 66 | 100 | 92 | 1.4s | 5.4s | 0.015 | 450ms | `home-mobile.json` |
| Article | 67 | 92 | 92 | 1.2s | 11.4s | 0 | 300ms | `article-mobile.json` |
| Category | 71 | 100 | 92 | 1.3s | 3.8s | 0 | 730ms | `category-mobile.json` |
| Tag | 72 | 100 | 92 | 1.2s | 5.6s | 0 | 320ms | `tag-mobile.json` |
| Opinion | 90 | 100 | 90 | 1.2s | 3.6s | 0 | 90ms | `opinion-mobile.json` |
| Analysis | 90 | 100 | 90 | 1.2s | 3.6s | 0 | 50ms | `analysis-mobile.json` |
| Search | 80 | 69 | 91 | 1.2s | 5.4s | 0.001 | 90ms | `search-mobile.json` |

Homepage desktop (reference): Performance 96, LCP 1.1s (`home-desktop.json`).

---

## Phase 2 results

_Filled after implementation and post-change Lighthouse runs._

### After-change metrics (mobile)

| Page | Perf | SEO | A11y | FCP | LCP | CLS | TBT | Report file |
|------|------|-----|------|-----|-----|-----|-----|-------------|
| Homepage | 90 | 100 | 92 | 1.3s | 3.0s | 0.015 | 238ms | `home-mobile-after-phase-2.json` |
| Article | 76 | 92 | 92 | 1.0s | 5.8s | 0 | 175ms | `article-mobile-after-phase-2.json` |

### Delta summary

| Page | Performance | LCP |
|------|-------------|-----|
| Homepage | 66 → 90 (+24) | 5.4s → 3.0s (-2.4s) |
| Article | 67 → 76 (+9) | 11.4s → 5.8s (-5.6s) |

### TBT/CLS delta

| Page | TBT (before → after) | CLS (before → after) |
|------|------------------------|------------------------|
| Homepage | 450ms → 238ms (-212ms) | 0.015 → 0.015 (±0) |
| Article | 300ms → 175ms (-125ms) | 0 → 0 (±0) |

### Remaining bottlenecks

_To be documented after post-change runs._

- External Unsplash URLs via `/_next/image` (large mobile transfer).
- Global client shell (header, auth providers) contributing to TBT.
- `/post/[slug]` still on-demand SSR (`ƒ`) — out of scope for Phases 0–2.

---

## Generated report location

`docs/audits/lighthouse-reports/` (gitignored via `*.json` / `*.html` in `.gitignore`).

Biome and ESLint already exclude this directory from format/lint targets.
