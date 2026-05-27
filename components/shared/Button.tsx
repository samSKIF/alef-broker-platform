import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

// Primary action surface.
//   kind  — primary (navy) · accent (copper) · ghost · tint
//   size  — sm · md · lg (lg = 56 px CTA per PRD §5.4)
//   icon  — left-aligned slot
//   iconRight — right-aligned slot
//   full  — stretches to container width
//   href  — render as a Next.js <Link> (avoids <button> nested inside <a>)

type ButtonKind = "primary" | "accent" | "ghost" | "tint";
type ButtonSize = "sm" | "md" | "lg";

type SharedProps = {
  kind?: ButtonKind;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = SharedProps & {
  href: string;
} & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof SharedProps | "href"
  >;

type BareButtonProps = SharedProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps>;

type ButtonProps = LinkButtonProps | BareButtonProps;

const KIND_CLASSES: Record<ButtonKind, string> = {
  primary:
    "bg-ink text-white shadow-[0_4px_14px_rgba(51,63,72,0.20)] hover:bg-ink-2",
  accent:
    "bg-accent text-white shadow-[var(--shadow-accent)] hover:bg-accent-2",
  ghost: "bg-transparent text-ink border border-line hover:bg-bg",
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
  const cls = [
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
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest;
    return (
      <Link href={href} className={cls} {...anchorProps}>
        {icon}
        {children}
        {iconRight}
      </Link>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={cls}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
