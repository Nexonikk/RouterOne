import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allows importing types (and only types) from the backend workspace package.
  transpilePackages: [],
};

export default nextConfig;
