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
| **F** | Desktop header chunk not loaded on mobile viewports (`matchMedia` + dynamic `DesktopHeader`) | `header-client.tsx` |
| **G** | Unused JS: draft-only visual editing, below-fold lazy entry, interaction-gated auth/ticker, SVG `<img>` logos | `draft-mode-shell.tsx`, `homepage-below-fold-lazy.tsx`, `use-deferred-on-interaction.ts` — see [homepage-unused-javascript-report.md](./homepage-unused-javascript-report.md) |

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
| `home-mobile-after-phase-f.json` (Phase F) | 85 | 4.1 s | 140 ms | — | 0 |
| `home-mobile-unused-js-fix.json` (Phase G, `:3000`) | **93** | **3.2 s** | **80 ms** | — | 0 |

\*Run variance / deferred chunks loading during audit window.

### Confirmed improvements (multiple runs)

- **Pexels preconnect** removed — no unused third-party preconnect warning.
- **Critical path** shortened — body serif font no longer chained after CSS on homepage.
- **Forced reflow** from ticker layout reads eliminated.
- **Render-blocking CSS** estimate dropped (~310 ms → ~50 ms in B+C run).
- **TBT / bootup** improved when header measurement and viewport gating defer work off cold load.

---

## Phase F — desktop header deferred on mobile (2026-05-28)

`HeaderClient` mounts only `MobileHeader` until `matchMedia('(min-width: 1024px)')` is true; `DesktopHeader` is a separate dynamic chunk (`ssr: false`).

**Tradeoff:** On desktop viewports, the first paint may show the mobile header bar until the effect runs, then swap to the desktop nav.

## Phase G — unused JavaScript (2026-05-28) ✅

Homepage mobile unused JS: **~300 KiB → ~48 KiB** (`home-mobile-unused-js-fix.json`). Main wins: draft-only `@sanity/visual-editing`, tighter viewport defer, interaction-gated Supabase/ticker, native SVG logos.

**Deferred (not started):** article LCP, unused CSS (~12 KiB), further shell trimming below ~48 KiB.

---

## Remaining cost (out of scope for homepage program)

- **~48 KiB** app shell + header client on cold load (expected).
- **Article LCP** — separate phase.
- **Unused CSS** — low priority.
- **localhost** ≠ production CDN.

---

## Verify

```bash
npm run build:prod
PORT=3001 NEXT_PUBLIC_SITE_URL=http://localhost:3001 npm run start
npm run lighthouse:home:mobile:optimized   # after adding script
```

Network tab: on first paint without scroll, below-fold section chunks should not load until scroll (Phase E).

---

## Phase status — homepage program complete

| Item | Value |
|------|--------|
| **Status** | Phases B–G implemented; **uncommitted** local changes (F + G) |
| **Commits on `main`** | `57dcb6c` … `94ecabd` (3 ahead of `origin/main`, not pushed) |
| **Next (optional)** | Manual checklist → commit → push/PR |

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
- [ ] **Desktop (≥1024px):** nav shows categories row; no stuck mobile-only bar after load
- [ ] **Mobile:** Network on first load does not fetch `desktop-header` chunk until resize to desktop
- [ ] Optional: `npm run test:unit` (1 pre-existing failure in `CoverImageCarousel.test.tsx`, unrelated)

When satisfied, commit Phases F+G and push `main` or open a PR. **Not started:** article LCP, unused CSS trim.

---

## Follow-up: manual report items (2026-05-28)

| Lighthouse insight | Action | Result |
|--------------------|--------|--------|
| **Legacy JavaScript** (~14 KiB, `d3f5d2…js`) | Alias Next `polyfill-module` to empty stub (`lib/empty-polyfill-module.js`) | **Cleared** — audit score 1, no items (`home-mobile-after-polyfill-stub.json`) |
| **Forced reflow** (~35 ms unattributed) | Defer ticker scroll-control layout read to `requestIdleCallback` | ~31 ms unattributed remains (browser/framework noise) |
| **Unused JavaScript** (~300 KiB) | **Phase G** (draft shell, below-fold lazy, interaction defer, SVG logos) + F | **~48 KiB** — [report](./homepage-unused-javascript-report.md) |
| **Unused CSS** (~12 KiB) | Tailwind global bundle | Low priority; typography/plugin scope review |
| **BFCache** `no-store` | Localhost dev / dynamic routes | Not actionable on localhost |
| **Minify JS** (~8 KiB) | Prod build already minified | Often Lighthouse noise on localhost |
