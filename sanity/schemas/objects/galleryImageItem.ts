import { defineType } from "sanity";
import { GalleryImageInput } from "../components/GalleryImageInput";
import {
  externalUrlField,
  imageAssetField,
  imageAttributionValidation,
  imageSourceField,
  mediaAltField,
  mediaCaptionAndCreditFields,
} from "../helpers/mediaFields";
import {
  buildGalleryImagePreviewSubtitle,
  buildGalleryImagePreviewTitle,
  resolveGalleryImageIndex,
  type GalleryPreviewContext,
} from "../helpers/gallery-image-preview";

export default defineType({
  name: "galleryImageItem",
  title: "Gallery Image",
  type: "object",
  validation: imageAttributionValidation,
  options: {
    modal: {
      type: "dialog",
      width: 800,
    },
  },
  components: {
    input: GalleryImageInput,
  },
  fields: [
    imageSourceField,
    externalUrlField,
    imageAssetField,
    mediaAltField,
    ...mediaCaptionAndCreditFields,
  ],
  preview: {
    select: {
      media: "image",
      externalUrl: "externalUrl",
      caption: "caption",
      alt: "alt",
      source: "source",
    },
    prepare(selection, context) {
      const { media, externalUrl, caption, alt, source } = selection;
      const imageNumber = resolveGalleryImageIndex(
        selection,
        (context ?? {}) as GalleryPreviewContext,
      );

      return {
        title: buildGalleryImagePreviewTitle(imageNumber, caption, alt),
        media,
        subtitle: buildGalleryImagePreviewSubtitle(
          source,
          imageNumber,
          caption,
        ),
      };
    },
  },
});
