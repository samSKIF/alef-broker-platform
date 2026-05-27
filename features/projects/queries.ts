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

export async function getProjectById(id: string): Promise<Project | null> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}
