import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Broker, BrokerRosterRow } from "./types";

export async function getBrokerById(id: string): Promise<Broker | null> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("brokers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

// Admin roster (PRD §7.2). Returns every broker plus their per-broker
// activity rollup — visits / shares / modules-completed counts and the
// timestamp of their most recent activity row. Joined in code rather
// than SQL because Phase 1 sits at ~8 brokers, ~450 activity rows.
export async function listAllBrokers(): Promise<BrokerRosterRow[]> {
  const sb = createSupabaseServerClient();
  const [brokersResp, activityResp] = await Promise.all([
    sb
      .from("brokers")
      .select("*")
      .order("engagement_score", { ascending: false }),
    sb
      .from("activity")
      .select("broker_id, type, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const brokers = brokersResp.data ?? [];
  const activity = activityResp.data ?? [];

  return brokers.map((b) => {
    const rows = activity.filter((a) => a.broker_id === b.id);
    return {
      ...b,
      visits: rows.filter((r) => r.type === "visit_booked").length,
      shares: rows.filter((r) => r.type === "brochure_shared").length,
      modulesCompleted: rows.filter((r) => r.type === "module_completed")
        .length,
      lastActiveIso: rows[0]?.created_at ?? null,
    };
  });
}
