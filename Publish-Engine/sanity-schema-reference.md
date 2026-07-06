# Angle Sanity Schema Reference

Concise CMS reference for Angle publishing. Source of truth: deployed Sanity schema + `sanity/schemas/`.

## Project

* Project: Angle Network (`hxfedc5p`)
* Dataset: `production`
* Local Studio: `http://localhost:3000/studio`
* Hosted Studio: `https://angle-studio.sanity.studio/`

Deploy schema changes:

```bash
npx sanity schema deploy
npx sanity deploy
```

---

## Document types

| Type        | Notes                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| `post`      | Standard news article. Category required, tags optional, author optional, homepage curation fields.       |
| `opinion`   | Viewpoint/commentary. Author required. Optional `disclosure`. No `category` or `tags` in deployed schema. |
| `analysis`  | Explainer/interpretive article. `analysisFocus`, category, and author required. Tags optional.            |
| `sponsored` | Paid/partner content. `sponsorAttribution`, category, and author required. Tags optional.                 |
| `author`    | Byline document; includes name, slug, picture, email, bio, social, Studio access fields, SEO.             |
| `category`  | Top-level taxonomy. Name, slug, optional parent/nav/display metadata, SEO.                                |
| `tag`       | Category-scoped taxonomy. Title, slug, required parent `category`.                                        |
| `settings`  | Site singleton. Title, description, footer, OG image.                                                     |

Removed: `topic`. Do not create or reference it.

---

## Article fields

Shared article-like fields:

| Field          | Notes                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| `title`        | Required. Min 4 characters.                                                    |
| `tickerTitle`  | Required. Max 40 characters.                                                   |
| `excerpt`      | Optional. Max 280 characters. Replaces `dek`.                                  |
| `slug`         | Required. `{ _type: "slug", current: "kebab-case" }`; unique per `_type`.      |
| `body`         | Required when published. Portable Text via `blockContent`.                     |
| `cover`        | Required when published. `coverMedia` object.                                  |
| `imageGallery` | Optional array of `galleryImageItem`.                                          |
| `category`     | Required on `post`, `analysis`, `sponsored`. Not present on `opinion`.         |
| `tags`         | Optional on `post`, `analysis`, `sponsored`; must belong to selected category. |
| `author`       | Optional on `post`; required on `opinion`, `analysis`, `sponsored`.            |
| `status`       | `draft` | `scheduled` | `published`; default `published`.                      |
| `publishedAt`  | Required when published. UTC datetime.                                         |
| `updatedAt`    | Optional UTC datetime.                                                         |
| `seo`          | Optional object: `title`, `description`, `ogImage`, `canonicalUrl`.            |
| `searchText`   | Optional. Do not overwrite if already set.                                     |

---

## `post` curation fields

Homepage placement uses booleans only. No rank or until fields exist.

| Field             | Notes                                                                           |
| ----------------- | ------------------------------------------------------------------------------- |
| `mainHeadline`    | Homepage lead story.                                                            |
| `frontline`       | Top stories below main headline.                                                |
| `rightHeadline`   | Right rail.                                                                     |
| `justIn`          | “Just In” rail.                                                                 |
| `breakingNews`    | Only relevant when `justIn` is true; mutually exclusive with `developingStory`. |
| `developingStory` | Only relevant when `justIn` is true; mutually exclusive with `breakingNews`.    |
| `featured`        | Editorial boost, not a rail slot.                                               |
| `priority`        | Number 0–10. Default automation value: `3`.                                     |
| `readTime`        | Number; automation should send whole minutes.                                   |
| `labels`          | Optional array: `breaking`, `exclusive`, `live`.                                |

Only one primary rail may be true: `mainHeadline`, `frontline`, `rightHeadline`, or `justIn`.

Default automation flags:

```json
{
  "mainHeadline": false,
  "frontline": false,
  "rightHeadline": false,
  "justIn": false,
  "breakingNews": false,
  "developingStory": false,
  "featured": false
}
```

---

## Object types

### `coverMedia`

Fields:

```txt
_type = "coverMedia"
source = "asset" | "external"
externalUrl = required when source is "external"
image = required when source is "asset"
alt = required when published
caption = visible caption
creditAuthor = creator/photographer
creditSource = provider/platform/institution
licenseOrRights = rights/license note
```

Published cover must have:

```txt
alt
caption
licenseOrRights
creditAuthor or creditSource
valid source + image/externalUrl
```

The same attribution fields apply to `editorialImage` and `galleryImageItem`.

---

### `blockContent`

Allowed body items:

```txt
block | editorialImage | pullQuote | articleDivider | videoEmbed | tweetEmbed
```

Text block styles:

