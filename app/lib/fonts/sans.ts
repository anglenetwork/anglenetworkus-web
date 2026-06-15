import { IBM_Plex_Sans } from "next/font/google";

/** Primary UI sans (IBM Plex Sans). Preloaded — used on every route. */
export const sansFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
