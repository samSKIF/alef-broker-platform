import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "./types";

export async function listPublishedProjects(): Promise<Project[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("name");
  return data ?? [];
}

// Admin variant — includes drafts. Sorted by created_at desc so newly
// added projects float to the top.
export async function listAllProjects(): Promise<Project[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}
