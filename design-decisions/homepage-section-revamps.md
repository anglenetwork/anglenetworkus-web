# Homepage Section Revamps

Record of Angle redesigns applied to below-fold homepage sections. Each entry maps **reference mock → implementation**.

---

## SecondSection — “More Sections”

**Component:** `app/components/Landing/SecondSection/secondSection.tsx`  
**Typography:** `app/lib/typography/second-section.ts`  
**Grid helper:** `app/lib/homepage/section-grid-cells.ts`  
**Data:** unchanged — 3 categories × 2 posts via `getSecondSectionData()`

### Reference standard

- Section title “More Sections” + flex hairline rule
- 3 category columns: TECH, BUSINESS, ENTERTAINMENT
- Per column: mono label + red dot, lead story (4:3 image), optional credit, 1 secondary row
- Solid grid borders; dashed rule between lead and secondary
- Breakpoints: 1000px (2-col), 640px (1-col)

### Changes made

| Before | After |
|--------|-------|
| No section header | `moreSectionsHeading` + horizontal rule |
| Per-column `SectionHeader` (linked, Lucide icon) | Static `secCategoryLabel` with CSS red dot |
| 16:9 rounded lead images | 4:3 square corners, `bg-angle-paper` |
| Right-aligned sans credit | Left-aligned mono `secPhotoCredit` |
| Separate links for image / headline | Single lead `<Link>` block |
| Dotted `<hr>` + 112×80 thumbs | `.divider-dashed` + 64×64 thumbs |
| Red primary hover | `group-hover:text-angle-inkSoft` |
| `divide-dotted` 3-col grid | `sectionGridClassName` + solid borders |

### Spacing

- Section: `pt-16` (64px top)
- Header margin: `mb-9` (36px)
- Cell padding: 30px vertical, 40px horizontal (desktop)

---

## ThirdSection — Trending strip

**Component:** `app/components/Landing/ThirdSection/thirdSection.tsx`  
**Typography:** `app/lib/typography/third-section.ts`  
**Grid helper:** `section-grid-cells.ts` (no top border on inner grid)  
**Config:** `HOMEPAGE_THIRD_SECTION_TAGS` trimmed to 3 tags (Congress, AI, White House)  
**Data:** unchanged query shape — dedup loop reads config array

### Reference standard

- Full-width paper background strip
- 3 text-only columns: red mono eyebrow, headline, read time
- Single link per column (to article, not tag page)
- Same 1000px / 640px grid as More Sections

### Changes made

| Before | After |
|--------|-------|
| 4 tags (included Markets) | 3 tags matching mock |
| `bg-news-background`, rounded card | `bg-angle-paper`, flat strip |
| Separate tag link + article link | One link wrapping eyebrow + headline + meta |
| Sans eyebrow in news-primary | `trendEyebrow` — mono red uppercase |
| Dynamic column count (1–4) | Fixed 3-column intent |
| `divide-dotted` | Shared `sectionGridCellClassName` |

### Spacing

- `mt-14` (56px) from SecondSection — grouped in `homepage-below-fold.tsx` so gap is internal, not `space-y-16`
- Strip padding: `px-6 py-10 lg:px-12`

---

## FourthSection — Tech module + Most Read

**Component:** `app/components/Landing/FourthSection/fourthSection.tsx`  
**Most Read:** `app/components/Landing/FourthSection/most-read-feed.tsx`  
**Typography:** `app/lib/typography/fourth-section.ts`  
**Grid helper:** `app/lib/homepage/tech-section-grid.ts` (unique breakpoints)  
**Data:** unchanged — `featured[2]` + `secondary[4]` + `mostRead[5]`

### Reference standard

- TECH label (13px mono + red dot), linked to category
- 3-column grid: 2 editorial columns + Most Read panel
- Each editorial column: 1 lead (16/11) + 2 secondary rows (88×88 thumb)
- Most Read: dark panel in col 3 desktop; inverts to light full-width below 1100px
- Breakpoints: 1100px, 720px, 520px

### Data mapping

```
featured[0] + secondary[0..1]  →  Tech column 1
featured[1] + secondary[2..3]  →  Tech column 2
mostRead[0..4]                 →  Column 3 (Most Read)
```

### Changes made

| Before | After |
|--------|-------|
| 2×2 featured grid + 2×2 secondary grid + sidebar | 2 editorial columns + MR column |
| `NewsCardRowCard` | `TechColumnLead` + `TechColumnSub` |
| `SectionHeader` for Tech and Most Read | `techCategoryLabel` + `mostReadTitle` |
| Black page-level sidebar | Dark panel inside grid cell |
| EXCLUSIVE badges on secondary | Removed (not in mock) |
| `lg` (1024px) breakpoints | 1100px / 720px / 520px |
| Dotted borders | Solid hairlines + `.divider-dashed` |

### Most Read responsive behavior

| Viewport | Panel |
|----------|-------|
| >1100px | `bg-angle-ink`, light text, `border-angle-bg/15` dividers |
| ≤1100px | Transparent bg, ink text, hairline dividers, full grid width |
| ≤520px | Title scales to 22px |

### Spacing

