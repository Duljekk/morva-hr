import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer wrapper - enabled via ANALYZE=true environment variable
// Usage: npm run build:analyze
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Configure allowed image hostnames for next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'kvwmlhalbsiywjjzvoje.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    imageSizes: [24, 32, 40, 48, 64, 80, 96, 128, 256, 384],
  },
  // Increase body size limit for Server Actions to support file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow up to 10MB (5MB files + form data overhead)
    },
    // Optimize package imports for better tree-shaking
    optimizePackageImports: ['lottie-react'],
    // NOTE: cacheComponents/PPR disabled due to incompatibility with Supabase client
    // Supabase's createBrowserClient uses Math.random() which breaks prerendering
    // The Suspense-based streaming still works for loading states
  },
  // Use webpack for SVG handling via SVGR
  webpack(config, { isServer }) {
    // Fix Windows case-sensitivity issues
    // This prevents webpack from treating paths with different casing as different modules
    config.resolve.symlinks = false;
    
    // Normalize paths to prevent case-sensitivity issues on Windows
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  // Turbopack config for SVG support
  // Turbopack requires explicit SVG handling configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Headers for service worker
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
