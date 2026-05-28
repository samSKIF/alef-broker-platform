import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActivityBreakdown,
  ActivityRow,
  AdminOverview,
} from "./types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export async function listBrokerActivity(
  brokerId: string,
  limit = 50,
): Promise<ActivityRow[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("activity")
    .select("*")
    .eq("broker_id", brokerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getBrokerBreakdown(
  brokerId: string,
): Promise<ActivityBreakdown> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("activity")
    .select("type")
    .eq("broker_id", brokerId);
  const rows = data ?? [];
  const visits = rows.filter((r) => r.type === "visit_booked").length;
  const shares = rows.filter((r) => r.type === "brochure_shared").length;
  const modulesCompleted = rows.filter(
    (r) => r.type === "module_completed",
  ).length;
  return {
    visits,
    shares,
    modulesCompleted,
    total: rows.length,
  };
}

// PRD §7.1 — Admin Overview snapshot. Aggregates the brokers + activity
// tables into the KPIs + weekly chart + distribution + funnel + leaderboard.
// Phase 1 simplification: tour_completed / offers / transactions don't yet
// exist as activity types we seed — we synthesise the tail of the funnel
// from the visit count using documented conversion ratios. Switching to
// real per-stage activity is Phase 2 (PROJECT_PLAN follow-ups + PRD §12).
export async function getAdminOverview(): Promise<AdminOverview> {
  const sb = createSupabaseServerClient();

  const [{ count: activeBrokers }, brokersResp, activityResp] =
    await Promise.all([
      sb.from("brokers").select("*", { count: "exact", head: true }),
      sb.from("brokers").select("id, name, brokerage, tier, points, engagement_score, photo_url"),
      sb.from("activity").select("type, created_at"),
    ]);

  const brokers = brokersResp.data ?? [];
  const activity = activityResp.data ?? [];

  const totalVisits = activity.filter((r) => r.type === "visit_booked").length;
  const totalShares = activity.filter(
    (r) => r.type === "brochure_shared",
  ).length;
  const totalModules = activity.filter(
    (r) => r.type === "module_completed",
  ).length;
  const totalTours = activity.filter((r) => r.type === "tour_completed").length;

  const avgEngagement =
    brokers.length === 0
      ? 0
      : Math.round(
          brokers.reduce((s, b) => s + b.engagement_score, 0) / brokers.length,
        );

  // Weekly — last 7 days inclusive of today.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { iso: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: DAY_LABELS[d.getDay()],
    });
  }
  const weekly = days.map(({ iso, label }) => {
    const rows = activity.filter((r) => r.created_at?.startsWith(iso));
    return {
      day: iso,
      label,
      visits: rows.filter((r) => r.type === "visit_booked").length,
      brochures: rows.filter((r) => r.type === "brochure_shared").length,
      modules: rows.filter((r) => r.type === "module_completed").length,
    };
  });

  // Engagement distribution buckets per PRD §7.1.
  const distribution = {
    highly: brokers.filter((b) => b.engagement_score >= 80).length,
    engaged: brokers.filter(
      (b) => b.engagement_score >= 60 && b.engagement_score < 80,
    ).length,
    atRisk: brokers.filter(
      (b) => b.engagement_score >= 30 && b.engagement_score < 60,
    ).length,
    dormant: brokers.filter((b) => b.engagement_score < 30).length,
  };

  // Funnel: real for the heads we have; Phase 1 simplification for the
  // conversion tail. Conversion ratios borrowed from the design's
  // SEED_FUNNEL (~26 % offer rate / ~10 % transaction rate of visits).
  const funnel = [
    {
      stage: "Brochures shared",
      value: totalShares,
      color: "var(--color-balance)",
    },
    {
      stage: "Visits booked",
      value: totalVisits,
      color: "var(--color-possibilities)",
    },
    {
      stage: "Tours completed",
      value: totalTours || Math.round(totalVisits * 0.82),
      color: "var(--color-gold)",
    },
    {
      stage: "Offers submitted",
      value: Math.round(totalVisits * 0.26),
      color: "var(--color-accent)",
    },
    {
      stage: "Transactions",
      value: Math.round(totalVisits * 0.1),
      color: "var(--color-ink)",
    },
  ];

  const topBrokers = [...brokers]
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 5);

  return {
    activeBrokers: activeBrokers ?? 0,
    totalVisits,
    totalShares,
    totalModules,
    avgEngagement,
    weekly,
    distribution,
    funnel,
    topBrokers,
  };
}
