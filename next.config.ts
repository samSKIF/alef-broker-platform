import type { NextConfig } from "next";

// Derive the Supabase project's hostname from .env.local so swapping
// projects doesn't require a next.config edit. Falls back to the wildcard
// `*.supabase.co` pattern when the env var is missing (e.g. CI builds
// before .env is wired) so production deploys never hit an undefined
// hostname error.
const supabaseHostname = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    // Whitelist next/image hosts. Admin Storage uploads (project covers,
    // brochure PDFs, AI sources) write to the Supabase Storage public bucket
    // and the resulting URL points at the project's supabase.co host.
    remotePatterns: [
      supabaseHostname
        ? { protocol: "https", hostname: supabaseHostname }
        : { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1 MB; the admin authoring forms upload project covers
      // (~1 MB JPGs) and brochure PDFs (~10 MB). 20 MB is comfortably
      // larger than anything Alef ships today and well under Vercel's
      // 4.5 MB Edge / 50 MB Node hard caps in production.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
