import { Newsreader } from "next/font/google";

/** Article body serif (Tailwind `font-body`). Loaded only on long-form article routes. */
export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});
