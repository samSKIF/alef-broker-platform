import type { SVGProps } from "react";

// Alef line-icon set — 24×24 viewBox, stroke 1.6, currentColor.
// Ported from the design bundle's icons.jsx (design/alef/project/src/icons.jsx).
// Usage: <Icon name="home" size={22} />  →  inherits text color via currentColor.

export type IconName =
  | "home"
  | "academy"
  | "project"
  | "activity"
  | "chat"
  | "search"
  | "mic"
  | "bell"
  | "calendar"
  | "share"
  | "download"
  | "whatsapp"
  | "mail"
  | "play"
  | "check"
  | "lock"
  | "chevron-right"
  | "chevron-left"
  | "clock"
  | "pin"
  | "video"
  | "star"
  | "trophy"
  | "user"
  | "sparkle"
  | "arrow-right"
  | "plus"
  | "filter"
  | "close"
  | "leaf"
  | "ruler"
  | "bed";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "name">;

const PATHS: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  academy: (
    <>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M7 9v6c0 1.5 2.2 3 5 3s5-1.5 5-3V9" />
      <path d="M21 7v6" />
    </>
  ),
  project: (
    <>
      <path d="M4 21V8l8-5 8 5v13" />
      <path d="M4 21h16" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h.01M15 11h.01" />
    </>
  ),
  activity: (
    <>
      <path d="M4 20V9" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H8l-4 4z" />
      <path d="M8 9.5h8M8 13h5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0014 0" />
      <path d="M12 18v3" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0112 0v5l1.5 2H4.5L6 16z" />
      <path d="M10 21a2 2 0 004 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  share: (
    <>
      <path d="M12 3v13" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.5-4.5A8 8 0 1 1 9 19.5L4 20z" />
      <path d="M9 10c.5 2 1.5 3.5 4 4.5l1.3-1.3 2.7 1.2c-.3 1.5-2 2.6-3.5 2.3-3-.5-5.5-3-6-6-.3-1.5.8-3.2 2.3-3.5L11 9.7 9.7 11" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </>
  ),
  play: <path d="M7 4.5v15l13-7.5z" />,
  check: <path d="M5 12.5l4.5 4.5L20 6.5" />,
  lock: (
    <>
      <rect x="4.5" y="11" width="15" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  "chevron-right": <path d="M9 5l7 7-7 7" />,
  "chevron-left": <path d="M15 5l-7 7 7 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.7 5.7 6.3.9-4.5 4.4 1 6.2L12 17.8l-5.5 2.9 1-6.2-4.5-4.4 6.3-.9L12 3.5z" />
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 11-10 0V4z" />
      <path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3" />
      <path d="M10 16h4v2h-4z" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  leaf: (
    <>
      <path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16z" />
      <path d="M4 20c4-4 8-8 12-10" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="1.5" />
      <path d="M7 9v3M11 9v4M15 9v3M19 9v4" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-4a3 3 0 013-3h12a3 3 0 013 3v4" />
      <path d="M3 18v2M21 18v2M7 11V7h10v4" />
    </>
  ),
};

export function Icon({
  name,
  size = 22,
  strokeWidth = 1.6,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
