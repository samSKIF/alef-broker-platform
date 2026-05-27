import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AiConfig, AiSource } from "./types";

// Read the singleton default ai_config row. Falls back to a minimal hard-
// coded shape only if the row is somehow missing — but the migration
// seeds 'default' so this should never fire in production.
export async function getAiConfig(): Promise<AiConfig> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("ai_config")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  if (data) return data;
  // Defensive fallback — keeps the route handler working if the row is
  // accidentally deleted during admin editing in 1.5.8.
  return {
    id: "default",
    instructions:
      "You are Alef AI. Only answer questions about Alef Group projects.",
    model: "gpt-4o-mini",
    temperature: 0.4,
    max_output_tokens: 600,
    updated_at: new Date().toISOString(),
  };
}

// Enabled knowledge sources, sorted in the configured order. The route
// handler concatenates these into the system prompt at request time.
export async function listEnabledAiSources(): Promise<AiSource[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("ai_sources")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return data ?? [];
}

// Admin uses this to list ALL sources (incl. disabled) for the AI Training
// screen in 1.5.8.
export async function listAllAiSources(): Promise<AiSource[]> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("ai_sources")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return data ?? [];
}
