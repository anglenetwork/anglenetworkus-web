# Layout and Responsive Grids

Angle sections use CSS Grid with **solid borders**, not Tailwind `divide-*` utilities. Breakpoints are mock-specific — do not assume `lg` (1024px) unless the reference uses it.

## Border vocabulary

| Purpose | Style | Tailwind |
|---------|-------|----------|
| Grid top edge | 1px solid strong | `border-t border-angle-ink` |
| Column divider | 1px solid hairline | `border-l border-angle-hairline` |
| Row divider (stacked mobile) | 1px solid hairline | `border-t border-angle-hairline` |
| Section header rule | 1px flex line | `h-px flex-1 bg-angle-hairline` |
| Secondary item separator | 8px repeating dash | `.divider-dashed` (globals.css) |

**Never use** `divide-dotted`, `border-dotted`, or `rounded-lg` card shells on Angle editorial blocks.

## Standard 3-column grid (Sections 2 & 3)

Used by: **SecondSection** (More Sections), **ThirdSection** (Trending strip).

Helper: `app/lib/homepage/section-grid-cells.ts`

| Breakpoint | Columns | Behavior |
|------------|---------|----------|
| >1000px | 3 | Vertical hairlines between cols; strong top border |
| 641–1000px | 2 | Horizontal hairlines; 16px odd/even gutters |
| ≤640px | 1 | Full-width stack; top border between items |

### Cell padding (desktop)

- Vertical: `py-[30px]` (30px)
- Horizontal: `pl-10 pr-10` (40px), except `first:pl-0 last:pr-0`

### Tablet gutter pattern

```
max-[1000px]:odd:pr-4 max-[1000px]:even:pl-4
max-[1000px]:even:pr-0 max-[1000px]:odd:pl-0
```

First two cells in 2-col mode have no top border; subsequent rows get `border-t`.

## Tech module grid (Section 4)

Used by: **FourthSection** (Tech + Most Read).

Helper: `app/lib/homepage/tech-section-grid.ts`

| Breakpoint | Columns | Behavior |
|------------|---------|----------|
| >1100px | 3 | Cols 1–2 editorial; col 3 Most Read dark panel |
| 641–1100px | 2 + full span | Editorial 2-up; Most Read spans full width below |
| ≤720px | 1 | All columns stack |
| ≤520px | — | Sub-rows: dashed → solid border; smaller thumbs |

**Do not reuse `section-grid-cells.ts` for FourthSection** — breakpoints differ (1100px / 720px / 520px vs 1000px / 640px) and column 3 has unique full-span behavior.

### Most Read column (≤1100px)

Third grid child becomes:

```
col-span-full
border-t border-angle-ink
mt-8 pt-8
border-l-0 pl-0
```

At ≤720px, `mt-0` resets the 32px top margin from tablet layout.

### Editorial column padding (Tech)

- Desktop: `py-8 px-10` (32px / 40px)
- Matches mock `.tech-col { padding: 32px 40px }`

## Section header with rule

Pattern for titled sections (More Sections):

```tsx
<div className="mb-9 flex items-baseline gap-[18px]">
  <h2 className={moreSectionsHeading}>More Sections</h2>
  <div className="h-px flex-1 bg-angle-hairline" aria-hidden />
</div>
```

Category-only sections (Tech) use a linked mono label instead — no horizontal rule.

## Paper background strip

ThirdSection (Trending) sits on `bg-angle-paper` with internal padding:

```
mt-14 bg-angle-paper px-6 py-10 lg:px-12
```

Grid inside has **no** top border (`withTopBorder: false`) because the strip is visually distinct from the white page.

## Dark panel (Most Read)

Desktop (>1100px): panel is **inside** grid column 3, not a page-level sidebar.

```
bg-angle-ink text-angle-bg px-9 py-8
```

Tablet/mobile (≤1100px): panel inverts to light — transparent background, ink text, hairline list dividers. Implement with responsive Tailwind on a single wrapper, not separate components.

## When to create a new grid helper

Create `app/lib/homepage/<name>-section-grid.ts` when:

- Breakpoints differ from existing helpers
- A column has special span/collapse behavior
- Border logic exceeds ~6 responsive classes

Keep helpers as pure `className` functions returning `cn(...)`. Components stay readable; agents can diff grid behavior in one file.
