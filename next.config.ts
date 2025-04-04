import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'rugged-peacock-876.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
