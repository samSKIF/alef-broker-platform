import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// PWA manifest icon — 192×192, "any" purpose. Real Alef wordmark on navy
// (logo-dark.png). Spec size for Android home screens. Logo width tuned
// so the wordmark is legible at small render scales (notification badges,
// recent-apps switcher).

const LOGO_DATA_URL = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/logo-dark.png"),
).toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_DATA_URL}
          alt="Alef"
          // Satori requires explicit numeric dimensions on <img>; logo
          // is 500×210 (2.381:1), so the height is the width divided
          // by the aspect ratio.
          width={146}
          height={61}
        />
      </div>
    ),
    { ...size },
  );
}
