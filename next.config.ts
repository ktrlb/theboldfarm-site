import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable automatic database detection/provisioning during build
  experimental: {
    // Don't analyze dependencies for auto-provisioning
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
