import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Module } from "./types";

export async function listPublishedModules(): Promise<Module[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("modules")
    .select("*")
    .eq("published", true)
    .order("kind")
    .order("created_at");
  return data ?? [];
}

export async function listModulesForProject(projectId: string): Promise<Module[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("modules")
    .select("*")
    .eq("published", true)
    .eq("project_id", projectId);
  return data ?? [];
}

// Set of module IDs the broker has a `module_completed` activity row for.
// Powers the academy's done/locked/in-progress UI states.
export async function listCompletedModuleIds(
  brokerId: string,
): Promise<Set<string>> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("activity")
    .select("module_id")
    .eq("broker_id", brokerId)
    .eq("type", "module_completed")
    .not("module_id", "is", null);
  return new Set((data ?? []).map((r) => r.module_id as string));
}
