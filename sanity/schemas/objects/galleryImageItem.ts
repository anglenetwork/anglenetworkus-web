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
    prepare(selection: any, context: any) {
      const { media, externalUrl, caption, alt, source } = selection;

      let imageNumber: number | null = null;
      const path = context?.path;
      if (
        Array.isArray(path) &&
        path.length >= 2 &&
        typeof path[1] === "number"
      ) {
        imageNumber = path[1] + 1;
      }

      if (imageNumber === null && context?.document?.imageGallery) {
        const gallery = context.document.imageGallery;
        if (Array.isArray(gallery)) {
          const index = gallery.findIndex((item: any) => {
            if (source === "external" && item?.source === "external") {
              return item?.externalUrl === externalUrl;
            }
            if (source === "asset" && item?.source === "asset") {
              return item?.image?.asset?._ref === media?.asset?._ref;
            }
            return false;
          });
          if (index !== -1) imageNumber = index + 1;
        }
      }

      const title =
        imageNumber !== null
          ? `Image ${imageNumber}`
          : caption || alt || "Gallery Image";
      const subtitleParts = [
        source === "external" ? "External URL" : "Uploaded Asset",
        imageNumber !== null && caption ? caption : null,
      ].filter(Boolean);

      return {
        title,
        media,
        subtitle:
          subtitleParts.length > 0 ? subtitleParts.join(" • ") : undefined,
      };
    },
  },
});
