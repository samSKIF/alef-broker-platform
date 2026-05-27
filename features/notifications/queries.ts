import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Notification } from "./types";

export async function listSentNotifications(): Promise<Notification[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("notifications")
    .select("*")
    .eq("sent", true)
    .order("sent_at", { ascending: false, nullsFirst: false });
  return data ?? [];
}

// Total sent notifications, used by the AppHeader bell badge per PRD §6.5.
// (Phase 1 has no per-broker "read" state — every sent notification counts.)
export async function countSentNotifications(): Promise<number> {
  const sb = createSupabaseServerClient();
  const { count } = await sb
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("sent", true);
  return count ?? 0;
}

// Admin variant — every notification incl. drafts, newest first.
export async function listAllNotifications(): Promise<Notification[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
