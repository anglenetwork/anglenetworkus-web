# Homepage performance — Phases B through E (2026-05-28)

**Context:** Lighthouse mobile audit on `/` identified render-blocking CSS, font critical path, unused preconnect, forced reflow, and large initial JS.  
**Measure on:** `npm run build:prod` + `PORT=3001 NEXT_PUBLIC_SITE_URL=http://localhost:3001 npm run start` (not `next dev`).  
**Chunk map:** [homepage-chunk-map.md](./homepage-chunk-map.md)

---

## Phase summary

| Phase | Changes | Primary files |
|-------|---------|---------------|
| **B** | Remove unused Pexels `preconnect`; `dns-prefetch` for Sanity/Wikimedia | `app/layout.tsx` |
| **C** | Newsreader only on article routes; preload Libre Franklin; server news ticker (no `scrollWidth` JS) | `app/lib/fonts/*`, article layouts, `news-ticker-track.tsx` |
| **D** | Server `SiteShellFrame`; skip shell on `/studio`; server Just In column; lazy carousel; below-fold `ssr: false` | `site-shell-frame.tsx`, `proxy.ts`, `left-column-landing.tsx`, `homepage-below-fold.tsx` |
| **D+** | Lazy `UserMenu` + `BecomeProCta`; Supabase only after idle | `user-menu-slot.tsx`, `become-pro-cta.tsx`, `user-menu.tsx` |
| **D++** | Header `ResizeObserver` only when menu open | `header-client.tsx` |
| **E** | Below-fold chunks gated by `DeferUntilNearViewport`; opinion rail stays server HTML | `defer-until-near-viewport.tsx`, `page.tsx` |

---

## Lighthouse comparison (mobile perf, localhost :3001)

Scores vary between runs; use trends, not single numbers.

| Report | Perf | LCP | TBT | Bootup | Forced reflow |
|--------|------|-----|-----|--------|---------------|
| `home-mobile-final.json` (pre B–E program) | 79 | 5.2 s | 162 ms | 0.7 s | 1 source |
| `home-mobile-after-perf-fix.json` (B+C) | 67* | 8.0 s* | 270 ms | 1.1 s | 0 |
| `home-mobile-after-phase-d.json` | 79 | 5.1 s | 200 ms | 0.9 s | 0 |
| `home-mobile-after-phase-d-plus.json` | 80 | 3.8 s | 370 ms* | 1.4 s* | 1 |
| `home-mobile-after-header-defer.json` | 82 | 4.5 s | 190 ms | 0.9 s | 0 |
| `home-mobile-after-viewport-gate.json` | 82–88 | 3.8–4.5 s | 110–180 ms | 0.6–0.8 s | 0 |
| Post-repro verification (2026-05-28) | **88** | **3.8 s** | **110 ms** | **0.6 s** | 0 |

\*Run variance / deferred chunks loading during audit window.

### Confirmed improvements (multiple runs)

- **Pexels preconnect** removed — no unused third-party preconnect warning.
- **Critical path** shortened — body serif font no longer chained after CSS on homepage.
- **Forced reflow** from ticker layout reads eliminated.
- **Render-blocking CSS** estimate dropped (~310 ms → ~50 ms in B+C run).
- **TBT / bootup** improved when header measurement and viewport gating defer work off cold load.

---

## Remaining cost (not addressed here)

- Shared **`next/image`** + **`HeaderClient`** chunks (`6346…`, `3cd8…`, `49b21…`) on every public page.
- **Article LCP** dominated by hero image hosts (separate from homepage).
- **localhost** scores ≠ production CDN / HTTP3 / edge caching.

---

## Verify

```bash
npm run build:prod
PORT=3001 NEXT_PUBLIC_SITE_URL=http://localhost:3001 npm run start
npm run lighthouse:home:mobile:optimized   # after adding script
```

Network tab: on first paint without scroll, below-fold section chunks should not load until scroll (Phase E).

---

## Phase status (paused for manual verification)

| Item | Value |
|------|--------|
| **Status** | Complete — committed locally, **not pushed** |
| **Commit** | `57dcb6c` — homepage performance (Phases B–E) |
| **Branch** | `main` (ahead of `origin/main` by 1) |

### Manual verification checklist

Use **production** build on port **3001**, not `next dev` on `:3000`. Use Incognito with extensions disabled for Lighthouse.

- [ ] `npm run build:prod` succeeds
- [ ] Homepage loads: hero, ticker, opinion rail, no console errors
- [ ] Full-screen menu opens and aligns under sticky header
- [ ] Sign-in / avatar appears after brief skeleton (lazy auth)
- [ ] Scroll: below-fold sections load (skeletons → content); Network shows section chunks only after scroll
- [ ] Article page (`/post/...`): body uses serif (`font-body`); homepage does not download extra serif on first load (Network → filter `woff2`)
- [ ] `/studio` loads without site header/footer
- [ ] `npm run lighthouse:home:mobile:optimized` — compare to prior baseline (`home-mobile-final.json` if present locally)
- [ ] Optional: `npm run test:unit` (1 pre-existing failure in `CoverImageCarousel.test.tsx`, unrelated)

When satisfied, push `main` or open a PR. Next phase (not started): article LCP / bundle analysis of `HeaderClient` + `next/image`.