- Section: `pt-14 pb-16` (56px / 64px)
- Editorial cells: `py-8 px-10`
- MR panel inner: `px-9 py-8`

---

## FifthSection — World + Politics

**Component:** `app/components/Landing/FifthSection/fifthSection.tsx`  
**Typography:** `app/lib/typography/fifth-section.ts`  
**Grid helper:** `app/lib/homepage/fifth-section-grid.ts`  
**Data:** unchanged — World featured + Politics list via `loadHomepageBelowFoldData()` / `HOMEPAGE_FIFTH_SECTION_*`

### Layout standard (Angle-derived)

- Asymmetric 2-column grid: ~1.65fr featured (World) + 1fr list (Politics)
- Per column: mono category label + red dot (13px)
- Left: large hero with gradient overlay (matches FirstSection hero pattern)
- Right: vertical list with `.divider-dashed` between rows, 64×64 thumbs
- Breakpoints: 1000px (stack), 640px (tighter padding), 520px (solid sub borders, 72px thumbs)

### Changes made

| Before | After |
|--------|-------|
| `rounded-lg bg-news-surface` card | Flat `section pt-14 pb-16` |
| `SectionHeader` per column | `fifthCategoryLabel` linked mono + red dot |
| 12-col `lg:grid-cols-12` layout | `lg:grid-cols-[1.65fr_1fr]` + `fifth-section-grid.ts` |
| Gradient overlay sans sizing | Angle overlay tokens; `aspect-[16/12.4]` hero |
| Right-aligned `ListingPhotoCredit` | Left mono `fifthFeaturedCredit` |
| `divide-dotted` list rows | `.divider-dashed` between Politics items |
| 112×80 rounded thumbs | 64×64 square `bg-angle-paper` |
| Red primary hover | `group-hover:text-angle-inkSoft` |

### Spacing

- Section: `pt-14 pb-16`
- Columns: `py-8`, featured `pl-0 pr-10`, list `pl-10 pr-0` with `border-l` hairline on desktop
- ≤1000px: stack with `border-b` on featured column

---

## SixthSection — Featured category stories

**Component:** `app/components/Landing/SixthSection/sixthSection.tsx`  
**Typography:** reuses `app/lib/typography/second-section.ts` (column labels + lead story)  
**Grid helper:** `app/lib/homepage/section-grid-cells.ts` (same 1000px / 640px as More Sections)  
**Data:** unchanged — latest post per category (US, Politics, Business) via `homepageSixthSectionBundleQuery`

### Reference standard

- 3 category columns, no section-level title (each column self-labeled)
- Per column: mono label + red dot, single lead story (4:3 image), optional credit, read time
- Same grid shell and xl lead-image normalization as SecondSection

### Changes made

| Before | After |
|--------|-------|
| `FeaturedStoryColumn` + `SectionHeader` | Inline `SixthSectionColumn` + `secCategoryLabel` |
| 16:9 rounded lead images | 4:3 square corners, `bg-angle-paper` |
| Right-aligned `ListingPhotoCredit` | Left mono `secPhotoCredit` |
| Separate image / headline links | Single lead `<Link>` block |
| `rounded-lg bg-news-surface` card | Flat `section pt-14 pb-16` |
| `divide-dotted` 3-col grid | `sectionGridClassName` + solid borders |

### Spacing

- Section: `pt-14 pb-16`
- Cell padding: shared `sectionGridCellClassName` (30px vertical, 40px horizontal desktop)

---

## SeventhSection — Featured Stories carousel

**Component:** `app/components/Landing/SeventhSection/seventhSection.tsx`  
**Typography:** `app/lib/typography/seventh-section.ts`  
**Data:** unchanged — third-latest post per category via `getSeventhSectionData()`

### Reference standard

- Section title “Featured Stories” + flex hairline rule
- Horizontal scroll row of editorial cards (one per category with data)
- Per card: 4:3 image, red mono eyebrow, headline, read time
- Scroll chevrons on md+; touch scroll on mobile

### Changes made

| Before | After |
|--------|-------|
| `SectionHeader` | `featuredStoriesHeading` + hairline rule |
| `ArticleFamilyCard` heroTile (400px gradient tile) | Inline `FeaturedStoryCarouselCard` with 3:4 portrait image |
| `rounded-lg` / `news-surface` chrome | Flat section on page background |
| Shadcn outline scroll buttons | Hairline-bordered Angle buttons |
| Fallback sample card when empty | Returns `null` when no articles |
| `ReadTimeLabel variant="hero"` | `variant="angle"` |

### Spacing

- Section: `pt-14 pb-16`
- Header margin: `mb-9`
- Carousel gap: 24px (`gap-6`); card width 280px (240px at ≤520px)

---

## Skeleton / loading

`SecondSectionSkeleton` in `below-fold-placeholder.tsx` was updated to match SecondSection layout. FourthSection has no dedicated skeleton (below-fold lazy loader reuses second-section placeholder).

---

## Sections not yet revamp

| Section | File | Notes |
|---------|------|-------|
| EditorialRailsSection | `article-family/EditorialRailsSection.tsx` | Opinion rails |

FirstSection was previously revamp to Angle (`first-section.ts`, hairlines, divider-dashed on right rail).
