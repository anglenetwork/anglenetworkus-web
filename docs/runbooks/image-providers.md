# Image providers runbook

Single source of truth for which remote hosts are optimizable vs display-only, and how to verify behavior in production-like builds.

## Policy modules

| File | Role |
|------|------|
| [`lib/editorial-image/policy.ts`](../../lib/editorial-image/policy.ts) | `OPTIMIZABLE_REMOTE_HOSTS`, `REMOTE_PATTERN_HOSTS`, Wikimedia rules, `shouldUnoptimizeExternalUrl` |
| [`lib/editorial-image/resolve.ts`](../../lib/editorial-image/resolve.ts) | `resolveEditorialImage`, `resolveListingImage` — builds `src`, `unoptimized`, optional `blurDataURL` (Sanity LQIP only) |
| [`next.config.ts`](../../next.config.ts) | `images.remotePatterns` derived from `REMOTE_PATTERN_HOSTS` |

Runtime optimization (Next.js `/_next/image`) applies only to hosts in **`OPTIMIZABLE_REMOTE_HOSTS`**:

- `cdn.sanity.io`
- `images.unsplash.com`
- `images.pexels.com`

Hosts in **`REMOTE_PATTERN_HOSTS`** but not optimizable (e.g. Wikimedia, Pixabay) may load via `next/image` with `unoptimized` or direct URL depending on resolver policy.

## Adding a new host

### Optimizable (CDN you control or license allows resizing)

1. Add hostname to `OPTIMIZABLE_REMOTE_HOSTS` in `policy.ts`.
2. Confirm it is also listed in `REMOTE_PATTERN_HOSTS` (usually spread from optimizable list).
3. Run `npm run test:unit` and `npm run build`.
4. In DevTools → Network, confirm article/listing images use `/_next/image?url=...` for that host.

### Display-only / unoptimized (rate limits, ToS, or no transformer)

1. Add hostname only to `REMOTE_PATTERN_HOSTS` if the browser must load it at all.
2. Do **not** add to `OPTIMIZABLE_REMOTE_HOSTS`.
3. Resolver should return `unoptimized: true` for that URL (`externalUnoptimized: "auto"` or explicit).
4. DevTools should show **direct** image URL, not `/_next/image`.

## Wire services (out of scope)

Do **not** add AP, Reuters, Getty, Imago, or similar wire/CDN domains without legal/product approval. These are intentionally excluded from optimizable hosts and from default remote patterns.

## LCP and preload

| Surface | LCP signal |
|---------|------------|
| Homepage hero | `centerColumnLanding` — `priority` + `fetchPriority="high"` |
| Article single cover | `ArticleMedia` — `priority` + `fetchPriority="high"` |
| Article carousel | `isCarouselLcpCandidate` — priority only on slide `index === currentIndex === 0` |
| Category / tag featured | `FeatureHero`, `TagFeaturedArticle` |
| `PreloadCoverImage` | Optional `<link rel="preload" as="image">` **without** `fetchpriority="high"` so `next/image` owns high priority |

## LQIP (Sanity assets)

GROQ projects `"lqip": image.asset->metadata.lqip` via [`sanity/lib/image-fields-projection.ts`](../../sanity/lib/image-fields-projection.ts). Resolver maps to `blurDataURL`; `ImageRenderer` uses `placeholder="blur"` only when optimized (not Wikimedia/unoptimized).

## DevTools verification checklist

- [ ] Homepage hero: one high-priority image request; carousel sections mount ≤3 `<img>` nodes.
- [ ] Article with gallery: carousel LCP only on first visible slide; no duplicate high `fetchpriority` from manual preload.
- [ ] Article detail: credit + **license** in caption (`ArticleCaption`).
- [ ] Listings / cards: credit only (`ListingPhotoCredit`, `ExcerptCreditCaption`) — no license line.
- [ ] Wikimedia: thumbnail URL + unoptimized / direct fetch (no optimizer 429s).
- [ ] Unknown external host: unoptimized direct URL.
- [ ] Sanity asset with LQIP: blur placeholder on optimized cover when metadata exists.

## Related docs

- M2 display rules: [`docs/audits/image-rendering-state.md`](../audits/image-rendering-state.md) (attribution sections)
- M3 resolver entry points: `resolveEditorialImage`, `buildArticleImageData`, `getCoverImage` → `resolveListingImage`
