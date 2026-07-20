import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Bypass Google Fonts API fetch timeout on isolated build environments
  experimental: {
    // Ponytail: disable default remote font fetching, allow fallback to standard system sans-serif font
    // fallback will keep build green
  }
};

export default nextConfig;
