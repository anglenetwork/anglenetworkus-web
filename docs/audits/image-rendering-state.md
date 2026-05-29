# Image Rendering State Audit

**Date:** 2026-05-27  
**Scope:** Next.js frontend (`app/`), Sanity CMS (`sanity/`), shared utilities (`lib/`), seed scripts (`scripts/`). Build artifacts (`.open-next/`) excluded.  
**Method:** Static code review only—no runtime CMS content inspection.

---

## Executive Summary

The application has a **coherent editorial image model in Sanity** (`coverMedia`, `galleryImageItem`, `editorialImage`) with shared fields for asset/external sources, alt text, caption, credit, and internal license notes. The frontend funnels most CMS images through **`getCoverImage` / `buildArticleImageData`** and renders them via a shared **`ImageRenderer`** wrapper around **`next/image`**.

**Article detail pages** are the strongest area: cover and gallery carousels, Portable Text body images, and **`ArticleCaption`** display caption and credit lines. **Listing and homepage surfaces** reuse cover resolution but largely **omit visible photo credits** (much of that UI is commented out), and **`licenseOrRights` is never fetched or shown** on the public site.

Image optimization is **enabled** in [`next.config.ts`](../next.config.ts) for a small set of remote hosts. Wikimedia images are deliberately **unoptimized** (thumbnail URLs + `unoptimized` flag) to avoid rate limits. Many other external URLs bypass Next.js optimization entirely. **Wire-service domains (AP, Reuters, Getty, Imago) are not configured.**

**Assessment:** The system is **partially ready** for a news website—strong CMS and article-page foundations, but listing attribution, licensing display, config/whitelist consistency, and some accessibility gaps need work before production editorial standards are met.

---

## Key Findings

1. **Central pattern:** `ImageRenderer` ([`app/components/ui/image-renderer.tsx`](../app/components/ui/image-renderer.tsx)) wraps `next/image` for ~40+ call sites; direct `next/image` remains in ~12 layout/ad/video files; one intentional plain `<img>` in bookmarks.
2. **Sanity schema supports asset + external URL** with validation for alt, credit, and license in Studio—not fully enforced at publish time for attribution fields.
3. **`licenseOrRights` is CMS-only:** projected in GROQ nowhere; frontend cannot display rights even if editors enter them.
4. **Credits on listings:** `formatImageCredit` is used in data prep but **credit UI is commented out** on homepage/category modules; `ExcerptCreditCaption` helper exists but is **unused outside tests**.
5. **`FeatureHero` uses `alt=""`** for category featured images—accessibility regression ([`app/components/CategoryPage/FeatureHero.tsx`](../app/components/CategoryPage/FeatureHero.tsx)).
6. **Default alt fallback** is a generic site tagline, not article-specific ([`sanity/lib/utils.ts`](../sanity/lib/utils.ts) `DEFAULT_ALT_TEXT`).
7. **Whitelist drift:** `next.config.ts`, `isWhitelistedDomain()` in `utils.ts`, and `isWhitelistedExternalImage()` in `media-utils.ts` disagree on which hosts are optimized.
8. **Cover/gallery carousels** mount **all slides in the DOM** (opacity toggle)—potential bandwidth cost on multi-image articles.
9. **No `placeholder="blur"`** anywhere; no blur data URLs for LCP images.
10. **Seeded articles** follow current `coverMedia` shape with external Unsplash URLs and full attribution fields ([`scripts/seed-articles.mjs`](../scripts/seed-articles.mjs)).

---

## Image Rendering Inventory

