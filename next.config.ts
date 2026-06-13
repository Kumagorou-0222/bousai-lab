import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    tsconfigPath: "tsconfig.build.json",
  },
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
