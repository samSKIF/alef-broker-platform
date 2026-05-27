import type { ButtonHTMLAttributes, ReactNode } from "react";

// Primary action surface. Matches the design's Button API:
//   kind  — primary (navy) · accent (copper) · ghost · tint
//   size  — sm · md · lg (lg = 56px CTA per PRD §5.4)
//   icon  — left-aligned slot
//   iconRight — right-aligned slot
//   full  — stretches to container width

type ButtonKind = "primary" | "accent" | "ghost" | "tint";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  kind?: ButtonKind;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">;

const KIND_CLASSES: Record<ButtonKind, string> = {
  primary:
    "bg-ink text-white shadow-[0_4px_14px_rgba(51,63,72,0.20)] hover:bg-ink-2",
  accent:
    "bg-accent text-white shadow-[var(--shadow-accent)] hover:bg-accent-2",
  ghost:
    "bg-transparent text-ink border border-line hover:bg-bg",
  tint: "bg-tint text-accent-2 hover:bg-tint/80",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-12 px-[22px] text-[15px]",
  lg: "h-14 px-[26px] text-base",
};

export function Button({
  kind = "primary",
  size = "md",
  icon,
  iconRight,
  full = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-pill font-semibold tracking-[-0.01em]",
        "transition-colors duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        KIND_CLASSES[kind],
        SIZE_CLASSES[size],
        full ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
