import Image from "next/image";

// Initial-based avatar fallback used everywhere a broker photo would go.
// PRD §6.5 expects a broker photo in the AppHeader; the seeded brokers have
// no photo_url so we derive initials from the name. Drop in a real photo
// later by setting the `src` prop.

type AvatarProps = {
  name: string;
  size?: number;
  src?: string | null;
  className?: string;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export function Avatar({ name, size = 40, src, className = "" }: AvatarProps) {
  const dimension = { width: size, height: size };
  const base = [
    "inline-flex items-center justify-center rounded-full overflow-hidden",
    "bg-accent text-white font-semibold select-none shrink-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (src) {
    return (
      <span className={base} style={dimension}>
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  // Font size scales with avatar size — keeps initials proportional.
  const fontSize = Math.max(10, Math.round(size * 0.38));
  return (
    <span
      className={base}
      style={{ ...dimension, fontSize }}
      aria-label={name}
    >
      {initialsOf(name)}
    </span>
  );
}
