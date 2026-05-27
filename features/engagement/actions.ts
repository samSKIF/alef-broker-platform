"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import type { ActivityType } from "./types";

// Server action callable from client components (brochure-share buttons,
// booking submit, module completion). Each call writes one row to the
// `activity` table — the heart of the measurement system (PRD §8.6).
export async function logActivity(input: {
  broker_id: string;
  type: ActivityType;
  project_id?: string | null;
  module_id?: string | null;
  meta?: Json | null;
}): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb.from("activity").insert({
    broker_id: input.broker_id,
    type: input.type,
    project_id: input.project_id ?? null,
    module_id: input.module_id ?? null,
    meta: input.meta ?? null,
  });
  if (error) throw error;
}
