import { ImageResponse } from "next/og";

// PWA manifest icon — 192×192, "any" purpose. Same brand mark as
// apple-icon at the spec size that Android home screens prefer.
// Numbered icon files sort lexically; /icon0 = 192, /icon1 = 512
// (referenced from app/manifest.ts).

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
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
            width: 138,
            height: 138,
            borderRadius: "50%",
            border: "3px solid #B6735C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B6735C",
            fontSize: 92,
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
