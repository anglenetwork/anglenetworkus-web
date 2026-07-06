# Angle Design Decisions

Documentation for **The Angle** editorial UI — the design language introduced via HTML/CSS reference mocks and implemented across homepage sections.

This folder is the source of truth for agents and engineers revamping legacy blocks to match the Angle standard.

## Documents

| Document | Purpose |
|----------|---------|
| [angle-design-system.md](./angle-design-system.md) | Tokens, typography, color, fonts, spacing primitives |
| [layout-and-responsive-grids.md](./layout-and-responsive-grids.md) | Grid shells, breakpoints, borders, section padding |
| [component-recipes.md](./component-recipes.md) | Reusable UI patterns: labels, links, dividers, images, read time |
| [homepage-section-revamps.md](./homepage-section-revamps.md) | What changed in Second through Fifth sections |
| [revamp-playbook.md](./revamp-playbook.md) | Step-by-step process for revamping future sections |

## Design source of truth

Reference mocks are delivered as self-contained HTML with embedded CSS using `:root` custom properties. When revamping a block:

1. Treat the mock’s **computed values** (px, aspect ratios, breakpoints) as authoritative.
2. Map CSS variables to Tailwind `angle-*` tokens (see design system doc).
3. Extract typography into `app/lib/typography/<section>.ts` — never hardcode font sizes in components.
4. Extract grid/border logic into `app/lib/homepage/*-grid.ts` when breakpoints are non-trivial.
5. Do **not** reuse a grid helper from another section unless breakpoints and column behavior match exactly.

## Implemented sections (homepage)

| Section | Component | Status |
|---------|-----------|--------|
| First (hero) | `FirstSection/` | Angle — prior revamp |
| Second (More Sections) | `SecondSection/` | Angle — revamp complete |
| Third (Trending strip) | `ThirdSection/` | Angle — revamp complete |
| Fourth (Tech + Most Read) | `FourthSection/` | Angle — revamp complete |
| Fifth (World + Politics) | `FifthSection/` | Angle — revamp complete |
| Sixth (Featured category stories) | `SixthSection/` | Angle — revamp complete |
| Seventh (Featured Stories) | `SeventhSection/` | Angle — revamp complete |
| EditorialRails (Opinion) | `EditorialRailsSection.tsx` | Legacy — pending |

## Code locations

```
frontend/
├── design-decisions/          ← this folder
├── tailwind.config.ts         ← angle.* color tokens
├── app/globals.css            ← .divider-dashed utility
├── app/lib/typography/        ← per-section type tokens
├── app/lib/homepage/          ← grid class helpers
└── app/components/Landing/    ← section components
```

## Legacy vs Angle (quick rule)

**Remove or avoid** when revamping to Angle:

- `rounded-lg bg-news-surface` card shells
- `SectionHeader` with Lucide icons (replace with mono label + CSS red dot, or title + hairline rule)
- `divide-dotted` / `border-dotted` (use solid hairlines or `.divider-dashed`)
- `homepageArticleTitleLink` / red primary hover on headlines
- Sans-serif read-time labels (`variant="news"`) in editorial blocks

**Use instead:**

- Flat sections on page background (`SitePageWidth` provides horizontal padding)
- `angle-ink`, `angle-inkSoft`, `angle-hairline`, `angle-red`, `angle-paper`, `angle-bg`
- `font-display` (Space Grotesk) for headlines; `font-mono` (Space Mono) for meta, kickers, read time
- `group-hover:text-angle-inkSoft` on linked headlines
- `ReadTimeLabel variant="angle"` or dedicated mono meta tokens
