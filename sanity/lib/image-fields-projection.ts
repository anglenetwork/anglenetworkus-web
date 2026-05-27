/** Shared GROQ field list for coverMedia, galleryImageItem, and editorialImage. */
export const imageFieldsProjection = `
  source,
  externalUrl,
  image,
  "lqip": image.asset->metadata.lqip,
  alt,
  "caption": coalesce(caption, epigraph),
  creditAuthor,
  "creditSource": coalesce(creditSource, creditProvider),
  licenseOrRights
`;

export const coverFieldsProjection = `
  cover{
    ${imageFieldsProjection}
  }
`;

export const imageGalleryFieldsProjection = `
  "imageGallery": imageGallery[]{
    ${imageFieldsProjection}
  }
`;
