import type { HTMLAttributes, ReactNode } from "react";

// Pill-shaped filter / segmented-control chip.
//   active → navy fill, white text
//   default → white fill, ink-2 text with hairline border

type ChipProps = {
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

export function Chip({
  active = false,
  icon,
  className = "",
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      {...rest}
      className={[
        "inline-flex items-center gap-1.5 rounded-pill",
        "px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap cursor-pointer",
        active
          ? "bg-ink text-white border border-ink"
          : "bg-card text-ink-2 border border-line",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}
