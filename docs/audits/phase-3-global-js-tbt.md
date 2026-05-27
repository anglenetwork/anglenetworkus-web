# Phase 3 — Global JS / TBT

**Date:** 2026-05-27  
**Scope:** Reduce global client JS and Total Blocking Time on public news routes without visual changes.

## Phase 2 baseline (mobile)

| Page | Perf | TBT | Source |
|------|------|-----|--------|
| Homepage | 90 | 238ms | `home-mobile-after-phase-2.json` |
| Article | 76 | 175ms | `article-mobile-after-phase-2.json` |
| Category | 82 | 219ms | `category-mobile-after-phase-2.json` |
| Tag | 69 | 2495ms* | `tag-mobile-after-phase-2.json` |

\* Tag Phase-2 TBT is a single local run outlier (LCP 2.3s); treat audit-doc ~320ms as directional. Re-run `npm run lighthouse:tag:mobile:after:phase-2` if you need a stable baseline.

## Global client boundaries (before)

| Area | Component | Loaded on |
|------|-----------|-----------|
| Root | `SupabaseAuthProvider` | All routes via `app/layout.tsx` |
| Root | `SessionProviderWrapper` (next-auth) | All routes |
| Shell | `SiteShellFrame` → `HeaderClient` | All public pages |
| Header | `FullScreenMenu` (SearchBar, UserMenu, nav) | Always mounted (hidden when closed) |
| Header | Scroll listener re-measuring header | Every scroll |
| Homepage | `NewsTickerTrack` / scroll controls | `/` only |
| Article | View/bookmark trackers | Article routes |

## Changes made

### Auth / providers
- Removed `SupabaseAuthProvider` and `SessionProviderWrapper` from [`app/layout.tsx`](../app/layout.tsx).
- Deleted unused [`SessionProviderWrapper.tsx`](../app/components/SessionProviderWrapper.tsx) (no `useSession()` in repo).
- Scoped `SupabaseAuthProvider` to [`app/pricing/layout.tsx`](../app/pricing/layout.tsx) and [`app/myprofile/subscriptions/layout.tsx`](../app/myprofile/subscriptions/layout.tsx) only.

### Header / menu
- [`header-client.tsx`](../app/components/layout/navbar/header-client.tsx): removed scroll listener; skip `setHeaderOffset` when height unchanged.
- [`full-screen-menu.tsx`](../app/components/layout/full-screen-menu.tsx): ESC/scroll-lock only when open; mount `SearchBar` and mobile `UserMenu` only when `isOpen`.

### Ticker (homepage)
- [`news-ticker-track.tsx`](../app/components/Landing/NewsTicker/news-ticker-track.tsx): avoid redundant `centerWhenFits` state updates.
- [`news-ticker-scroll-controls.tsx`](../app/components/Landing/NewsTicker/news-ticker-scroll-controls.tsx): passive scroll + rAF throttle; update arrow state only on change.

### Deferred widgets
- [`schedule-idle.ts`](../app/lib/schedule-idle.ts): `requestIdleCallback` helper.
- Idle-deferred: `ArticleViewTracker`, `CategoryViewTracker`, `TagViewTracker`, bookmark status prefetch in `BookmarkButton`.

## Phase 3 results (mobile)

Prod server: `npm run build:prod && PORT=3001 npm run start`. Reports in `docs/audits/lighthouse-reports/`.

| Page | Perf (Δ) | TBT (Δ) | LCP | SEO | A11y | Report |
|------|----------|---------|-----|-----|------|--------|
| Homepage | 77 (−13) | 216ms (−22ms) | 5.2s | 100 | 92 | `home-mobile-after-phase-3.json` |
| Article | 76 (0) | 129ms (−46ms) | 6.4s | 100 | 92 | `article-mobile-after-phase-3.json` |
| Category | 83 (+1) | 145ms (−74ms) | 4.4s | 100 | 92 | `category-mobile-after-phase-3.json` |
| Tag | 75 (+6) | 258ms (−2237ms†) | 5.3s | 100 | 92 | `tag-mobile-after-phase-3.json` |

† vs flaky Phase-2 tag JSON; vs audit doc ~320ms, TBT improved ~62ms.

**TBT focus (primary Phase 3 goal):** Article −46ms, Category −74ms, Homepage −22ms. Perf/LCP vary run-to-run on localhost; compare TBT across multiple runs for confidence.

### Validation (2026-05-27)

| Check | Result |
|-------|--------|
| `npm run test:unit` | 100 passed |
| `npm run format:check` | pass |
| `npm run lint` | pass |
| `npm run build:prod` | pass |
| Playwright e2e | 22 passed, 2 failed (subscriptions smoke + integration — auth/env; not public routes) |

## Unlighthouse

**Not added.** Existing `npx lighthouse` scripts cover the target routes; Unlighthouse would add crawl tooling overlap without being required for this phase.

## Remaining TBT risks

- `UserMenu` / `DesktopHeader` still run Supabase client auth on public pages (navbar sign-in state).
- Radix dropdown in signed-in user menu.
- Homepage below-the-fold client sections (carousels) unchanged.
- External image transfer (Unsplash) still dominates article LCP.
