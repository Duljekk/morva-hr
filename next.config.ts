import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for Server Actions to support file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow up to 10MB (5MB files + form data overhead)
    },
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
  // Empty turbopack config to silence the warning
  // We use webpack for SVG support via SVGR
  turbopack: {},
};

export default nextConfig;
