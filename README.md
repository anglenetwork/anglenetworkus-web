# Next.js & Sanity News Blog

A modern, high-performance news website built with Next.js 15 and Sanity CMS, featuring a comprehensive content management system and responsive design optimized for news publishing.

## 🏗️ Site Structure

### Frontend Architecture

```
app/
├── (sanity)/                    # Sanity Studio routes
│   └── studio/[[...tool]]/     # Content management interface
├── api/                        # API endpoints
│   ├── draft-mode/enable/      # Draft mode functionality
│   └── search/                 # Search API
├── category/[slug]/            # Dynamic category pages
├── components/                 # Reusable UI components
│   ├── Landing/               # Homepage section components
│   ├── PostPage/              # Individual post components
│   ├── layout/                # Layout and navigation
│   └── ui/                    # Base UI components
├── post/[slug]/               # Dynamic post pages
├── search/                    # Search results page
└── globals.css               # Global styles
```

### Content Management System

```
sanity/
├── schemas/
│   ├── documents/            # Content type definitions
│   │   ├── post.ts          # Article schema
│   │   ├── category.ts      # Category schema
│   │   ├── author.ts        # Author profiles
│   │   ├── topic.ts         # Topic/entity schema
│   │   ├── tag.ts           # Tagging system
│   │   └── comment.ts       # Comment system
│   ├── objects/             # Reusable field types
│   │   ├── blockContent.ts  # Rich text content
│   │   └── seo.ts           # SEO metadata
│   └── singletons/          # Site-wide settings
└── lib/                     # Sanity configuration
```

### Sanity Studio — editorial desk

The Studio desk (`sanity/structure/editorialDesk.ts`) is organized for the article family and supporting docs:

1. **Posts** — all/draft/scheduled/published, homepage rails (Main Headline, Frontline, Right Rail, Just In), breaking/developing, featured, **Needs Editorial QA** (incomplete essentials).
2. **Opinion** — all/draft/published, by format (Op-Ed, Editorial, Column, Commentary), **Needs Editorial QA**.
3. **Analysis** — all/draft/published, **Needs Editorial QA**.
4. **Sponsored** — all/draft/published, **Needs Sponsor Disclosure Review** (attribution/disclosure gaps).
5. **Taxonomy** — categories, tags.
6. **People** — authors.
7. **Site Settings** — singleton settings document.
8. **Legacy / Utilities** — `topic` and any other types not in the main flow.

**Article types (when to use which):**

- **Post** — Standard reported news for the main editorial news flow.
- **Opinion** — Viewpoint or commentary with a clearly attributable author and opinion format.
- **Analysis** — Explanatory or interpretive journalism grounded in reporting and context, distinct from opinion.
- **Sponsored** — Paid or partner-published content with clear sponsor attribution and disclosure.

**Not in this desk:** A Dashboard / “Editorial Home” landing pane (would need a custom plugin or document type; intentionally skipped). **Document badges** (Draft/Published/Scheduled, etc.) are not enabled — list subtitles and filters carry that signal instead, to avoid brittle Studio API coupling. **Vision** (GROQ) remains in the Studio toolbar when `NODE_ENV=development`. **Live metrics** are not queried inside Studio; rankings use **Supabase** operationally — legacy Sanity `views*` fields on posts are read-only and labeled as transitional.

## 📰 Website Sections

### Homepage Layout

The homepage features a sophisticated multi-section layout designed for news consumption:

#### 1. **Main First Section** - Hero & Latest News

- **Left Column**: Latest news feed with article previews
- **Center Column**: Featured main story with large image and headline
- **Right Column**: Side stories and most read articles
- **Mobile**: Responsive single-column layout

#### 2. **Second Section** - Breaking News

- Trending topics and breaking news alerts
- Quick access to urgent stories
- Social media integration

#### 3. **Highlights Stories** - Multimedia Content

- Video content player with thumbnail navigation
- Interactive video selection
- Featured multimedia stories

#### 4. **Third Section** - Politics Category

- Dedicated politics news section
- Most read articles sidebar
- Category-specific content organization

#### 5. **Fourth Section** - US News

- US-focused news content
- Video content sidebar
- Three-column responsive layout

#### 6. **Sixth Section** - International News

- Global news coverage
- Featured international articles
- Multi-column article grid

#### 7. **Seventh Section** - Additional Content

- Extended international coverage
- Related article recommendations
- Content continuation

### Content Pages

#### **Individual Post Pages**

- Full article content with rich text rendering
- Author information and publication details
- Related articles and latest news sidebar
- Social sharing functionality
- SEO-optimized metadata

#### **Category Pages**

- Dynamic category-specific content
- Filtered article listings
- Category-specific navigation
- Breadcrumb navigation

#### **Search Results**

