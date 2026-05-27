# Performance and SEO audit workflow

**Last updated:** Phase 6 (final hardening)  
**Purpose:** Repeatable local workflow for production builds, Lighthouse, manual SEO checks, and test validation.

Related phase docs:

- [Phases 0–2 baseline](./lighthouse-phase-0-1-2-baseline.md)
- [Phase 3 — global JS / TBT](./phase-3-global-js-tbt.md)
- [Phase 4 — post SSG/ISR](./phase-4-post-ssg-isr.md)
- [Phase 5 — news SEO polish](./phase-5-news-seo-polish.md)
- [Final program summary](./final-seo-performance-summary.md)

---

## 1. Environment setup

### Required files

- `.env.local` with Sanity read token, project ID, and other app secrets (see repo setup guide).
- For audits, set **`NEXT_PUBLIC_SITE_URL`** to match the origin you serve:

| Environment | `NEXT_PUBLIC_SITE_URL` |
|-------------|-------------------------|
| Local production audit (port 3001) | `http://localhost:3001` |
| Production | Your real public domain (e.g. `https://www.example.com`) |

Canonical URLs, Open Graph, JSON-LD, sitemap `loc`, and RSS links all derive from this value via `app/lib/seo/site-url.ts`.

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` **before** `npm run build:prod` and `npm run start`.

### Ports

| Port | Use |
|------|-----|
| **3001** | Local production `next start` for Lighthouse and curl SEO checks |
| **3000** | Default Playwright `baseURL` (`PLAYWRIGHT_TEST_BASE_URL` overrides) |
| **9324** | Playwright HTML report server |

E2E and Lighthouse intentionally use different ports unless you align them with `PLAYWRIGHT_TEST_BASE_URL`.

### Secrets (do not commit)

- `.env.local`, `.env`, `.dev.vars` (Cloudflare local secrets)
- `.wrangler/` (miniflare / wrangler local state)

---

## 2. Clean production server start

Do **not** assume a server is already running. Do **not** run Lighthouse against `next dev`.

```bash
# Kill stale prod server (no error if port is free)
lsof -ti :3001 | xargs kill -9 2>/dev/null || true

# Build and start (typegen + next build; skips prebuild format)
npm run build:prod && PORT=3001 NEXT_PUBLIC_SITE_URL=http://localhost:3001 npm run start
```

### Build note

`npm run build` runs `prebuild` → `format`, which can fail if `.open-next/` artifacts exist. **Use `npm run build:prod`** for audits.

### Default Lighthouse article slug

Scripts use:

`/post/cyber-agencies-flag-vpn-supply-chain-exposure-after-vendor-patch-delays`

If that post is removed from Sanity, update the `lighthouse:article:*` scripts in `package.json` or pick another published slug from `sitemap.xml`.

---

## 3. Lighthouse workflow

### When to run

After implementation changes and after `build:prod` + manual route checks pass. Run against the **production** server on port 3001.

### Routes to audit

| Route | Lighthouse script | Notes |
|-------|-------------------|--------|
| Homepage `/` | `lighthouse:home:mobile:final` | Primary final report |
| Article `/post/[slug]` | `lighthouse:article:mobile:final` | Primary final report |
| Category `/category/[slug]` | `lighthouse:category:mobile` | Optional spot-check |
| Tag `/tag/[slug]` | `lighthouse:tag:mobile` | Optional spot-check |
| Opinion `/opinion` | Manual URL | Index listing |
| Analysis `/analysis` | Manual URL | Index listing |
| Search `/search?q=news` | Manual URL | Expect noindex |
| Author `/author/[slug]` | Manual URL | Person JSON-LD |
| `/feed.xml` | **curl**, not Lighthouse | RSS validation |

### Final reports (canonical for Phase 6+)

| File | Script |
|------|--------|
| `docs/audits/lighthouse-reports/home-mobile-final.json` | `npm run lighthouse:home:mobile:final` |
| `docs/audits/lighthouse-reports/article-mobile-final.json` | `npm run lighthouse:article:mobile:final` |
| Both | `npm run lighthouse:mobile:final` |

Historical phase comparisons: `*-after-phase-2.json` … `*-after-phase-5.json`.

JSON reports are **gitignored** (local artifacts only).

### Commands

```bash
# Server must be running on :3001 first (see section 2)
npm run lighthouse:mobile:final
```

Uses `npx lighthouse` (no global install, no npm devDependency).

### Interpretation

- **SEO** on homepage and article should stay **100** when metadata is correct.
- **LCP** and **TBT** on `localhost` are noisy (Unsplash heroes, throttling, background processes). A single bad run is not necessarily a regression—rerun once before investigating.
- Phase 6 does not target performance refactors; large perf drops after Phase 6-only doc/config changes warrant a rerun, not immediate optimization work.

---

## 4. Manual SEO checks (curl / browser)

Replace `{slug}` / `{id}` with values from `sitemap.xml` or Sanity.

```bash
BASE=http://localhost:3001

