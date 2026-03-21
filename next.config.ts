import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bousai-lab.vercel.app",
      },
    ],
  },
};

export default nextConfig;
