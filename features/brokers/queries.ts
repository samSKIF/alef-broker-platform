import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Broker } from "./types";

export async function getBrokerById(id: string): Promise<Broker | null> {
  const sb = createSupabaseServerClient();
  const { data } = await sb
    .from("brokers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}
