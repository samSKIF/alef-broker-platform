// Shared broker-loyalty config — the tier ladder + the points rules.
// Imported by the broker Home dashboard (PRD §6.5 snapshot card) and the
// Ask Alef route handler (PRD §6.6) so both surfaces always agree.
//
// Thresholds are derived from the design's commission card ("Gold now
// from 2,500 pts") and the seeded brokers' points distribution. Points
// rules are documented in PRD §12 — they reflect the activity types the
// platform captures today and are the single source the AI quotes when a
// broker asks "how do I earn more points?". Adjust here when the program
// changes; admin can also override the narrative copy via the
// "Points & tier program" entry in /admin/ai-training.

// Tier is declared once in the shared TierBadge primitive (the source of
// truth for the visual vocabulary); we re-export here so feature consumers
// can pull everything broker-tier-related from the brokers index.
export type { Tier } from "@/components/shared";
import type { Tier } from "@/components/shared";

export const TIERS: ReadonlyArray<{ tier: Tier; threshold: number }> = [
  { tier: "Bronze", threshold: 0 },
  { tier: "Silver", threshold: 1000 },
  { tier: "Gold", threshold: 2500 },
  { tier: "Preferred", threshold: 5000 },
];

// Per-activity points awards. The platform captures three activity types
// today (visit_booked, brochure_shared, module_completed); each module
// also carries its own `points` value used when it's completed.
export const POINTS_RULES = {
  brochureShared: 25,
  visitBooked: 100,
  // module_completed awards the module's own .points field rather than a
  // flat amount — see modules table.
  perTourCompleted: 200,
} as const;

// Tier benefits — copy used by the AI when a broker asks "what do I get
// at Gold?". Kept short and editable here. The longer narrative
// (program rationale, season-specific bonuses) lives in the editable
// "Points & tier program" ai_source.
export const TIER_BENEFITS: Record<Tier, string> = {
  Bronze: "Entry tier. Full broker app access, weekly campaigns, AI assistant.",
  Silver: "Standard commission tier. Priority booking on launches.",
  Gold: "Bonus 1% commission. Branded brochure templates. Quarterly Alef events.",
  Preferred:
    "Highest tier. Top commission bracket, exclusive launches, named account manager.",
};

// Where on the ladder a broker sits given their points.
export function getCurrentTier(points: number): Tier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].threshold) return TIERS[i].tier;
  }
  return "Bronze";
}

// The next tier up + remaining points to reach it, or null if already
// at the top (Preferred).
export function nextTier(
  points: number,
): { name: Tier; remaining: number } | null {
  for (const t of TIERS) {
    if (points < t.threshold) {
      return { name: t.tier, remaining: t.threshold - points };
    }
  }
  return null;
}

// Progress fraction within the broker's current tier band — used by the
// home snapshot card's progress bar.
export function progressTowardNext(points: number): {
  value: number;
  total: number;
} {
  const next = TIERS.find((t) => points < t.threshold);
  if (!next) return { value: 1, total: 1 };
  const prevs = TIERS.filter((t) => t.threshold <= points);
  const prev = prevs[prevs.length - 1] ?? TIERS[0];
  return { value: points - prev.threshold, total: next.threshold - prev.threshold };
}
