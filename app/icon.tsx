import { ImageResponse } from "next/og";

// Browser-tab favicon. PRD §5.1 navy ground + copper "A" letterform.
// Kept small (32px) — finer details would be lost at this size.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#333F48",
          color: "#B6735C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
