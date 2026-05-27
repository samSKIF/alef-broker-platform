import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActivityBreakdown, ActivityRow } from "./types";

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