- Editorial search across published `post`, `opinion`, and `analysis` documents (sponsored is excluded)
- URL-driven filters: `q`, `sort` (`relevance` | `newest`), `type` (`all` | `post` | `opinion` | `analysis`), `page`
- Server-side pagination via `GET /api/search` (no live tag/topic bucket branches in the UI)

## 🛠️ Tech Stack

### Frontend Technologies

- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript**: Type-safe development with full type coverage
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for consistent UI
- **Lucide React**: Modern icon library
- **Portable Text**: Rich text rendering for Sanity content

### Content Management

- **Sanity CMS**: Headless content management system
- **Sanity Studio**: Native content authoring interface
- **GROQ**: Powerful query language for content retrieval
- **Sanity TypeGen**: Automatic TypeScript type generation
- **Sanity AI Assist**: AI-powered content assistance

### Development & Build Tools

- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing
- **Vercel Speed Insights**: Performance monitoring

### Performance & Optimization

- **Static Site Generation**: Pre-built pages for optimal loading
- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic bundle optimization
- **Incremental Static Revalidation**: Content updates without full rebuilds
- **Edge Functions**: Serverless API endpoints for global performance

### Content Types & Schema

#### **Posts**

- Rich text content with Portable Text
- Cover images with hotspot support
- Category and tag associations
- Author attribution
- SEO metadata
- Publication scheduling

#### **Categories**

- Hierarchical category structure
- Custom colors and emojis
- Hero images and descriptions
- Navigation titles

#### **Authors**

- Profile information and bios
- Social media links
- Role and title definitions
- Profile images with alt text

#### **Topics & Tags**

- Entity-based topic system (people, organizations, places, events)
- Flexible tagging system
- Cross-content associations

## 🎨 Design System

### Typography

- Custom font stack optimized for readability
- Clear heading hierarchy (H1-H6)
- Optimized line heights and spacing
- Responsive font sizing

### Layout

- **Mobile-First**: Responsive design starting from mobile
- **Grid System**: CSS Grid and Flexbox for complex layouts
- **Breakpoints**: Tailwind CSS responsive utilities
- **Spacing**: Consistent spacing scale throughout

### Color Scheme

- News-focused color palette
- Semantic color usage (success, warning, error)
- High contrast for accessibility
- Category-specific color coding

### Components

- **Cards**: Article preview cards with hover effects
- **Navigation**: Responsive header with category navigation
- **Forms**: Accessible search and contact forms
- **Modals**: Overlay components for interactions
- **Loading States**: Skeleton loading for better UX

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px (single column)
- **Tablet**: 768px - 1024px (two-column grid)
- **Desktop**: 1024px+ (multi-column layout)

### Layout Adaptations

- **Mobile**: Stacked content with touch-optimized interactions
- **Tablet**: Two-column layout with improved spacing
- **Desktop**: Full multi-column layout with sidebar content

## 🔍 Search (Stage 6)

### API contract — `GET /api/search`

Query parameters:

| Param | Values | Default |
| --- | --- | --- |
| `q` | Free text | (required for results) |
| `sort` | `relevance`, `newest` | `relevance` |
| `type` | `all`, `post`, `opinion`, `analysis` | `all` |
| `page` | Integer ≥ 1 | `1` |

JSON response shape:

```json
{
  "query": "",
  "sort": "relevance",
  "type": "all",
  "page": 1,
  "pageSize": 10,
  "total": 0,
  "totalPages": 0,
  "results": []
}
```

Each `results[]` item is a normalized **article-family card** (same shape as editorial rails / listings). **Sponsored** documents are never returned. There are **no** separate tag/topic buckets in the live search UI; taxonomy is reached via `/tag/[slug]` and `/category/[slug]`.

Implementation:

- **UI** — `app/search/SearchResults.tsx` reads `q`, `sort`, `type`, `page` from the URL and calls `/api/search`.
- **Route** — `app/api/search/route.ts` picks the GROQ list + count queries from `sanity/lib/queries.ts` (`searchEditorial*`).
- **Tokenization** — Whitespace-split terms; each term gets a prefix wildcard for GROQ `match` filters.

## 🧭 SEO & publication policy (Stage 7)

Centralized helpers live under `app/lib/seo/` (site URL from `NEXT_PUBLIC_SITE_URL`, robots, canonical URLs, shared metadata builders, JSON-LD builders). The **main sitemap** is `app/sitemap.xml`; a **news sitemap** for recent `post` + `analysis` (48h window) is at `app/news-sitemap.xml`. Robots: `app/robots.txt`.

## Article metrics and ranking (Stage 8 / Stage 9)

