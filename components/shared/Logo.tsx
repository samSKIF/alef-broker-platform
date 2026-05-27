import Image from "next/image";

// Approved Alef logo. Brand rule (PRD §5.3): NEVER redraw — use the asset.
//   dark=false  → slate + copper on light surfaces
//   dark=true   → white + copper on dark surfaces
// PNG aspect is ~1.78:1 so height drives width.

type LogoProps = {
  height?: number;
  dark?: boolean;
  className?: string;
  alt?: string;
};

export function Logo({
  height = 28,
  dark = false,
  className = "",
  alt = "Alef",
}: LogoProps) {
  const src = dark ? "/logo-dark.png" : "/logo-light.png";
  const width = Math.round(height * 1.78);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      draggable={false}
      className={["block select-none", className].filter(Boolean).join(" ")}
      style={{ height, width: "auto" }}
    />
  );
}
