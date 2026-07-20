# Cover image URLs (Unsplash & Wikimedia)

Agent receives a photo URL. **Normalize before writing any `externalUrl`** (`cover`, `imageGallery`, or body `editorialImage`). Never paste page links, download links, or HTML URLs as-is.

Always set:

```txt
cover._type = "coverMedia"
cover.source = "external"
cover.alt = required
cover.caption = required (one clear sentence)
cover.creditAuthor = photographer or author name from the source photo page
cover.creditSource = "Unsplash" or "Wikimedia Commons" (or exact institution on the source page)
cover.licenseOrRights = "Unsplash License" or exact Commons license (e.g. "CC BY-SA 4.0")
```

Extract epigraph fields from the source image URL / photo page. Do not invent credits. Do not mention image styling, collage treatments, or visual effects in caption, alt, or credit fields — see [`instructions-to-publish.md`](instructions-to-publish.md) and [`image-styling.md`](image-styling.md).

---

## Unsplash (input: any `unsplash.com` or `images.unsplash.com` link)

### Do

1. Resolve to **`images.unsplash.com/photo-{timestamp}-{hash}`** (follow redirect from `/download` or photo page if needed).
2. Write **only** this query string (no other params):

| Slot | `w` | `q` |
|------|-----|-----|
| **Main Headline** (`mainHeadline: true`) | `800` | `80` |
| Default cover / frontline / rails | `800` | `80` |
| Small listing / right rail thumb | `800` | `75` |

Always include: `auto=format` and `fit=crop`.

**Template:**

```txt
https://images.unsplash.com/photo-{ID}?w={WIDTH}&q={Q}&auto=format&fit=crop
```

**Example (main headline):**

```txt
https://images.unsplash.com/photo-1737718714446-dc3fe9b5ab21?w=800&q=80&auto=format&fit=crop
```

### Do not

```txt
unsplash.com/photos/...                    ← page URL
unsplash.com/photos/.../download           ← full-size redirect (~MB)
ixlib=, ixid=, fm=, crop=, cs=, dl=       ← strip these
w=3000 or w=8000                           ← too large
```

### Main Headline rule

**Prefer Unsplash (or uploaded asset) for `mainHeadline`.** Do not use Wikimedia for the homepage hero.

---

## Wikimedia (input: Commons file page, FilePath link, or `upload.wikimedia.org` URL)

### Do

1. Open the **file page** on Wikimedia Commons; confirm license and author.
2. Copy the **direct file URL** on `upload.wikimedia.org`:

```txt
https://upload.wikimedia.org/wikipedia/commons/{1-char}/{2-char}/{Filename.ext}
```

**Example:**

```txt
https://upload.wikimedia.org/wikipedia/commons/7/71/ISRAELLEBANONBORDERFENCE.JPG
```

3. For **SVG** sources, use the **full SVG file URL** (same pattern, `.svg` extension). Do not hand-build `/thumb/` URLs.

### Do not

```txt
commons.wikimedia.org/wiki/Special:FilePath/...   ← slow; avoid especially on mainHeadline
commons.wikimedia.org/wiki/File:...               ← HTML page, not an image
/upload/.../thumb/.../2560px-...                  ← stored thumb widths break (400 errors)
```

### Main Headline rule

**Do not assign Wikimedia covers to `mainHeadline`.** Use Unsplash or upload. Wikimedia is OK for frontline, right rail, just in, and body images.

---

## Quick check before publish

```txt
[ ] externalUrl starts with https://images.unsplash.com/photo- OR https://upload.wikimedia.org/wikipedia/commons/
[ ] Unsplash URL has exactly: w, q, auto=format, fit=crop
[ ] No /download, no Special:FilePath, no /thumb/ in stored URL
[ ] mainHeadline → Unsplash or asset only
[ ] creditAuthor, creditSource, licenseOrRights filled from source page (not invented)
```
