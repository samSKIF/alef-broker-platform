import { ImageResponse } from "next/og";

// PWA manifest icon — 512×512, "any" + "maskable" purposes (the manifest
// in app/manifest.ts references this URL twice with different purposes).
// 512 is the spec size for Android splash screens + app drawer.

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#333F48",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            // Maskable safe zone — inner 80% so Android adaptive icons
            // never crop the brand mark.
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "8px solid #B6735C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B6735C",
            fontSize: 246,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size },
  );
}
