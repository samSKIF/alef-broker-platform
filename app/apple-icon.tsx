import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// iOS home-screen icon (apple-touch-icon). Real Alef wordmark on navy —
// the logo is /public/logo-dark.png (white + copper, designed for dark
// surfaces). iOS auto-rounds the corners so we don't need rounded-rect
// masking. 180px is the spec size.
//
// Logo is read from disk at build time and inlined as a base64 data URL
// so the static prerender doesn't need runtime fs access.

const LOGO_DATA_URL = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/logo-dark.png"),
).toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_DATA_URL}
          alt="Alef"
          // Satori (next/og) requires explicit numeric dimensions on
          // <img>; "auto" silently drops the image. Logo is 500×210
          // (2.381:1), so we set both axes from the canvas size.
          width={137}
          height={58}
        />
      </div>
    ),
    { ...size },
  );
}
