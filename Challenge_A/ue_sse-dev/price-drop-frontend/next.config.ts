import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js's default image optimization.
  // This will cause `next/image` to render a standard `<img>` tag
  // with the original `src`, which is exactly what's needed for
  // a static export or for simplifying Docker networking.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
