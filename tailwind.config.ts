import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // 24 columns
        24: "repeat(24, minmax(0, 1fr))",
      },
      fontFamily: {
        /** Primary UI sans (IBM Plex Sans) */
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        /** Article body / long-form reading (Spectral) */
        body: ["var(--font-body)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sectionAccent: "hsl(var(--section-accent))",
        editorialKicker: "hsl(var(--editorial-kicker))",
        link: "hsl(var(--text-link))",
        /**
         * Angle global semantic color tokens — Palette 2: Minimal Black + Signal Red.
         * Reusable via bg-news-background, text-news-primary, border-news-border, etc.
         * Landing page and legacy components are not wired to these yet.
         */
        news: {
          background: colors.stone[50],
          surface: colors.white,
          text: colors.gray[900],
          muted: colors.gray[500],
          border: colors.gray[200],
          primary: {
            DEFAULT: colors.red[700],
            soft: colors.red[100],
          },
          secondary: colors.gray[800],
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography, tailwindcssAnimate],
};

export default config;
