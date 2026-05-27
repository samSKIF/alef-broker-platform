import type { Database } from "@/types/database";

export type ActivityRow = Database["public"]["Tables"]["activity"]["Row"];

// Per PRD §8.6 / store.jsx — the set of activity types we record.
export type ActivityType =
  | "visit_booked"
  | "tour_completed"
  | "brochure_shared"
  | "brochure_downloaded"
  | "module_completed"
  | "quiz_passed"
  | "workshop_attended";

// Breakdown counts for the broker's Activity dashboard (PRD §6.14) and for the
// admin Overview metrics (PRD §7.1) when we wire them.
export type ActivityBreakdown = {
  visits: number;
  shares: number;
  modulesCompleted: number;
  total: number;
};

export type WeeklyRollup = {
  day: string; // ISO yyyy-mm-dd
  label: string; // "Mon", "Tue"…
  visits: number;
  brochures: number;
  modules: number;
};

export type FunnelStage = {
  stage: string;
  value: number;
  color: string;
};

export type EngagementDistribution = {
  highly: number;
  engaged: number;
  atRisk: number;
  dormant: number;
};

export type LeaderboardBroker = {
  id: string;
  name: string;
  brokerage: string | null;
  tier: string;
  points: number;
  engagement_score: number;
};

export type AdminOverview = {
  activeBrokers: number;
  totalVisits: number;
  totalShares: number;
  totalModules: number;
  avgEngagement: number;
  weekly: WeeklyRollup[];
  distribution: EngagementDistribution;
  funnel: FunnelStage[];
  topBrokers: LeaderboardBroker[];
};
