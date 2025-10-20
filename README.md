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

### Navigation Structure

- **Header Navigation**: Main category navigation
- **Breadcrumbs**: Clear navigation hierarchy
- **Related Content**: Smart content recommendations
- **Footer Links**: Additional navigation and information

---

_Built with modern web technologies for optimal performance, accessibility, and user experience._
