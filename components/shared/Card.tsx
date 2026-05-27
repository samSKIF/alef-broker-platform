import type { HTMLAttributes, ReactNode } from "react";

// Soft surface used throughout the app.
//   white = true  → white card with hairline border
//   white = false → warm-beige (tint) card, no border
//   elevated      → swap soft-sm shadow for soft-md
// Matches the design's Card API. Pad accepts a numeric pixel value because
// the design uses values like 16/22/28 — Tailwind p-* spacings (×4) don't
// cleanly cover 14/18/22 etc., so we accept a raw number.

type CardProps = {
  white?: boolean;
  elevated?: boolean;
  pad?: number;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({
  white = true,
  elevated = false,
  pad = 16,
  className = "",
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      style={{ padding: pad, ...style }}
      className={[
        "rounded-xl",
        white ? "bg-card border border-[rgba(232,229,224,0.7)]" : "bg-tint",
        elevated ? "shadow-soft-md" : "shadow-soft-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
