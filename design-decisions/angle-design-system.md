# Angle Design System

The Angle editorial design system is defined in reference mocks using CSS custom properties and Google Fonts. Implementation lives in Tailwind tokens, typography modules, and global utilities.

## Color tokens

Reference mocks define:

```css
:root {
  --bg: #FAFAF8;
  --ink: #14181C;
  --ink-soft: #5B6168;
  --hairline: #DEDBD3;
  --hairline-strong: #14181C;
  --red: #C7371F;
  --paper: #F2EFE7;
}
```

Tailwind mapping (`tailwind.config.ts` → `colors.angle`):

| CSS variable | Tailwind class | Usage |
|--------------|----------------|-------|
| `--bg` | `angle-bg`, `bg-angle-bg` | Page background, light text on dark panels |
| `--ink` | `angle-ink`, `text-angle-ink` | Primary text, strong borders |
| `--ink-soft` | `angle-inkSoft` | Meta, credits, hover state for headlines |
| `--hairline` | `angle-hairline` | Column dividers, horizontal rules |
| `--hairline-strong` | `angle-ink` (same as ink) | Grid top borders |
| `--red` | `angle-red` | Kicker dots, eyebrows, focus rings |
| `--paper` | `angle-paper` | Image placeholders, empty image backgrounds |

**Rule:** New editorial sections use `angle-*` exclusively. The legacy `news-*` palette (`news-surface`, `news-border`, `news-primary`, etc.) is deprecated for homepage editorial blocks.

## Typography

### Font families

| Role | Font | Tailwind |
|------|------|----------|
| Headlines, section titles | Space Grotesk | `font-display` |
| Kickers, read time, credits, eyebrows | Space Mono | `font-mono` |
| Body / dek (rare in listing blocks) | Space Grotesk | `font-sans` |

Fonts are loaded via `app/lib/fonts/` and exposed as CSS variables (`--font-display`, `--font-mono`).

### Headline scale (listing contexts)

Sizes vary by section — always copy from the mock, then codify in typography tokens:

| Context | Typical size | Weight | Tracking |
|---------|--------------|--------|----------|
| Section title (e.g. “More Sections”) | 22px | 700 | -0.3px |
| Category label (TECH) | 12–13px mono | 700 | 1.2px (uppercase) |
| Lead story headline | 21–24px | 600 | -0.2px to -0.3px |
| Secondary row headline | 16–17px | 600 | -0.2px |
| Trending / Most Read headline | 17–18px | 600 | -0.2px |
| Most Read panel title | 26px (22px mobile) | 700 | -0.4px |

Line heights are tight: `1.26`–`1.32` for headlines.

### Meta / read time

- Font: Space Mono, 11–12px
- Color: `text-angle-inkSoft`
- Format: `{N} MIN READ` (uppercase) via `formatReadTimeLabel()`
- Component: `ReadTimeLabel variant="angle"` or raw `<p className={…}>` when mock specifies 12px instead of 11px

### Label patterns

**Red dot prefix (category / panel titles)**

Implemented with Tailwind `before:` pseudo-element — not Lucide icons:

```
flex items-center gap-2
before:size-[7px] before:rounded-full before:bg-angle-red before:content-['']
font-mono font-bold uppercase tracking-[0.12em]
```

Dot sizes used in codebase: **7px** (category labels), **8px** (Most Read title).

**Red eyebrow (tag/topic, no dot)**

```
font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-angle-red
```

## Interaction

### Headline hover

Angle mocks use **soft ink fade**, not red accent:

```
transition-colors group-hover:text-angle-inkSoft
```

Apply on the `<Link className="group">` wrapper; headline classes include the hover utility.

### Focus

Reference mocks:

```css
:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }
```

Implementation: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-angle-red focus-visible:outline-offset-[3px]`

### Links

- No underlines on listing headlines
- `color: inherit` — headline color comes from typography tokens
- Single link wrapper per card when mock shows one clickable region (image + title + meta together)

## Spacing

Horizontal padding for homepage sections comes from `SitePageWidth` (`px-4 sm:px-6 lg:px-16` ≈ 48px at desktop). Section components generally **do not** add their own horizontal padding unless the mock specifies inner panel padding (e.g. Most Read dark panel `px-9 py-8`).

Vertical rhythm between homepage below-fold sections: `HOMEPAGE_BELOW_FOLD_SECTION_GAP` (`space-y-10` = 40px, `xl:space-y-12` = 48px at xl). **Do not** add section-level `pt-*` / `pb-*` for external gaps — that stacks with the parent and creates excessive “island” spacing.

Paired sections grouped in `homepage-below-fold.tsx` use `HOMEPAGE_SECTION_PAIR_GAP` (`mt-10` = 40px) on the lower block only.

Section-internal padding from mocks (content padding, not section separation):

| Section | Notes |
|---------|-------|
| More Sections (Second) | No external pt/pb |
| Trending (Third) | `mt-10` pair gap + strip `py-10` |
| Tech (Fourth) | Editorial cell `py-8` only |
