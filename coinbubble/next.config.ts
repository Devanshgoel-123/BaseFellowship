import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "cca-lite.coinbase.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/_next/static/:path*",
        destination: "/_next/static/:path*",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "cca-lite.coinbase.com",
          },
          {
            type: "host",
            value: "imagedelivery.net",
          },
        ],
        destination: "/404",
      },
    ];
  },
};

export default nextConfig;
