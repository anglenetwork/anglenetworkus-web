# Component Recipes

Copy-paste patterns for Angle editorial blocks. Adjust sizes per mock; keep structure.

## Category / section label (red dot)

Linked category label (SecondSection columns, FourthSection TECH):

```tsx
<Link href={`/category/${slug}`} className={secCategoryLabel}>
  {name}
</Link>
```

Token example (`secCategoryLabel`):

```
mb-[22px] flex items-center gap-2
font-mono text-xs font-bold uppercase tracking-[0.12em] text-angle-ink
before:size-[7px] before:shrink-0 before:rounded-full before:bg-angle-red before:content-['']
```

Tech module uses 13px: `text-[13px]`, `mb-7`.

## Lead story card (single link)

Wrap image, optional credit, headline, and read time in one link:

```tsx
<Link href={href} className="group block" aria-label={`Read article: ${title}`}>
  <div className="relative aspect-[4/3] w-full overflow-hidden bg-angle-paper">
    <ImageRenderer fill className="object-cover" sizes="…" … />
  </div>
  {credit ? <p className={secPhotoCredit}>{credit}</p> : null}
  <h3 className={secMainHeadline}>{title}</h3>
  <ReadTimeLabel minutes={readTime} variant="angle" />
</Link>
```

### Image aspect ratios by context

| Context | Aspect | Notes |
|---------|--------|-------|
| More Sections lead | 4/3 | SecondSection |
| Tech column lead | 16/11 | FourthSection |
| Secondary thumb (More Sections) | 64×64 | `size-16` |
| Secondary thumb (Tech) | 88×88 | `size-[88px]`, 72px at ≤520px |

Images: **no border-radius**, `bg-angle-paper` fallback, `object-cover`.

### Photo credit

Left-aligned mono under image (when present):

```
mt-2.5 font-mono text-[10.5px] tracking-[0.02em] text-angle-inkSoft
```

Use `formatImageCredit(cover)` — not right-aligned `ListingPhotoCredit`.

## Secondary row (dashed divider)

```tsx
<Link
  href={href}
  className="group divider-dashed mt-[26px] flex items-start justify-between gap-4 pt-[22px]
             max-[520px]:border-angle-hairline max-[520px]:border-t max-[520px]:bg-none"
>
  <div className="min-w-0 flex-1">
    <h3 className={secSubHeadline}>{title}</h3>
    <ReadTimeLabel minutes={readTime} variant="angle" className="mt-2.5" />
  </div>
  <div className="relative size-16 shrink-0 overflow-hidden bg-angle-paper">
    <ImageRenderer width={64} height={64} sizes="64px" … />
  </div>
</Link>
```

`.divider-dashed` (`globals.css`) — **not** `divide-dotted`:

```css
background-image: linear-gradient(to right, inkSoft 33%, transparent 0%);
background-size: 8px 1.5px;
```

At ≤520px (Tech), mock switches to solid `border-t border-angle-hairline` and removes dashed background.

## Trending strip item (ThirdSection)

Single link per item — eyebrow is static text inside the link, not a separate tag link:

```tsx
<Link href={article.href} className={sectionGridCellClassName("block …")}>
  <div className={trendEyebrow}>{article.tagTitle}</div>
  <h3 className={trendHeadline}>{article.title}</h3>
  <ReadTimeLabel minutes={article.readTime} variant="angle" className="mt-0" />
</Link>
```

Eyebrow: red mono uppercase — **not** a link to `/tag/…` unless mock explicitly shows separate interaction.

## Most Read list

Panel wrapper with responsive theme:

```tsx
<div className="
  bg-angle-ink px-9 py-8 text-angle-bg
  max-[1100px]:bg-transparent max-[1100px]:px-0 max-[1100px]:pt-8 max-[1100px]:pb-0 max-[1100px]:text-angle-ink
">
  <h2 className={mostReadTitle}>Most Read</h2>
  <ul className="list-none">
    <li className="border-t border-angle-bg/15 py-5 first:border-t-0 first:pt-0 max-[1100px]:border-angle-hairline">
      …
    </li>
  </ul>
</div>
```

List item link:

```tsx
<Link href={href} className="group block focus-visible:outline …">
  <h3 className={mostReadHeadline}>{title}</h3>
  <p className={mostReadMeta}>{formatReadTimeLabel(minutes)}</p>
</Link>
```

Headline/meta tokens include responsive color in one class string (dark panel desktop, light panel tablet).

## Read time

| Variant | When |
|---------|------|
| `angle` | Default for all Angle editorial listings (11px mono) |
| Custom `<p className={techMainMeta}>` | When mock specifies 12px (Tech lead) |

Format always: `3 MIN READ` — via `formatReadTimeLabel()`.

## What to remove when revamping

| Legacy | Angle replacement |
|--------|-------------------|
| `SectionHeader` + Lucide dot | Mono label + CSS `before:` dot, or title + hairline |
| `NewsCardRowCard` | Inline lead link + `ImageRenderer` |
| `ListingPhotoCredit align="right"` | `formatImageCredit` + left mono credit |
| `homepageArticleTitleLink` | `group-hover:text-angle-inkSoft` |
| `divide-dotted` grids | Solid borders + grid helpers |
| EXCLUSIVE badge (unless in mock) | Omit |
| `rounded-lg bg-news-surface` | Flat section, no card chrome |
