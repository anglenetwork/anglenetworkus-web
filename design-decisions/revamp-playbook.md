# Revamp Playbook

Step-by-step guide for agents revamping a legacy block to the Angle standard. Read [angle-design-system.md](./angle-design-system.md) first.

## 1. Obtain and parse the reference mock

The design standard arrives as HTML + embedded CSS. Extract:

1. **CSS variables** → map to `angle-*` tokens
2. **Exact px values** for font-size, padding, margin, gap, letter-spacing
3. **Aspect ratios** on images (e.g. `4/3`, `16/11`)
4. **Breakpoints** in `@media` blocks — note these are often **not** Tailwind defaults
5. **Border style** — solid hairline vs dashed gradient vs strong top rule
6. **Hover/focus** rules
7. **DOM structure** — especially whether one or multiple links wrap each story

Do not approximate breakpoints to `sm`/`md`/`lg` unless the mock aligns with those values.

## 2. Audit the existing component

Before editing, identify:

- Data shape and fetch layer (usually **leave unchanged** unless mock requires different article counts)
- Legacy imports to remove: `SectionHeader`, `NewsCardRowCard`, `divide-dotted`, `homepageArticleTitleLink`
- Whether `variant="dark"` or other legacy props must be preserved for non-homepage callers

## 3. Create typography tokens

Add or update `app/lib/typography/<section>.ts`:

```ts
const angleTitleHover = "transition-colors group-hover:text-angle-inkSoft";

export const sectionLabel = "font-mono … before:size-[7px] before:bg-angle-red …";
export const leadHeadline = `font-display text-[21px] … ${angleTitleHover}`;
```

Rules:

- One export per distinct text role in the mock
- Include responsive size overrides in the same string (`max-[720px]:text-[21px]`)
- Keep legacy exports only if other files still import them — mark `@deprecated`

## 4. Create or reuse grid helpers

Check existing helpers:

| Helper | Breakpoints | Use for |
|--------|-------------|---------|
| `section-grid-cells.ts` | 1000px, 640px | Equal 3-col editorial grids |
| `tech-section-grid.ts` | 1100px, 720px, 520px | Tech + full-span third column |

If breakpoints or column span behavior differ → **new file** in `app/lib/homepage/`. Name it after the section (`<section>-section-grid.ts`).

Grid helpers should export:

- `*GridClassName()` — outer grid
- `*CellClassName()` or per-column variants — cell borders/padding

## 5. Rewrite the component

### Structure checklist

- [ ] `<section aria-label="…">` — no `rounded-lg` card wrapper
- [ ] Typography tokens for all visible text — no inline font sizes
- [ ] `group` on link wrappers; headlines include `angleTitleHover`
- [ ] Images: `bg-angle-paper`, no radius, explicit `aspect-*` or fixed dimensions
- [ ] Read time: `variant="angle"` or section-specific mono meta
- [ ] Solid borders from grid helper — no `divide-dotted`
- [ ] Secondary rows: `.divider-dashed` unless mock uses solid at a breakpoint
- [ ] `aria-label` on story links
- [ ] Focus rings: `outline-angle-red outline-offset-[3px]`

### Data wiring

Prefer reshaping in the component over changing GROQ when the mock only changes layout:

```tsx
// Example: 2 leads + 4 subs → 2 columns of (lead + 2 subs)
<TechColumn lead={featured[0]} subs={secondary.slice(0, 2)} />
<TechColumn lead={featured[1]} subs={secondary.slice(2, 4)} />
```

### Spacing with adjacent sections

If two sections are visually paired (e.g. More Sections + Trending):

- Group in `homepage-below-fold.tsx`
- Let the lower section own `mt-*` for internal gap
- Avoid double `space-y-16` between paired sections

## 6. Update skeleton (if applicable)

If the section has a loading placeholder, mirror:

- Header/rule structure
- Grid column count and borders
- Image aspect ratios

Low-traffic sections may share a generic skeleton — document the gap in `homepage-section-revamps.md`.

## 7. Verify

### Build

```bash
cd frontend && npm run build
```

### Viewport matrix

Test every breakpoint **from the mock**, not Tailwind defaults:

| Mock breakpoint | Verify |
|-----------------|--------|
| Desktop (widest) | Column count, vertical dividers, dark panels |
| First tablet cut | 2-col layout, gutters, panel theme switch |
| Second tablet cut | 1-col stack |
| Optional small cut (520px) | Typography scale, border style swaps |

### Interaction

- Headline hover → `angle-inkSoft` (not red)
- Keyboard focus visible on links
- Single-link cards: entire hit area navigates correctly

## 8. Document

Add an entry to [homepage-section-revamps.md](./homepage-section-revamps.md):

- Reference mock name / purpose
- Files touched
- Before/after table
- Breakpoint-specific behavior
- Data mapping if non-obvious

## Anti-patterns (do not reintroduce)

1. **Reusing wrong grid helper** to save lines — causes subtle border bugs at tablet widths
2. **SectionHeader** for mono kickers — mock uses plain text + CSS dot
3. **Tailwind `divide-dotted`** — mock uses solid hairlines or custom dashed gradient
4. **news-primary hover** on Angle headlines — breaks visual consistency
5. **Hardcoded breakpoints** as `lg:` when mock says 1100px or 1000px
6. **Changing GROQ** when only layout changed — increases risk without user request
7. **Rounded image corners** — Angle listing images are square-edged

## File checklist (typical revamp)

```
app/lib/typography/<section>.ts          # new or updated tokens
app/lib/homepage/<section>-grid.ts      # if breakpoints are unique
app/components/Landing/<Section>/        # rewritten component
app/components/Landing/below-fold-placeholder.tsx  # skeleton if needed
design-decisions/homepage-section-revamps.md       # changelog entry
```

## Reference: token file index

| Section | Typography module |
|---------|-------------------|
| First (hero) | `first-section.ts` |
| Second (More Sections) | `second-section.ts` |
| Third (Trending) | `third-section.ts` |
| Fourth (Tech + Most Read) | `fourth-section.ts` |
| Fifth (World + Politics) | `fifth-section.ts` |

Global utilities: `read-time.ts` (`variant="angle"`), `globals.css` (`.divider-dashed`).
