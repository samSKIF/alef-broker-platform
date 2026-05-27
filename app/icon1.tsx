import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// PWA manifest icon — 512×512, "any" + "maskable" purposes. Spec size for
// Android splash screens + app drawer. The manifest references this URL
// twice (under both purposes), so the wordmark must sit inside the
// **maskable safe zone** — the inner 80% of the canvas — so adaptive
// Android shapes (circle, rounded square, squircle) never crop the
// brand mark. We use ~65% logo width to stay comfortably inside that
// zone with margin to spare.

const LOGO_DATA_URL = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/logo-dark.png"),
).toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_DATA_URL}
          alt="Alef"
          // Satori requires explicit numeric dimensions on <img>; logo
          // is 500×210 (2.381:1), height = width / aspect. 333px wide
          // sits comfortably inside the 80% maskable safe zone
          // (410px for a 512px canvas).
          width={333}
          height={140}
        />
      </div>
    ),
    { ...size },
  );
}