| Area | File | Component | Source Type | Uses next/image? | Alt? | Caption/Credit? | Notes |
|------|------|-----------|-------------|------------------|------|-----------------|-------|
| **Shared wrapper** | `app/components/ui/image-renderer.tsx` | `ImageRenderer` | Any URL passed in | Yes | Prop required | N/A | Forces `unoptimized` for `upload.wikimedia.org`; optional `fill`, `sizes`, `priority`, `quality` |
| **Cover URL resolver** | `sanity/lib/utils.ts` | `getCoverImage`, `urlForImage`, `formatImageCredit` | Sanity asset / external | N/A (URL only) | Yes + generic fallback | Credit via `formatImageCredit` | Wikimedia → thumbnail + unoptimized |
| **Body URL resolver** | `app/components/PostPage/PostBody/media-utils.ts` | `buildCoverImageData`, `buildGalleryImageData`, `buildBodyImageData` | Same as cover | N/A | Yes | Caption + credit in return object | Overlapping whitelist logic vs `utils.ts` |
| **Wikimedia helper** | `lib/image-optimization.ts` | `getWikimediaThumbnail` | External Wikimedia | N/A | N/A | N/A | Caps width at 1200px |
| **Homepage hero** | `app/components/Landing/FirstSection/centerColumnLanding.tsx` | `ImageRenderer` | `getCoverImage(cover)` | Yes | Yes | Credit computed, **UI commented out** | `priority` + `fetchPriority="high"` on main story; `fill` + `sizes` |
| **Homepage Just In carousel** | `app/components/Landing/FirstSection/leftColumnLanding.tsx` | `ImageRenderer` in `ImageCarousel` | Cover + `imageGallery` (local `getGalleryImageData`) | Yes | Yes | No | Client carousel; all slides in DOM; `priority` on first slide |
| **Homepage right rail** | `app/components/Landing/FirstSection/rightColumnLanding.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | No | Missing image → null (no placeholder) |
| **Homepage second section** | `app/components/Landing/SecondSection/secondSection.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | `ListingPhotoCredit` on hero | Tech / Business / Entertainment columns |
| **Homepage third section** | `app/components/Landing/ThirdSection/thirdSection.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | No | World / Politics two-column layout |
| **Homepage fourth section** | `app/components/Landing/FourthSection/fourthSection.tsx` | `ImageRenderer` | `getCoverImage` + gallery | Yes | Yes | No | US / Politics / Business highlights; custom gallery helper |
| **Homepage fifth section** | `app/components/Landing/FifthSection/fifthSection.tsx` | `ArticleFamilyCard` → `ImageRenderer` | `getCoverImage` | Yes | Yes | No | Featured Stories carousel (`heroTile`) |
| **Opinion rail** | `app/components/article-family/EditorialRailsSection.tsx` | `ImageRenderer` | `getCoverImage` + author `urlForImage` | Yes | Yes | No | Full-bleed cover `fill`; avatar 32px |
| **Article detail cover** | `app/components/PostPage/PostBody/ArticleMedia.tsx` | `ArticleImageFigure` → `ImageRenderer` | `buildCoverImageData` | Yes | Yes | Yes (`ArticleCaption`) | `priority` + `fetchPriority="high"` |
| **Article detail gallery carousel** | `app/components/PostPage/PostBody/CoverImageCarousel.tsx` | `ImageRenderer` | Cover + gallery resolved images | Yes | Yes | Yes (current slide) | All images mounted; 7s auto-advance |
| **Article body PT** | `app/components/PostPage/PostBody/PortableTextComponents.tsx` | `ArticleImageFigure` | `editorialImage` + legacy `image` | Yes | Yes | Yes; legacy uses `showAltAsCaption` | See Portable Text section |
| **Article byline avatar** | `app/components/PostPage/PostBody/ArticleByline.tsx` | `ImageRenderer` | Sanity author picture | Yes | Author name | No | 36px `fill` |
| **Article preload** | `app/components/PostPage/PreloadCoverImage.tsx` | `<link rel="preload">` | Cover URL | N/A | N/A | N/A | Client-side LCP preload |
| **Article page shell** | `app/components/article-family/ArticleFamilyPage.tsx` | Uses `PostBody`, `PreloadCoverImage` | CMS cover | Yes (children) | Yes | On media only | post / opinion / analysis / sponsored |
| **Related modules** | `app/components/PostPage/BottomArticleModule.tsx`, `PostSelectedNews.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | No | Related sidebar thumbs |
| **Related alt sidebar** | `app/components/PostPage/PostSelectedNewsAlt.tsx` | `Image` direct | `getCoverImage` | Yes | Yes | No | 80×64 thumbs; has `sizes="80px"` |
| **Category listing** | `app/components/CategoryPage/CategoryContent.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | No | **No `sizes` on three layouts**; placeholder object |
| **Category featured** | `app/components/CategoryPage/FeatureHero.tsx` | `ImageRenderer` | Prop `imageUrl` | Yes | **`alt=""`** | No | `priority`; placeholder query string URL |
| **Category side** | `FeatureSideItem.tsx`, `MostReadItem.tsx`, `LatestArticlesSection.tsx` | `ImageRenderer` | Props from page | Yes | Title as alt in some | No | Placeholder SVG variants |
| **Category sidebar** | `app/components/CategoryPage/CategorySidebar.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | No | **No `sizes`** on 80×60 thumbs |
| **Tag pages** | `app/tag/[slug]/page.tsx`, `TagPostsList.tsx`, `TagSidebar.tsx`, `ShowMoreSection.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Mostly yes | No | TagFeaturedArticle has `priority` |
| **Tag item** | `tag/[slug]/components/TagArticleItem.tsx`, `TagNewsItem.tsx` | `ImageRenderer` | Prop URL | Yes | Title | No | Placeholder fallback |
| **Search** | `app/search/SearchResults.tsx` | `ArticleFamilyCard` | API card `cover` | Yes (via card) | Yes | No | `enlargeMobileThumb` layout |
| **Unified card** | `app/components/article-family/ArticleFamilyCard.tsx` | `ImageRenderer` | `getCoverImage` | Yes | Yes | No | `heroTile` / `compact` / `rail` / `large`; placeholder on hero |
| **Category route** | `app/category/[slug]/page.tsx` | Prepares data for CategoryContent | `getCoverImage` | N/A | Yes | No | |
| **Bookmarks** | `app/myprofile/components/BookmarksList.tsx` | `<img>` | API `article_cover` | **No** | Yes | No | eslint-disable; no dimensions → CLS risk |
| **Bookmarks API** | `app/api/bookmarks/list/route.ts` | (data) | `getCoverImage` | N/A | Yes | No | |
| **Headlines API** | `app/api/posts/main-headlines/route.ts` | (data) | `getCoverImage` | N/A | Yes | No | Returns placeholder URL |
| **SEO metadata** | `app/lib/seo/metadata-builders.ts` | `getCoverImage`, `resolveOpenGraphImage` | Cover / `seo.ogImage` | N/A | Partial | No | OG images may be unoptimized externals |
| **JSON-LD** | `app/lib/seo/json-ld.ts` | `getCoverImage` | Cover | N/A | N/A | N/A | Structured data image URL |
| **Nav/footer brand** | `app/components/layout/navbar/logo.tsx`, `footer.tsx` | `Image` direct | `/black-logo.svg` local | Yes | "The Angle Logo" | No | SVG; small fixed dimensions |
| **Sign-in carousel** | `app/signin/page.tsx` | `Image` direct | CMS/marketing images | Yes | Variable | No | `/placeholder.svg` fallback |
| **News ticker** | `app/components/Landing/NewsTicker/NewsTicker.tsx` | — | — | **No images** | — | — | Text-only headlines |

---

## next/image Usage

### Correct / intentional patterns

- **`ImageRenderer`** consistently passes `alt` as a required string and delegates to `next/image`.
- **Sanity CDN assets** (`cdn.sanity.io`): built via `@sanity/image-url` with `auto("format")`, typically `unoptimized: false`.
- **Responsive article media** uses `fill` inside `relative` containers with `sizes` from [`ARTICLE_MEDIA_CLASSES`](../app/components/PostPage/PostBody/constants.ts) (e.g. `(max-width: 768px) 100vw, 688px` for editorial layout).
- **LCP candidates** appropriately use `priority` / `fetchPriority="high"` on homepage main hero ([`centerColumnLanding.tsx`](../app/components/Landing/FirstSection/centerColumnLanding.tsx)), article cover ([`ArticleMedia.tsx`](../app/components/PostPage/PostBody/ArticleMedia.tsx)), category feature ([`FeatureHero.tsx`](../app/components/CategoryPage/FeatureHero.tsx)), tag featured, and first carousel slides.
- **Wikimedia:** thumbnail URLs + `unoptimized: true` in both `ImageRenderer` and `getCoverImage`—avoids Next optimizer hitting Commons and reduces 429 risk.
- **Quality** is set explicitly in many article contexts (55–70); otherwise Next default applies.

### Issues / inconsistencies

| Issue | Location | Detail |
|-------|----------|--------|
| `fill` + unused `width`/`height` | Many files (e.g. `ArticleImageFigure`, `centerColumnLanding`, `ArticleFamilyCard`) | When `fill={true}`, width/height props are ignored—harmless but confusing for maintainers |
| Missing `sizes` | `CategoryContent.tsx` (3 calls), `CategorySidebar.tsx`, `TagSidebar.tsx` | Browser may download larger src than needed |
| Empty alt | `FeatureHero.tsx` line 28 | `alt=""` while image is meaningful; link has `aria-label` but image should have descriptive alt |
| Non-whitelisted external + `unoptimized: false` in gallery helper | `leftColumnLanding.tsx` `getGalleryImageData` | External non-Wikimedia returns `unoptimized: false` without whitelist check—may error at runtime if domain not in `remotePatterns` |
| No blur placeholder | Entire `app/` | No `placeholder="blur"` or `blurDataURL` |
| SVG in footer/nav | `logo.tsx`, `footer.tsx` | Local SVG via `next/image`—works; ensure `images.dangerouslyAllowSVG` not needed for local paths (default allows local) |
| Double carousel preload | `CoverImageCarousel` + `PreloadCoverImage` | Multiple high-priority image requests possible on gallery articles |

### Direct `next/image` (bypassing `ImageRenderer`)

| File | Purpose | Migration note |
|------|---------|----------------|
| `PostSelectedNewsAlt.tsx` | Small related-article thumbs | Could use `ImageRenderer` for Wikimedia consistency |
| `logo.tsx`, `footer.tsx` | Brand SVG | Reasonable to keep direct |
| `signin/page.tsx` | Marketing carousel | Optional unify |

---

## Plain `<img>` Usage

| File | Why used | Migrate to next/image? | Alt | Lazy / dimensions | Context |
|------|----------|------------------------|-----|-------------------|---------|
| [`app/myprofile/components/BookmarksList.tsx`](../app/myprofile/components/BookmarksList.tsx) (~L238) | Comment: "remote bookmark URLs; dimensions vary" | **Optional**—could use `ImageRenderer` if URLs are always allowlisted; otherwise keep `<img>` | Yes (`bookmark.article_cover.alt`) | **No width/height**—CLS risk; no `loading="lazy"` | User profile UI |

**No other `<img>` tags** in application `*.tsx` source (excluding `.open-next` build output).

Sanity Studio / `@sanity/ui` may render images internally—out of scope for public site audit.

---

## Next.js Image Config

**File:** [`next.config.ts`](../next.config.ts)

| Setting | Value |
|---------|--------|
| `images.remotePatterns` | `images.unsplash.com`, `cdn.sanity.io`, `upload.wikimedia.org`, `images.pexels.com`, `pixabay.com`, `cdn.pixabay.com`, `commons.wikimedia.org` |
| `images.formats` | `image/avif`, `image/webp` |
| `deviceSizes` | 480, 768, 1024, 1280, 1600 |
| `imageSizes` | 16, 32, 64, 96, 128, 256, 384 |
| `qualities` | 50, 55, 60, 70, 75, 85 |
| `minimumCacheTTL` | 31536000 (1 year) |
| Custom loader | **None** |
| `images.unoptimized` global | **Not set** (optimization enabled) |
| `dangerouslyAllowSVG` | **Not set** |
| `domains` (legacy) | **Not used** |

**Headers:** Long-cache `Cache-Control` on `/_next/image` and static CSS.

### Domain mismatch matrix

| Host | In `remotePatterns` | In `isWhitelistedDomain()` (`utils.ts`) | In `isWhitelistedExternalImage()` (`media-utils.ts`) | Runtime behavior |
|------|---------------------|----------------------------------------|------------------------------------------------------|------------------|
| `cdn.sanity.io` | Yes | Yes | Yes | Optimized |
| `images.unsplash.com` | Yes | Yes | Yes | Optimized |
| `images.pexels.com` | Yes | Yes | Yes | Optimized |
| `upload.wikimedia.org` | Yes | No (intentional) | N/A | Thumbnail URL + **always unoptimized** |
| `commons.wikimedia.org` | Yes | No | No | **Needs verification** if used in content |
| `pixabay.com`, `cdn.pixabay.com` | Yes | No | No | Likely **unoptimized** via `getCoverImage` unless added to whitelist |
| AP / Reuters / Getty / Imago | **No** | **No** | **No** | **`unoptimized: true`**—full URL served, no Next srcset |
| Arbitrary editor URL | No | No | No | `unoptimized: true` in `getCoverImage`; may still work in `<img>`/unoptimized mode |

**Cloudflare / OpenNext:** Project builds with OpenNext (`.open-next/` present). **Needs verification** that `/_next/image` optimization behaves the same on Cloudflare Workers as on Vercel Node.

---

## Sanity Image Schema

### Object types

| Type | File | Fields | Validation |
|------|------|--------|------------|
| `coverMedia` | [`sanity/schemas/objects/coverMedia.ts`](../sanity/schemas/objects/coverMedia.ts) | `source`, `externalUrl`, `image`, `alt`, `caption`, `creditAuthor`, `creditSource`, `licenseOrRights` | `imageAttributionValidation` on object |
| `galleryImageItem` | [`sanity/schemas/objects/galleryImageItem.ts`](../sanity/schemas/objects/galleryImageItem.ts) | Same attribution fields | Same + custom `GalleryImageInput` |
| `editorialImage` | [`sanity/schemas/objects/editorialImage.ts`](../sanity/schemas/objects/editorialImage.ts) | Same + required `layout` (inline/wide/full) | Same |

**Shared field definitions:** [`sanity/schemas/helpers/mediaFields.ts`](../sanity/schemas/helpers/mediaFields.ts)

- **Source mutual exclusivity:** `externalUrl` hidden unless `source === "external"`; `image` hidden unless `source === "asset"`; conditional required validation on each.
- **Alt:** required on `editorialImage` / gallery via `mediaAltField`; on `coverMedia` alt is optional at field level but **required when `status === "published"`** via [`articleBaseFields.ts`](../sanity/schemas/helpers/articleBaseFields.ts).
- **Attribution:** When any image media present, `licenseOrRights` and (creditAuthor OR creditSource) required—**Studio save validation**, not duplicated in publish rule for cover alone.

**Legacy field names:** GROQ coalesces `epigraph` → `caption`, `creditProvider` → `creditSource` in [`image-fields-projection.ts`](../sanity/lib/image-fields-projection.ts).

### GROQ projection

```groq
source, externalUrl, image, alt,
"caption": coalesce(caption, epigraph),
creditAuthor,
"creditSource": coalesce(creditSource, creditProvider)
```

Used in [`sanity/lib/queries.ts`](../sanity/lib/queries.ts), [`sanity/lib/article-family-queries.ts`](../sanity/lib/article-family-queries.ts), and body projection for `_type == "editorialImage"`.

**Not projected:** `licenseOrRights` (internal-only in practice).

### Frontend consumption

| Field | Fetched | Displayed publicly |
|-------|---------|-------------------|
| `source` / `externalUrl` / `image` | Yes | Resolved to `src` only |
| `alt` | Yes | Yes (with fallback) |
| `caption` | Yes | Article media + PT; rarely on listings |
| `creditAuthor` / `creditSource` | Yes | Article media + PT via `formatImageCredit`; listings mostly hidden |
| `licenseOrRights` | **No** | **Never** |

### Seeded content

[`scripts/seed-articles.mjs`](../scripts/seed-articles.mjs) `buildExternalCover()` sets `source: "external"`, Unsplash URLs, alt, caption, credits, and `licenseOrRights: "Unsplash License"`—aligned with schema. Reseed script [`scripts/reseed-articles-published-today.mjs`](../scripts/reseed-articles-published-today.mjs) also uses Unsplash/Pexels URLs.

---

## Article and Listing Pages

### Article detail (post, opinion, analysis, sponsored)

- **Route:** [`app/components/article-family/ArticleFamilyPage.tsx`](../app/components/article-family/ArticleFamilyPage.tsx) → [`PostBody`](../app/components/PostPage/PostBody/index.tsx).
- **Hero:** [`ArticleMedia`](../app/components/PostPage/PostBody/ArticleMedia.tsx) — single cover or [`CoverImageCarousel`](../app/components/PostPage/PostBody/CoverImageCarousel.tsx) when `imageGallery` has items.
- **Presentation variants:** `default`, `editorial`, `nonRegularCover` via `ARTICLE_MEDIA_CLASSES` in constants.
- **Body:** Portable Text with `portableTextComponents` vs `nonRegularPortableTextComponents` for editorial article types.
- **Preload:** [`PreloadCoverImage`](../app/components/PostPage/PreloadCoverImage.tsx) injects preload link for cover `src`.
- **Sidebars:** `PostSelectedNews` / `BottomArticleModule` use `getCoverImage` thumbnails without credits.

### Homepage ([`app/page.tsx`](../app/page.tsx))

- First section (hero, Just In carousel, rails), second section category cards, third/fourth/fifth sections, seventh section, opinion [`EditorialRailsSection`](../app/components/article-family/EditorialRailsSection.tsx).
- **Inconsistency:** Mix of `ImageRenderer` and direct `Image`; credits often commented out; placeholders on missing covers.

### Category ([`app/category/[slug]/page.tsx`](../app/category/[slug]/page.tsx))

- [`CategoryContent`](../app/components/CategoryPage/CategoryContent.tsx), [`FeatureHero`](../app/components/CategoryPage/FeatureHero.tsx), sidebar/latest/most-read components.
- **Issue:** `FeatureHero` empty alt; featured uses placeholder query URL.

### Tag ([`app/tag/[slug]/page.tsx`](../app/tag/[slug]/page.tsx))

- Featured + list patterns mirror category; `getCoverImage` + `ImageRenderer`; placeholder fallbacks.

### Search ([`app/search/SearchResults.tsx`](../app/search/SearchResults.tsx))

- [`ArticleFamilyCard`](../app/components/article-family/ArticleFamilyCard.tsx) `compact` layout with `enlargeMobileThumb`; cover from search API results.

### News ticker

- **No images**—text-only [`NewsTicker`](../app/components/Landing/NewsTicker/NewsTicker.tsx).

---

## Portable Text / Body Images

**Schema:** [`sanity/schemas/objects/blockContent.ts`](../sanity/schemas/objects/blockContent.ts) allows `editorialImage` blocks only (no native Sanity `image` type in schema today).

**Renderer:** [`PortableTextComponents.tsx`](../app/components/PostPage/PostBody/PortableTextComponents.tsx)

| Block type | Support | Component | External URL | Alt / caption / credit |
|------------|---------|-----------|--------------|------------------------|
| `editorialImage` | Primary | `buildBodyImageData` → `ArticleImageFigure` | Yes (via shared builder) | Yes |
| `image` (legacy) | Backward compat | `urlForImage` asset only | **No** | Caption from meta; **`showAltAsCaption`** duplicates alt in figcaption |
| `videoEmbed` | N/A | `<iframe>` | N/A | Title as figcaption |

**Dimensions:** Body editorial images use `fill` in aspect-ratio wrappers (`3/2` legacy, `4/3` editorial); `sizes` set per layout (66vw / 688px / 900px).

**Non-regular articles:** Smaller in-body images via `nonRegularPortableTextComponents` constants.

---

## Accessibility Findings

| Finding | Severity | Location |
|---------|----------|----------|
| `alt=""` on meaningful featured image | High | `FeatureHero.tsx` |
| Generic `DEFAULT_ALT_TEXT` when alt missing | Medium | `getCoverImage` in `utils.ts` |
| `showAltAsCaption` with `aria-hidden` on alt line | Low | `ArticleCaption.tsx`—alt shown visually but hidden from SR on legacy blocks |
| Carousel dot buttons have `aria-label` | Good | `CoverImageCarousel`, `leftColumnLanding` |
| Bookmarks `<img>` without dimensions | Medium | CLS for screen magnifier users too |
| Link wraps images without redundant text | OK | Most article links include visible titles nearby |

---

## Performance Findings

| Finding | Impact |
|---------|--------|
| Multiple `priority` images on same view (hero + carousel first slide) | Competes for bandwidth |
| Gallery/carousel mounts all slides | Downloads N full images; only one visible |
| Missing `sizes` on several card grids | Oversized image bytes |
| Wikimedia unoptimized thumbs | No responsive srcset; single resized URL |
| Non-whitelisted externals unoptimized | Full-size remote file to client |
| 1-year `minimumCacheTTL` on optimizer | Good for repeat views |
| AVIF/WebP formats configured | Good |
| No blur/LQIP placeholders | LCP may show empty until load |

---

## Licensing / Credit Findings

| Capability | CMS | Public site |
|------------|-----|-------------|
| Credit author / source | Required (with image) in Studio | Shown on **article** figures only |
| Caption | Optional | Article figures; not listings |
| License / rights | Required in Studio | **Not fetched or displayed** |
| Listing photo credit | N/A | Shown on second-section hero via `ListingPhotoCredit`; other homepage sections omit credits |
| `ExcerptCreditCaption` helper | N/A | **Unused** in production UI |

For a news website, **visible photo credits on all published images** (especially homepage and syndicated wires) are typically mandatory—current UI does not meet that bar on listings.

---

## Risks

1. **Legal / attribution:** Credits and licenses not shown on listing surfaces; license field never reaches frontend.
2. **Accessibility:** Empty alt on category hero; generic fallback alt text.
3. **Performance:** Carousel DOM strategy; missing `sizes`; unoptimized large externals.
4. **Runtime errors:** External URL on non-allowlisted domain with `unoptimized: false` in gallery helper could break `next/image` in dev.
5. **Editorial workflow:** Publish validation does not require credit/license on cover—editors could publish with only alt.
6. **Config drift:** Three different whitelist implementations.
7. **Wire photos:** No first-class support for AP/Getty/Reuters domains in config.
8. **Placeholder.svg:** Used as content fallback—may confuse users or SEO (non-article image).
9. **OpenNext on Cloudflare:** Image optimizer compatibility **needs verification**.

---

## Recommendations

### Immediate Fixes

1. Set descriptive `alt` on [`FeatureHero`](../app/components/CategoryPage/FeatureHero.tsx) from article title or cover alt.
2. Add `sizes` where missing on [`CategoryContent.tsx`](../app/components/CategoryPage/CategoryContent.tsx), [`CategorySidebar.tsx`](../app/components/CategoryPage/CategorySidebar.tsx), [`TagSidebar.tsx`](../app/tag/[slug]/TagSidebar.tsx).
3. Align `getGalleryImageData` in [`leftColumnLanding.tsx`](../app/components/Landing/FirstSection/leftColumnLanding.tsx) with `getCoverImage` whitelist / unoptimized rules.
4. Add `width`/`height` or aspect-ratio box to bookmarks [`<img>`](../app/myprofile/components/BookmarksList.tsx) to reduce CLS.
5. Uncomment or wire `ExcerptCreditCaption` / `formatImageCredit` on homepage hero and category rails if product requires visible credits.

### Structural Improvements

1. **Single image pipeline module:** Merge `getCoverImage`, `buildArticleImageData`, and duplicate gallery helpers; one whitelist exported from config.
2. **Extend GROQ** with `licenseOrRights` if public display or internal tooling needed; define editorial policy for display vs staff-only.
3. **Enforce attribution at publish** in `articleBaseFields` (mirror Studio object validation).
4. **Carousel:** Render only current ±1 slide, or use true slider with lazy loading.
5. **Migrate** remaining direct `Image` usages to `ImageRenderer` for consistent Wikimedia handling.
6. **Add wire domains** to `remotePatterns` + whitelist when licensing allows optimization path.
7. **Standardize missing-image UX** (neutral frame vs `/placeholder.svg`).

### Nice-to-Have Improvements

1. `placeholder="blur"` for hero covers using Sanity LQIP or dominant color.
2. Consolidate `priority` to one LCP candidate per route.
3. Generate `blurDataURL` for Sanity assets via `@sanity/image-url` params.
4. Display subtle credit line component shared by listings and articles.
5. Remove legacy Portable Text `image` handler after content migration audit.

---

## Open Questions

1. **Product:** Should photo credits appear on homepage/listings, or only on article pages?
2. **Product:** Is `licenseOrRights` staff-only, or should readers see a rights line (e.g. "© Getty Images")?
3. **Content:** **Needs verification**—do production articles use wire URLs (AP, Reuters, Getty) not in `remotePatterns`?
4. **Content:** **Needs verification**—volume of legacy `image` blocks vs `editorialImage` in body content.
5. **Infra:** Does Cloudflare OpenNext deployment support `/_next/image` optimization at scale?
6. **Pixabay:** Seeds/config include Pixabay hosts—should they be added to runtime whitelist for optimization?

---

## Files Reviewed

### Core

- `app/components/ui/image-renderer.tsx`
- `sanity/lib/utils.ts`
- `sanity/lib/image-fields-projection.ts`
- `lib/image-optimization.ts`
- `next.config.ts`
- `sanity/schemas/helpers/mediaFields.ts`
- `sanity/schemas/objects/coverMedia.ts`
- `sanity/schemas/objects/galleryImageItem.ts`
- `sanity/schemas/objects/editorialImage.ts`
- `sanity/schemas/objects/blockContent.ts`
- `sanity/schemas/helpers/articleBaseFields.ts`
- `sanity/lib/queries.ts`
- `sanity/lib/article-family-queries.ts`

### Article / PT

- `app/components/PostPage/PostBody/ArticleMedia.tsx`
- `app/components/PostPage/PostBody/CoverImageCarousel.tsx`
- `app/components/PostPage/PostBody/ArticleImageFigure.tsx`
- `app/components/PostPage/PostBody/ArticleCaption.tsx`
- `app/components/PostPage/PostBody/PortableTextComponents.tsx`
- `app/components/PostPage/PostBody/media-utils.ts`
- `app/components/PostPage/PostBody/constants.ts`
- `app/components/PostPage/PostBody/ArticleByline.tsx`
- `app/components/PostPage/PostBody/index.tsx`
- `app/components/PostPage/PreloadCoverImage.tsx`
- `app/components/article-family/ArticleFamilyPage.tsx`
- `app/components/article-family/ArticleFamilyCard.tsx`
- `app/components/article-family/EditorialRailsSection.tsx`

### Homepage / landing

- `app/page.tsx`
- `app/components/Landing/FirstSection/centerColumnLanding.tsx`
- `app/components/Landing/FirstSection/leftColumnLanding.tsx`
- `app/components/Landing/FirstSection/rightColumnLanding.tsx`
- `app/components/Landing/SecondSection/secondSection.tsx`
- `app/components/Landing/ThirdSection/thirdSection.tsx`
- `app/components/Landing/FourthSection/fourthSection.tsx`
- `app/components/Landing/FifthSection/fifthSection.tsx`
- `app/components/Landing/homepage-below-fold.tsx`
- `app/components/Landing/NewsTicker/NewsTicker.tsx`

### Category / tag / search

- `app/category/[slug]/page.tsx`
- `app/components/CategoryPage/*`
- `app/tag/[slug]/*`
- `app/search/SearchResults.tsx`

### Other UI

- `app/components/PostPage/PostSelectedNews.tsx`
- `app/components/PostPage/PostSelectedNewsAlt.tsx`
- `app/components/PostPage/BottomArticleModule.tsx`
- `app/components/layout/navbar/logo.tsx`
- `app/components/layout/footer.tsx`
- `app/myprofile/components/BookmarksList.tsx`
- `app/signin/page.tsx`
- `app/helpers/excerpt-credit-caption.tsx`
- `app/lib/seo/metadata-builders.ts`
- `app/lib/seo/json-ld.ts`
- `app/api/bookmarks/list/route.ts`
- `app/api/posts/main-headlines/route.ts`

### Scripts

- `scripts/seed-articles.mjs`
- `scripts/reseed-articles-published-today.mjs`

---

## Final Assessment

**Partially ready** for production use as a news website.

**Strengths:** Unified Sanity image objects for cover, gallery, and body; solid article-page rendering with captions/credits; sensible Wikimedia handling; modern formats and cache headers in Next config; broad use of `next/image` through a single wrapper.

**Gaps before editorial/production confidence:** listing-level photo credits and rights display, schema-to-frontend license field gap, whitelist/config inconsistency, accessibility issues on category hero alt, carousel performance model, and lack of wire-service domain strategy.

Addressing the **Immediate Fixes** and **Structural Improvements** above would move the system toward **production-ready** without rethinking the entire architecture.
