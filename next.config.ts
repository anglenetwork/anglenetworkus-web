// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
//     SC_DISABLE_SPEEDY: "false",
//   },
//   // Optimize bundle splitting
//   experimental: {
//     optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
//   },
//   // Configure compiler to target modern browsers and avoid unnecessary polyfills
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production' ? {
//       exclude: ['error', 'warn'],
//     } : false,
//   },
//   // Optimize for modern browsers - reduce polyfills
//   // Note: swcMinify is enabled by default in Next.js 15
//   transpilePackages: [],
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'cdn.sanity.io',
//       },
//       {
//         protocol: 'https',
//         hostname: 'upload.wikimedia.org',
//       },
//     ],
//     minimumCacheTTL: 31536000, // 1 year in seconds
//   },
//   async headers() {
//     return [
//       {
//         // Apply cache headers to Next.js image optimization route
//         source: '/_next/image',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//       {
//         // Apply cache headers to CSS files
//         source: '/_next/static/css/:path*',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Match Sanity Studio’s behavior for styled-components.
    SC_DISABLE_SPEEDY: "false",
  },

  experimental: {
    // Optimize bundle splitting for small shared deps.
    optimizePackageImports: ["lucide-react", "@radix-ui/react-slot"],
  },

  compiler: {
    // Strip console.* except errors/warnings in prod.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  transpilePackages: [],

  // 🔥 Image optimization tuned for Lighthouse & caching
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
    ],
    formats: ["image/avif", "image/webp"], // modern formats
    deviceSizes: [480, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    qualities: [60, 75, 80, 90, 100], // Configure allowed quality values
    minimumCacheTTL: 31536000, // 1 year cache
  },

  async headers() {
    return [
      {
        // Cache optimized images
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache CSS bundles
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
