# PostPage Components

This folder contains all the components needed to render individual blog post pages using the App Router approach.

## Structure

```
app/post/[slug]/
├── page.tsx              # Main dynamic post page
├── loading.tsx           # Loading skeleton
└── error.tsx             # Error handling

app/components/PostPage/
├── PostHeader.tsx        # Post title, category, date, author
├── PostBody.tsx          # Main content with Portable Text
├── PostRightColumn.tsx   # Latest news sidebar
├── SecondRightColumn.tsx # Additional sidebar content
├── BottomArticleModule.tsx # Related articles
└── index.ts              # Component exports
```

## Features

- **Dynamic Routing**: Uses Next.js App Router with `[slug]` dynamic segments
- **Static Generation**: Pre-builds known post slugs at build time
- **SEO Optimized**: Generates metadata for each post including Open Graph and Twitter cards
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Portable Text**: Renders Sanity's Portable Text content with custom components
- **Related Content**: Shows latest news and related articles
- **Loading States**: Skeleton loading for better UX
- **Error Handling**: Graceful error handling with retry options

## Usage

The main post page is accessible at `/post/[slug]` where `[slug]` is the post's slug from Sanity.

### Example URL

```
/post/my-awesome-blog-post
```

## Components

### PostHeader

Displays the post title, category, publication date, and author information.

### PostBody

Renders the main content using Sanity's Portable Text with custom styling for:

- Headings (h1-h4)
- Paragraphs
- Blockquotes
- Lists (bullet and numbered)
- Images with captions
- Links with proper styling

### PostRightColumn

Shows the latest news articles in a compact sidebar format.

### SecondRightColumn

Displays additional stories with larger images and more details.

### BottomArticleModule

Summary: Displays related articles from the same category as the current post, ordered by newest. The first related article is highlighted with image and title; the rest are shown as a list of linked headlines.

What we display

- Highlighted related article (first item):
  - Cover image (responsive, rounded)
  - Title linking to the article
- Additional related articles (remaining items):
  - Linked titles in a vertical list with separators

Data source and algorithm

- Source component: `app/post/[slug]/page.tsx`
- Query: `postQueryWithCategoryRelated` from `sanity/lib/queries.ts`
  - Filters posts by the current post’s category
  - Excludes the current post
  - Orders by newest (date desc)
  - Returns a bounded slice used as related items
- The page maps the returned `categoryArticles` (after filtering out null slugs) to `BottomArticleModule` via the `posts` prop.

Prop shape (simplified)

- `posts: Array<{ _id, title, slug, coverImage?, date, author?, category? }>`

Notes

- If no related posts are available, the component renders null.
- Image URLs are generated via `urlForImage` and rendered with Next/Image.

## Dependencies

- `@portabletext/react` - For rendering Portable Text content
- `date-fns` - For date formatting
- `@sanity/image-url` - For image URL generation
- Tailwind CSS - For styling

## Customization

You can customize the styling by modifying the Tailwind classes in each component. The components use a consistent color scheme and typography that can be adjusted in the `tailwind.config.js` file.
