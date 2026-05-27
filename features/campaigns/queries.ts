import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Campaign } from "./types";

// PRD §6.5: "Alef · this week" carousel reads campaigns where published = true,
// ordered by schedule. The seed data carries `schedule` as free text rather
// than a date, so ordering is by created_at desc as a sensible default.
export async function listPublishedCampaigns(): Promise<Campaign[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("campaigns")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}
