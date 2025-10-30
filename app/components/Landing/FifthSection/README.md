# MainFifthSection

Summary: Displays the latest 9 posts for a given category. The first 4 posts render in the center column, and the remaining 5 render in the right column beneath the Most Read block.

## What we display

- Center column (primary content)
  - First 4 latest posts for the category
  - The first item is treated as the main feature in `CenterColumnFifth`
  - Each item includes title, author, and image

- Right column (adjacent rail)
  - Remaining 5 posts (of the 9)
  - Shown under the “MOST READ” heading in `RightColumnFifth`
  - Each item includes an optional thumbnail and title with rank numbers

## Data source and algorithm

- Source: `app/page.tsx`
- Query used: `latestNineByCategoryQuery` from `sanity/lib/queries.ts`
  - Filters posts by the provided `categorySlug`
  - Visibility: published posts with newest-first ordering (date desc, then \_updatedAt)
  - Limit: 9 posts

- Mapping in `MainFifthSection` (`mainFifthSection.tsx`)
  - `centerArticles = posts.slice(0, 4)` → passed to `CenterColumnFifth`
  - `mostReadArticles = posts.slice(4, 9)` → passed to `RightColumnFifth`

## Props (simplified)

```
interface MainFifthSectionProps {
  posts: Post[];           // latest 9 posts for the category
  categoryTitle: string;   // display title for the section header
}
```

## Notes

- Image URLs are generated via `urlForImage` and rendered with Next/Image.
- If fewer than 9 posts exist, the columns gracefully render with the available items.
- The right column’s “MOST READ” heading reflects layout placement; items are still the remaining latest posts for the category.
