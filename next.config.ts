import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/catalog", destination: "/pieces", permanent: true },
      {
        source: "/catalog/:id",
        destination: "/products/:id",
        permanent: true,
      },
      { source: "/catalog/inquiry", destination: "/inquiry", permanent: false },
    ];
  },
};

export default nextConfig;
