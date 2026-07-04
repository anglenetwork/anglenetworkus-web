import { Space_Mono } from "next/font/google";

/** Monospace font (Space Mono). Meta text, numbers, read times on editorial pages. */
export const monoFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
