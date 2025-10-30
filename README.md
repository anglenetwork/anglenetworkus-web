# Next.js & Sanity News Blog

A modern, high-performance news website built with Next.js 15 and Sanity CMS, featuring a comprehensive content management system and responsive design optimized for news publishing.

## 🏗️ Site Structure

### Frontend Architecture

```
app/
├── (sanity)/                    # Sanity Studio routes
│   └── studio/[[...tool]]/     # Content management interface
├── api/                        # API endpoints
│   ├── draft-mode/enable/      # Draft mode functionality
│   └── search/                 # Search API
├── category/[slug]/            # Dynamic category pages
├── components/                 # Reusable UI components
│   ├── Landing/               # Homepage section components
│   ├── PostPage/              # Individual post components
│   ├── layout/                # Layout and navigation
│   └── ui/                    # Base UI components
├── post/[slug]/               # Dynamic post pages
├── search/                    # Search results page
└── globals.css               # Global styles
```

### Content Management System

```
sanity/
├── schemas/
│   ├── documents/            # Content type definitions
│   │   ├── post.ts          # Article schema
│   │   ├── category.ts      # Category schema
│   │   ├── author.ts        # Author profiles
│   │   ├── topic.ts         # Topic/entity schema
│   │   ├── tag.ts           # Tagging system
│   │   └── comment.ts       # Comment system
│   ├── objects/             # Reusable field types
│   │   ├── blockContent.ts  # Rich text content
│   │   └── seo.ts           # SEO metadata
│   └── singletons/          # Site-wide settings
└── lib/                     # Sanity configuration
```

## 📰 Website Sections

### Homepage Layout

The homepage features a sophisticated multi-section layout designed for news consumption:

#### 1. **Main First Section** - Hero & Latest News

- **Left Column**: Latest news feed with article previews
- **Center Column**: Featured main story with large image and headline
- **Right Column**: Side stories and most read articles
- **Mobile**: Responsive single-column layout

#### 2. **Second Section** - Breaking News

- Trending topics and breaking news alerts
- Quick access to urgent stories
- Social media integration

#### 3. **Highlights Stories** - Multimedia Content

- Video content player with thumbnail navigation
- Interactive video selection
- Featured multimedia stories

#### 4. **Third Section** - Politics Category

- Dedicated politics news section
- Most read articles sidebar
- Category-specific content organization

#### 5. **Fourth Section** - US News

- US-focused news content
- Video content sidebar
- Three-column responsive layout

#### 6. **Sixth Section** - International News

- Global news coverage
- Featured international articles
- Multi-column article grid

#### 7. **Seventh Section** - Additional Content

- Extended international coverage
- Related article recommendations
- Content continuation

### Content Pages

#### **Individual Post Pages**

- Full article content with rich text rendering
- Author information and publication details
- Related articles and latest news sidebar
- Social sharing functionality
- SEO-optimized metadata

#### **Category Pages**

- Dynamic category-specific content
- Filtered article listings
- Category-specific navigation
- Breadcrumb navigation

#### **Search Results**

- Full-text search across all content
- Real-time search suggestions
- Filter by category and topic
- Paginated results

## 🛠️ Tech Stack

### Frontend Technologies

- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript**: Type-safe development with full type coverage
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for consistent UI
- **Lucide React**: Modern icon library
- **Portable Text**: Rich text rendering for Sanity content

### Content Management

- **Sanity CMS**: Headless content management system
- **Sanity Studio**: Native content authoring interface
- **GROQ**: Powerful query language for content retrieval
- **Sanity TypeGen**: Automatic TypeScript type generation
- **Sanity AI Assist**: AI-powered content assistance

### Development & Build Tools

- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing
- **Vercel Speed Insights**: Performance monitoring

### Performance & Optimization

- **Static Site Generation**: Pre-built pages for optimal loading
- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic bundle optimization
- **Incremental Static Revalidation**: Content updates without full rebuilds
- **Edge Functions**: Serverless API endpoints for global performance

### Content Types & Schema

#### **Posts**

- Rich text content with Portable Text
- Cover images with hotspot support
- Category and tag associations
- Author attribution
- SEO metadata
- Publication scheduling

#### **Categories**

- Hierarchical category structure
- Custom colors and emojis
- Hero images and descriptions
- Navigation titles

#### **Authors**

- Profile information and bios
- Social media links
- Role and title definitions
- Profile images with alt text

#### **Topics & Tags**

- Entity-based topic system (people, organizations, places, events)
- Flexible tagging system
- Cross-content associations

## 🎨 Design System

### Typography

- Custom font stack optimized for readability
- Clear heading hierarchy (H1-H6)
- Optimized line heights and spacing
- Responsive font sizing

### Layout

- **Mobile-First**: Responsive design starting from mobile
- **Grid System**: CSS Grid and Flexbox for complex layouts
- **Breakpoints**: Tailwind CSS responsive utilities
- **Spacing**: Consistent spacing scale throughout

### Color Scheme

- News-focused color palette
- Semantic color usage (success, warning, error)
- High contrast for accessibility
- Category-specific color coding

### Components

- **Cards**: Article preview cards with hover effects
- **Navigation**: Responsive header with category navigation
- **Forms**: Accessible search and contact forms
- **Modals**: Overlay components for interactions
- **Loading States**: Skeleton loading for better UX

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px (single column)
- **Tablet**: 768px - 1024px (two-column grid)
- **Desktop**: 1024px+ (multi-column layout)

### Layout Adaptations