**Architecture (summary):** View counts and ranking windows (`views_all`, rolling 7d / 30d from daily buckets) live in **Supabase** (`article_metrics_daily`, `article_metrics_totals`, views `article_metrics_rankings*`, RPC `increment_article_view`). Sanity is not updated when a page view is recorded. Ranking rules for “most read” surfaces are centralized in `app/lib/article-family/ranking-policy.ts`; **sponsored** is excluded from editorial ranking by default.

**Application:** Server helpers in `app/lib/article-family/metrics.ts` read `article_metrics_rankings` and expose ranking helpers. Article pages send `POST /api/article-view` from `ArticleViewTracker` with a **30-minute** browser dedupe (`localStorage` key `article-viewed:${articleId}`). **Playwright and automation** are excluded via `navigator.webdriver === true` (no view requests).

**Legacy Sanity fields:** `viewsAll` / `views30d` / `views7d` remain in the schema as **transitional only**; they do not drive application ranking or live metrics (Supabase is the operational source of truth).

**Migration** — Apply `supabase-migrations/20260327_article_metrics.sql` to your Supabase project before backfill or verification.

**Commands:**

```bash
npm run backfill:article-metrics
npm run verify:article-metrics
```

Backfill seeds `article_metrics_totals` from published article-family documents (legacy `viewsAll` on `post` only as an initial `views_all` when present). It does not write daily history or write back to Sanity. Verification is read-only and exits non-zero if readiness checks fail.

**Readiness:** `checkArticleMetricsReadiness()` in `app/lib/article-family/metrics-readiness.ts` probes tables, the rankings view, and the RPC without mutating data.

**Diagnostics (internal JSON):** `GET /api/internal/article-metrics-status` — allowed in **development** without auth; in production, send header `x-internal-article-metrics-secret` matching `INTERNAL_ARTICLE_METRICS_SECRET` in the environment.

**Unit tests:** `npm run test:unit` (Vitest).

## Category page: Most Read

The Category route loads published **post** and **analysis** documents for the category from Sanity, joins **Supabase** metrics for those document IDs, and sorts by 7-day views (then `last_viewed_at`, then `publishedAt`). The UI still shows the top five; layout is unchanged.

### Navigation Structure

- **Header Navigation**: Main category navigation
- **Breadcrumbs**: Clear navigation hierarchy
- **Related Content**: Smart content recommendations
- **Footer Links**: Additional navigation and information

## Lint and Playwright

### ESLint

- Run `npm run lint` — uses the **ESLint CLI** directly (flat config in `eslint.config.mjs`), not `next lint`.
- Auto-fix where safe: `npm run lint:fix`.

### Playwright (E2E)

**Primary gate (stabilization):** Chromium runs the full intended suite (smoke + integration). Firefox and WebKit run **smoke only** during cross-browser stabilization; use `test:e2e:all` for the full matrix.

| Script | Purpose |
|--------|---------|
| `npm run test:e2e` | **Chromium** — default validation gate (smoke + integration tests). |
| `npm run test:e2e:chromium` | Same as `test:e2e`. |
| `npm run test:e2e:firefox` | Firefox — smoke tests only (`--max-failures=1`). |
| `npm run test:e2e:webkit` | WebKit — smoke tests only (`--max-failures=1`). |
| `npm run test:e2e:all` | All browser projects (Chromium + Firefox + WebKit per `playwright.config.ts`). |
| `npm run test:unit` | Vitest unit tests (metrics, API routes, components). |

**Test layout:**

- `tests/smoke/**` — Cross-browser UI smoke (sign-in shell, protected-route gate, subscriptions shell). Run on Chromium, Firefox, and WebKit.
- `tests/smoke/zz-logout.spec.ts` — Logout flow runs **last** (file name) so `signOut` does not invalidate the shared Playwright user session mid-suite.
- `tests/integration/**` — Heavier flows (Stripe, OAuth redirect, profile modal, etc.). **Chromium only** for now (via `testMatch` on projects).

**Config:** `playwright.config.ts` — `trace: "on-first-retry"`, `screenshot: "only-on-failure"`, `video: "retain-on-failure"`, HTML reporter.

Global setup (`tests/global-setup.ts`) provisions a dedicated test user with the **Supabase service role** (admin API), then signs in with the password using the **publishable** key, and saves `playwright/.auth/state.json` (reusable across Chromium, Firefox, and WebKit). Configure these in `.env.local` (do not commit secrets):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; used to create/update the test user |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public key; used for `signInWithPassword` after provisioning |
| `PLAYWRIGHT_TEST_EMAIL` | Email for the test user |
| `PLAYWRIGHT_TEST_PASSWORD` | Password for the test user |

After a run, the HTML report is written to `playwright-report/index.html` (open with `npx playwright show-report`).

---

_Built with modern web technologies for optimal performance, accessibility, and user experience._
