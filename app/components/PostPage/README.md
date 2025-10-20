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

Shows related articles at the bottom of the post with a grid layout.

## Dependencies

- `@portabletext/react` - For rendering Portable Text content
- `date-fns` - For date formatting
- `@sanity/image-url` - For image URL generation
- Tailwind CSS - For styling

## Customization

You can customize the styling by modifying the Tailwind classes in each component. The components use a consistent color scheme and typography that can be adjusted in the `tailwind.config.js` file.
