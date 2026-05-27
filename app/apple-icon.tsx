import { ImageResponse } from "next/og";

// iOS home-screen icon (apple-touch-icon). PRD §5.1 navy ground + a copper
// roundel framing the "A" — iOS auto-rounds the corners so we don't need
// rounded-rect masking. 180px is the spec size.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: "3px solid #B6735C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#B6735C",
            fontSize: 86,
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
