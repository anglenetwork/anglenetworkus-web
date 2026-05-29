# Homepage JS chunk map (post Phase B–D+ optimizations)

Last updated: 2026-05-28. Chunk hashes change each `npm run build:prod`; use RSC flight manifests under `.next/server/app/index.segments/` to re-map after deploy.

## Architecture changes (summary)

| Area | Before | After |
|------|--------|-------|
| Fonts | Both families on every route | Sans only in root; Newsreader on `post` / `opinion/[slug]` / `analysis/[slug]` |
| Pexels preconnect | Global, unused | Removed |
| News ticker | Client layout reads (`scrollWidth`) | Server track (`mx-auto` + `w-max`); scroll controls lazy |
| Just In column | Full client column + carousel | Server column; carousel chunk only when 2+ images |
| Below-fold sections | `dynamic(ssr: true)` | `HomepageBelowFoldTop/Bottom`, `ssr: false`, viewport-gated via `DeferUntilNearViewport` |
| Editorial opinion rail | Inside client below-fold | **Server** `EditorialRailsSection` between gated blocks (crawlable HTML) |
| Site shell | Client frame + `usePathname` | Server frame; `/studio` skips shell via `x-pathname` in proxy |
| User menu / Become Pro | Eager in header bundle | Lazy chunks + idle-gated Supabase |
| Header measure | ResizeObserver on every page load | Only while full-screen menu is open |

## Typical Lighthouse chunks (mobile homepage, prod)

| Chunk role | Notes |
|------------|--------|
| Shared runtime (`6346…`, `3cd8…`) | `HeaderClient`, `next/image`, hydration — still largest “unused” in LH |
| Image pipeline (`49b21…`) | LCP hero via `ImageRenderer` in server `centerColumnLanding` |
| News ticker / hero (`9c801…`) | Should shrink after Just In server split; re-verify per build |
| Menu (`cb1bb…` or similar) | `FullScreenMenu` — loads only when menu opens |
| Below-fold (`6be83…`, `ea311…`, etc.) | Second/Sixth/Third/Fifth sections — after first paint |
| Auth (`user-menu` lazy) | Supabase + Radix dropdown — idle + separate chunk |

## Reports

| Run | File |
|-----|------|
| Baseline (final program) | `lighthouse-reports/home-mobile-final.json` |
| After fonts / ticker / preconnect | `home-mobile-after-perf-fix.json` |
| After Phase D (shell, below-fold, Just In) | `home-mobile-after-phase-d.json` |
| After Phase D+ (lazy auth) | `home-mobile-after-phase-d-plus.json` |
| After header measure defer | `home-mobile-after-header-defer.json` |
| After viewport-gated below-fold | `home-mobile-after-viewport-gate.json` |

Run: `npm run build:prod && PORT=3001 NEXT_PUBLIC_SITE_URL=http://localhost:3001 npm run start`, then `npm run lighthouse:home:mobile` (or scripts in `package.json`).

## Remaining opportunities

- Further split `HeaderClient` graph (categories are lightweight; `next/image` is the main cost on hero).
- Article LCP and external image hosts dominate article routes (separate from homepage).
- Re-enable `PromoSection` with `dns-prefetch` only (no global preconnect).