# Infrastructure
curl -s "$BASE/robots.txt"
curl -s "$BASE/sitemap.xml" | head -40
curl -s "$BASE/news-sitemap.xml" | head -20
curl -sI "$BASE/feed.xml" | grep -i content-type
curl -s "$BASE/feed.xml" | head -30

# No disallowed URL shapes in discovery surfaces
curl -s "$BASE/sitemap.xml" | grep -E 'with-id|\?id=' && echo FAIL || echo OK
curl -s "$BASE/feed.xml" | grep -E 'with-id|\?id=' && echo FAIL || echo OK

# Public pages (expect 200)
curl -o /dev/null -w '%{http_code}\n' "$BASE/"
curl -o /dev/null -w '%{http_code}\n' "$BASE/post/{slug}"
curl -o /dev/null -w '%{http_code}\n' "$BASE/post/{slug}?id={sanityDocumentId}"
curl -o /dev/null -w '%{http_code}\n' "$BASE/analysis/{slug}"
curl -o /dev/null -w '%{http_code}\n' "$BASE/opinion/{slug}"
curl -o /dev/null -w '%{http_code}\n' "$BASE/sponsored/{slug}"
curl -o /dev/null -w '%{http_code}\n' "$BASE/author/{authorSlug}"

# JSON-LD (homepage)
curl -s "$BASE/" | grep -E 'NewsMediaOrganization|WebSite'

# Robots meta (sponsored / search)
curl -s "$BASE/sponsored/{slug}" | grep -i 'robots'
curl -s "$BASE/search?q=news" | grep -i 'robots'

# Canonical path-only on article (no ?id= in link rel=canonical)
curl -s "$BASE/post/{slug}" | grep -i canonical
```

### Expected SEO behavior

| Surface | Policy |
|---------|--------|
| Published article | `index, follow` |
| Draft preview | `noindex, nofollow` (when draft mode enabled) |
| Sponsored | `noindex, follow` |
| Search | `noindex, follow` (utility) |
| `sitemap.xml` | Canonical path-only URLs; includes authors with published work |
| `news-sitemap.xml` | **post + analysis** only, 48h window; no opinion |
| `feed.xml` | **post + opinion + analysis**; no sponsored; no drafts |
| `?id=` compatibility | `/post/[slug]?id=…` returns 200 via proxy rewrite; browser URL unchanged |
| Sitemap / feed / canonical | No `?id=` URLs; no `/with-id/` URLs |

---

## 5. Testing workflow

Run **once** after Phase 6 implementation (not after every small doc edit).

```bash
npm run format:check
npm run lint
# If ESLint OOM:
NODE_OPTIONS=--max-old-space-size=8192 npm run lint

npm run test:unit
npm run typegen
npm run build:prod
npm run test:e2e
```

### Playwright HTML report

```bash
lsof -ti :9324 | xargs kill -9 2>/dev/null || true
npx playwright show-report --port 9324
```

Open http://localhost:9324 in the browser and review failures.

### Known pre-existing E2E failures

These specs require auth/env under `/myprofile/subscriptions`:

- `tests/smoke/subscriptions.smoke.spec.ts`
- `tests/integration/subscriptions.integration.spec.ts`

Failures here are **not** public SEO/performance regressions unless Phase 6 changed subscription or auth product code. Do not block Phase 6 completion on these alone.

Public route, article, feed, sitemap, author, nav, or metadata E2E failures **must** be fixed.

---

## 6. Tooling reference

| Command | Purpose |
|---------|---------|
| `npm run format:check` | Biome format + Tailwind class sort lint |
| `npm run format` | Write format fixes |
| `npm run lint` | ESLint (Next core-web-vitals) |
| `npm run test:unit` | Vitest unit tests |
| `npm run typegen` | Sanity schema extract + typegen |
| `npm run build:prod` | Production build for audits |
| `npm run test:e2e` | Playwright chromium (smoke + integration) |

### Biome / generated artifacts

Biome and ESLint ignore:

- `.next/`, `.open-next/`, `.wrangler/`
- `playwright-report/`, `test-results/`, `coverage/`
- `docs/audits/lighthouse-reports/**`
- `sanity.types.ts`, `schema.json`

Formatting uses **Biome only** — do not add Prettier.

---

## 7. Unlighthouse decision

**Unlighthouse was evaluated and not added.**

Reason: route-specific `npx lighthouse` scripts in `package.json` already cover the audited surfaces (home, article, category, tag) with stable, repeatable output paths. Full-site crawl audits would add tooling overlap without changing the current phase-gated workflow.

Revisit only if the team wants automated multi-route crawls outside CI. If added later, keep it **optional** and **outside CI**.

---

## 8. Quick checklist (release / audit sign-off)

- [ ] `build:prod` shows `● /post/[slug]` (SSG/ISR), not `ƒ` for slug-only route
- [ ] `format:check`, `lint`, `test:unit`, `typegen` pass
- [ ] `test:e2e` run; subscription failures classified if present
- [ ] Manual curl: robots, sitemaps, feed, no `with-id`/`?id=` in discovery
- [ ] `lighthouse:mobile:final` saved; home/article SEO 100
- [ ] Update [final-seo-performance-summary.md](./final-seo-performance-summary.md) with latest metrics
