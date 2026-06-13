import { Archivo } from "next/font/google";

/** Primary UI sans (Tailwind `font-sans`). Preloaded — used on every route. */
export const sansFont = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
