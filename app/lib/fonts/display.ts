import { Space_Grotesk } from "next/font/google";

/** Display/headline font (Space Grotesk). Preloaded — headlines, titles, wordmark. */
export const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
