# Homepage unused JavaScript — mitigation report (2026-05-28)

**Goal:** Reduce Lighthouse “Reduce unused JavaScript” on mobile `/`.  
**Measured on:** Production build, `http://localhost:3000`, mobile form factor.

---

## Results

| Metric | Before (your report) | After (this pass) |
|--------|----------------------|-------------------|
| **Unused JS (est.)** | **300 KiB** | **48 KiB** |
| Performance score | — | **93** |
| LCP | 3.8 s | 3.2 s |
| TBT | 160 ms | 80 ms |

Report file: `docs/audits/lighthouse-reports/home-mobile-unused-js-fix.json`

### Before — top wasted chunks

| Chunk | Est. waste |
|-------|------------|
| `6346c3b4763fac97.js` | 101 KiB |
| `d34dad6a8e0ced91.js` | 65 KiB |
| `49b216f3a40bd281.js` | 38 KiB |
| `9c801857e14c24a1.js` | 37 KiB |
| `421becf6e58182e2.js` | 37 KiB |
| `b056a15eec95302c.js` | 22 KiB |

### After — top wasted chunks

| Chunk | Est. waste |
|-------|------------|
| `b056a15eec95302c.js` | 27 KiB (app shell) |
| `7eea719e7f62aeb2.js` | 21 KiB (header client) |

`@sanity/visual-editing`, Supabase, and large below-fold section graphs no longer appear in the initial download set for a cold homepage load.

---

## Root causes (bundle analysis)

1. **`VisualEditingProvider` statically imported in `app/layout.tsx`**  
   Even when draft mode was off, webpack linked `@sanity/visual-editing` + stega into shared client chunks loaded on every page (`421bec…` contained `HeaderClient` + `visual-editing`).

2. **Below-fold `rootMargin: 400px`**  
   On mobile Lighthouse, `IntersectionObserver` fired immediately and prefetched Second/Third/Fourth/Sixth section chunks (~150+ KiB) without user scroll.

3. **`homepage-below-fold.tsx` imported directly from `page.tsx`**  
   Pulled the full below-fold dynamic-import graph into the homepage client boundary at first paint.

4. **Supabase + ticker controls on idle**  
   `useDeferredIdle` still ran during the Lighthouse trace, downloading `9c801…` (~37 KiB unused).

5. **`next/image` in navbar/footer for static SVG logos**  
   Contributed to the large shared image/runtime chunk (`6346…`) on every route.

---

## Changes made

| Area | File(s) | What |
|------|---------|------|
| Draft-only Sanity UI | `draft-mode-shell.tsx`, `layout.tsx` | Dynamic `VisualEditingProvider` + `AlertBanner` only when draft mode is on |
| Below-fold deferral | `homepage-below-fold-lazy.tsx`, `page.tsx` | Thin client entry; heavy module loads only near viewport |
| Viewport gate | `defer-until-near-viewport.tsx` | `rootMargin` **400px → 120px** (no mobile prefetch of far sections) |
| Auth | `use-deferred-on-interaction.ts`, `user-menu-slot.tsx`, `user-menu.tsx` | Supabase/`UserMenu` only after pointer/focus on avatar area |
| Ticker | `news-ticker-shell.tsx`, `NewsTicker.tsx` | Scroll controls + lucide only after interaction with ticker |
| Logos | `logo.tsx`, `footer.tsx` | Native `<img>` for SVG (no `next/image` client in header/footer) |
| Desktop header (prior) | `header-client.tsx` | `DesktopHeader` dynamic + `matchMedia` (Phase F) |

---

## What remains (~48 KiB)

- **App shell** (`b056…`) — React/Next router baseline; expected on all App Router pages.
- **Header client** (`7eea…`) — Mobile nav, menu state, lazy `FullScreenMenu`; required for global chrome.

Further reduction would need a static server header + deferred interactive shell (CLS/SEO tradeoff) or route-level code splitting beyond the homepage.

---

## Verify locally

```bash
npm run build:prod
PORT=3000 NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run start
npx lighthouse http://localhost:3000/ --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance --output=json --output-path=docs/audits/lighthouse-reports/home-mobile-unused-js-fix.json
```

Network tab (mobile, no scroll): confirm no `visual-editing`, `supabase`, or below-fold section chunks (`secondSection`, `thirdSection`, `fourthSection`, `fifthSection`) until interaction or scroll.

---

## Not in scope

- Unused CSS (~12 KiB)
- BFCache / minify warnings on localhost
- Article route bundles
