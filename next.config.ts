import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for GitHub Pages deployment
  basePath: '',
  assetPrefix: '',
  // Use relative paths for assets
  experimental: {
    // This helps with static export paths
  }
};

export default nextConfig;
