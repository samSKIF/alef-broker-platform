import { Icon } from "./Icon";

// Loyalty-tier indicator. Two presentations:
//   compact   → small dot + tier name (e.g. inline next to a broker row)
//   default   → white pill with trophy + "Tier broker" label (for the Home snapshot)
// Tier colors come from PRD §5.1 and globals.css.

export type Tier = "Bronze" | "Silver" | "Gold" | "Preferred";

type TierBadgeProps = {
  tier?: Tier;
  compact?: boolean;
  className?: string;
};

const TIER_VAR: Record<Tier, string> = {
  Bronze: "var(--color-bronze)",
  Silver: "var(--color-silver)",
  Gold: "var(--color-gold)",
  Preferred: "var(--color-preferred)",
};

export function TierBadge({
  tier = "Silver",
  compact = false,
  className = "",
}: TierBadgeProps) {
  const c = TIER_VAR[tier];

  if (compact) {
    return (
      <span
        className={[
          "inline-flex items-center gap-1.5 rounded-pill",
          "py-1 pl-[7px] pr-[9px] text-label font-bold uppercase tracking-wider",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        // 0x22 = ~13% alpha — the design's faint tier-tinted background
        style={{ background: `color-mix(in srgb, ${c} 13%, transparent)`, color: c }}
      >
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: c }}
        />
        {tier}
      </span>
    );
  }

  return (
    <span
      className={[
        "inline-flex items-center gap-[7px] rounded-pill bg-white",
        "px-3 py-1.5 text-caption font-bold uppercase tracking-wider shadow-soft-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ color: c }}
    >
      <Icon name="trophy" size={13} strokeWidth={2} />
      {tier} broker
    </span>
  );
}
