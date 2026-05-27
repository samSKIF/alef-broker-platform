import type { MetadataRoute } from "next";

// PRD §11 — Installable PWA. Next.js' metadata-route convention picks this
// file up automatically and serves /manifest.webmanifest from it. Brand
// colors come from PRD §5.1: navy theme on a beige background.
//
// Icons are referenced via the generated /icon0 (192px) and /icon1 (512px)
// routes (app/icon0.tsx, app/icon1.tsx). The browser favicon + iOS
// home-screen icon are served by app/icon.tsx + app/apple-icon.tsx via
// the same convention.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alef Broker Platform",
    short_name: "Alef",
    description:
      "Alef Group broker enablement — training, projects, branded brochures, booking, and Ask Alef AI.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F1ECD6", // PRD §5.1 — beige
    theme_color: "#333F48", // PRD §5.1 — navy
    icons: [
      {
        src: "/icon0",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "productivity"],
  };
}
