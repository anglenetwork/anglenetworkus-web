/** Shared GROQ field list for coverMedia, galleryImageItem, and editorialImage. */
export const imageFieldsProjection = `
  source,
  externalUrl,
  image,
  alt,
  "caption": coalesce(caption, epigraph),
  creditAuthor,
  "creditSource": coalesce(creditSource, creditProvider)
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