- **Mobile**: Stacked content with touch-optimized interactions
- **Tablet**: Two-column layout with improved spacing
- **Desktop**: Full multi-column layout with sidebar content

## 🔍 Search & Navigation

### Search Functionality

- **Full-text Search**: Search across posts, categories, and topics
- **Real-time Results**: Instant search suggestions
- **Advanced Filtering**: Category and topic-based filtering
- **Search API**: Dedicated GROQ-powered search endpoint

## 🔎 Search Algorithm

### Overview

The search feature fetches, sorts, and displays posts based on user queries with two strategies: Relevancy (default) and Newest. It prioritizes recent engagement and freshness for high-quality results.

### Architecture

1. Frontend — `app/search/SearchResults.tsx`
   - Search bar, sorting controls, paginated results
   - State: `sortBy` ("relevancy" | "newest"), `currentPage`, `searchResults`
2. API — `app/api/search/route.ts`
   - Accepts `q`, `sort`, `postLimit` (default 10)
   - Tokenizes query and applies prefix matching (each term gets `*`)
   - Chooses GROQ: `searchPostsRelevanceQuery` or `searchPostsNewestQuery`
3. Data — `sanity/lib/queries.ts`
   - GROQ queries filter to published posts and project only needed fields

### Algorithm Details

Relevancy (default)

- Filters to published posts
- Applies multi-field search filter (see Filtering)
- Sorts by `views7d` desc, then `publishedAt` desc

Newest

- Same filters as Relevancy
- Sorts by `publishedAt` desc only

### Search Filtering

Fields matched (case-insensitive, prefix-tokenized):

- Title, excerpt, epigraph
- Body content (rich body and legacy text fields)
- Category name
- Tag titles (supports legacy `name`)
- Author name
- Tag aliases (see below)

Query processing:

1. Tokenization by whitespace
2. Prefix matching for each token (adds `*`)
3. Combined term string matched across fields

### Tag Aliases Matching (Important)

- Posts can be discovered by searching any alias of their tags.
- Implementation in GROQ dereferences tag references and checks alias elements with prefix matching:

```12:18:sanity/lib/queries.ts
count(tags[]->aliases[@ match $term]) > 0
```

Why: `tags` is an array of references; alias data lives on the tag docs. We dereference with `tags[]->` and evaluate `@ match $term` for each alias element. This fixes missed results when searching for a tag’s alias (e.g., searching "presidency" returns posts tagged "White House").

Constraints and behavior:

- Matching is case-insensitive and prefix-based due to tokenization (e.g., "presiden\*" matches "presidency").
- Exact matching can be implemented with `@ == $term` if needed.

### Data Flow

1. User enters query; URL updates; results component loads
2. User toggles sort; API called with selected mode
3. API builds tokenized term, executes GROQ, returns posts
4. Client paginates and renders results

### Performance Notes

- 10 results per page (client-side slicing)
- Sanity CDN caches published reads
- Queries project only fields required by the UI and limit results

### UX

- Loading states, clear errors, empty results messaging
- URL persistence for query and sort
- Accessible controls and semantic markup

### Future Enhancements

## 🧮 Category Page: "Most Read" Algorithm

> Summary: In this component we display the 5 most viewed articles during the last 7 days for the current category.

### Overview

The Category page includes a Most Read block that highlights top-performing content per category based on recent readership. The algorithm ranks posts by `views7d` (sitewide metric), ensuring the list reflects what readers are engaging with right now.

### Algorithm

- Scope: Only posts within the current category
- Visibility: Published posts with `publishedAt` in the past
- Primary sort key: `views7d` (descending)
- Secondary sort key: `publishedAt` (descending) — used when view counts are tied or missing
- Limit: Top 5 posts

### Data Flow

1. Route loader (`app/category/[slug]/page.tsx`)
   - Fetches category posts and most viewed posts for the category
   - Maps the 5 most-viewed posts (7-day window) to the UI `Article` shape as `mostReadArticles`
   - Passes `mostReadArticles` to `CategoryPage`

2. UI rendering (`app/components/CategoryPage/CategoryPage.tsx`)
   - Displays the Most Read block using `mostReadArticles`
   - Shows rank, title, author and date; links to each post

### Query

- Source: `sanity/lib/queries.ts`
- Query used: `mostViewedQuery`
- Behavior: Selects posts where `status == "published"`, `publishedAt <= now()` and orders by `views7d` desc with a secondary recency order, then limited to 5

### Implementation Pointers

- Ensure `views7d` is tracked and updated (the list relies on it)
- If `views7d` is missing, the secondary `publishedAt` sort prevents empty or unstable lists
- To change window (e.g., 30 days), either add a `mostViewed30dQuery` or adjust the existing query and props
- If you need to include/exclude drafts or scheduled posts, change the visibility filter in the query

### Tips to Post

- Publishing quickly after a spike in traffic ensures visibility in Most Read
- Use compelling titles and images — click-throughs increase `views7d`
- Cross-link relevant articles within the same category to concentrate engagement
- Feature fresh posts during peak traffic hours to maximize the 7-day window impact

- Weighted scoring blending views, recency, priority
- Personalization and ML relevance
- Suggestions/autocomplete, faceting, boolean operators
- Analytics for search insights

### Navigation Structure

- **Header Navigation**: Main category navigation
- **Breadcrumbs**: Clear navigation hierarchy
- **Related Content**: Smart content recommendations
- **Footer Links**: Additional navigation and information

---

_Built with modern web technologies for optimal performance, accessibility, and user experience._
