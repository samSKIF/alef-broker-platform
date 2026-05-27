import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1 MB; the admin authoring forms upload project covers
      // (~1 MB jpgs) and brochure PDFs (~10 MB). 20 MB is comfortably
      // larger than anything Alef ships today and well under Vercel's
      // 4.5 MB Edge / 50 MB Node hard caps in production.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
