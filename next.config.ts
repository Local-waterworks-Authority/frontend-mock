import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  output: "export",
  distDir: "dist",
};

export default nextConfig;
