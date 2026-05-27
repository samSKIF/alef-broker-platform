import Image from "next/image";
import Link from "next/link";
import type { Campaign } from "../types";

// "Alef · this week" card used by the broker Home carousel (PRD §6.5).
// Two presentations: image-led (default) and the special copper "commission"
// card from store.jsx (kind = 'commission').

type CampaignCardProps = {
  campaign: Campaign;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const href = linkTargetToHref(campaign.link_target);
  return (
    <Link
      href={href}
      className="block w-[240px] shrink-0 overflow-hidden rounded-lg border border-line bg-card shadow-soft-sm snap-start"
    >
      {campaign.kind === "commission" ? (
        <CommissionArt />
      ) : campaign.image ? (
        <div className="relative h-24 w-full overflow-hidden bg-tint">
          <Image
            src={campaign.image}
            alt=""
            fill
            sizes="240px"
            className="object-cover"
            style={{ objectPosition: "55% 60%" }}
          />
        </div>
      ) : (
        <div className="h-24 w-full bg-tint" />
      )}
      <div className="px-3.5 pb-3.5 pt-3">
        {campaign.tag && (
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
            {campaign.tag}
          </div>
        )}
        <div className="mb-1 text-[15px] font-bold leading-tight tracking-[-0.005em] text-ink">
          {campaign.title}
        </div>
        {campaign.subtitle && (
          <div className="text-[12px] text-ink-3">{campaign.subtitle}</div>
        )}
      </div>
    </Link>
  );
}

// Maps store.jsx's "go" values to real routes. Falls back to /home.
function linkTargetToHref(target: string | null): string {
  switch (target) {
    case "projects":
    case "detail":
      return "/projects";
    case "academy":
      return "/academy";
    case "activity":
      return "/activity";
    default:
      return "/home";
  }
}

// Dark commission-update card style from the design (screens-a.jsx).
// Pure decorative — no photo, copper accents, tier rail graphic.
function CommissionArt() {
  return (
    <div className="relative h-24 w-full overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="absolute -right-10 -top-12 h-[130px] w-[130px] rounded-full bg-accent opacity-30 blur-xl"
      />
      <svg
        viewBox="0 0 240 96"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <line
          x1="20"
          y1="70"
          x2="220"
          y2="70"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeDasharray="2 4"
        />
        <line
          x1="20"
          y1="70"
          x2="150"
          y2="70"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        {[20, 80, 150, 220].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy="70"
            r={i === 2 ? 6 : 4}
            fill={i <= 2 ? "var(--color-accent)" : "rgba(255,255,255,0.18)"}
            stroke={i === 2 ? "#fff" : "none"}
            strokeWidth={i === 2 ? 1.5 : 0}
          />
        ))}
        {["BR", "SI", "GO", "PR"].map((t, i) => (
          <text
            key={t}
            x={[20, 80, 150, 220][i]}
            y="86"
            fontSize="8"
            fontFamily="var(--font-sans)"
            fontWeight="700"
            textAnchor="middle"
            fill={i <= 2 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)"}
            letterSpacing="0.6"
          >
            {t}
          </text>
        ))}
      </svg>
      <div className="absolute left-3 top-3 rounded-pill bg-accent px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]">
        Q2 · 2026
      </div>
      <div className="absolute right-3.5 top-2.5 text-right leading-none">
        <div className="text-[22px] font-bold tracking-[-0.025em]">
          +1.5
          <span className="text-[13px] text-accent">%</span>
        </div>
        <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/55">
          Preferred rate
        </div>
      </div>
    </div>
  );
}