```txt
normal | h2 | h3 | h4 | blockquote
```

Lists:

```txt
bullet | number
```

Inline annotation:

```txt
link
```

Minimal paragraph block:

```json
{
  "_type": "block",
  "_key": "body-b0",
  "style": "normal",
  "children": [
    {
      "_type": "span",
      "_key": "body-s0",
      "text": "Paragraph text.",
      "marks": []
    }
  ],
  "markDefs": []
}
```

Use stable `_key` values.

---

### `tweetEmbed`

Stored inside `body[]`.

```json
{
  "_type": "tweetEmbed",
  "_key": "body-tweet-0",
  "url": "https://x.com/user/status/1234567890"
}
```

Rules:

```txt
URL must be a status URL on twitter.com, x.com, or mobile.twitter.com
Path must include /status/{numericId}
Optional field: caption
No raw HTML, iframe code, screenshots, profile URLs, or tweet images
```

---

### Other objects

| Object               | Fields                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------- |
| `editorialImage`     | Same media fields as `coverMedia` plus required `layout`: `inline`, `wide`, or `full`. |
| `galleryImageItem`   | Same media fields as `coverMedia`.                                                     |
| `seo`                | `title`, `description`, `ogImage`, `canonicalUrl`.                                     |
| `pullQuote`          | Required `quote`; optional `attribution`, `sourceLabel`.                               |
| `articleDivider`     | Required `style`: `line` or `spacer`.                                                  |
| `videoEmbed`         | Required `provider` and `url`; optional `title`.                                       |
| `sponsorAttribution` | Required `sponsorName` and `disclosure`; optional `sponsorUrl`.                        |

---

## Reference shapes

Category:

```json
{ "_type": "reference", "_ref": "category.politics" }
```

Tag:

```json
{ "_key": "tag-0", "_type": "reference", "_ref": "tag.politics.congress" }
```

Author:

```json
{ "_type": "reference", "_ref": "59d2b194-17eb-4526-ad4f-35aaf3ea874c" }
```

Default author:

```txt
Ashley Simmons
59d2b194-17eb-4526-ad4f-35aaf3ea874c
```

Verify author IDs exist before publishing.

---

## Canonical taxonomy

Use exactly one category. Tags must belong to that category. Never invent categories or tags.

| Category ref             | Allowed tag refs                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `category.us`            | `tag.us.trump`, `tag.us.iran-war`, `tag.us.crime`, `tag.us.abortion`, `tag.us.education`, `tag.us.weather`                                           |
| `category.world`         | `tag.world.china`, `tag.world.europe`, `tag.world.middle-east`, `tag.world.latin-america`, `tag.world.africa`                                        |
| `category.politics`      | `tag.politics.immigration`, `tag.politics.white-house`, `tag.politics.congress`, `tag.politics.elections`, `tag.politics.supreme-court`              |
| `category.business`      | `tag.business.markets`, `tag.business.economy`, `tag.business.finance`, `tag.business.tariffs`, `tag.business.inflation`, `tag.business.real-estate` |
| `category.science`       | `tag.science.space`, `tag.science.life-sciences`, `tag.science.climate`                                                                              |
| `category.entertainment` | `tag.entertainment.movies`, `tag.entertainment.television`, `tag.entertainment.fashion`, `tag.entertainment.music`, `tag.entertainment.celebrity`    |
| `category.tech`          | `tag.tech.artificial-intelligence`, `tag.tech.social-media`                                                                                          |
| `category.lifestyle`     | `tag.lifestyle.food`, `tag.lifestyle.travel`, `tag.lifestyle.culture`, `tag.lifestyle.health`, `tag.lifestyle.beauty`                                |

Current taxonomy: 8 categories, 37 tags.

---

## Never write

Do not write these fields on new or updated article documents:

```txt
bodyTextOne
bodyRich
bodyBlocks
date
dek
topic
views
viewsAll
views7d
views30d
mainHeadlineRank
frontlineRank
rightHeadlineRank
justInRank
mainHeadlineUntil
frontlineUntil
rightHeadlineUntil
justInUntil
```

Use current field names only:

```txt
body
publishedAt
excerpt
cover.caption
cover.creditAuthor
cover.creditSource
cover.licenseOrRights
```

---

## Published `post` minimum

A valid automated published `post` should include:

```txt
_type = "post"
title
tickerTitle
excerpt
slug.current
body[]
category reference
optional valid tags[]
author reference, usually Ashley Simmons
cover with source, image/externalUrl, alt, licenseOrRights, credit
seo.title
seo.description
status = "published"
publishedAt = current UTC ISO
updatedAt = same as publishedAt
readTime = whole minutes
priority = 3
homepage flags = false unless requested
```
