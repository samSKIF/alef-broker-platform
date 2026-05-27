import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Browser-side Supabase client — safe to import in client components.
// Uses the public NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; respects RLS when
// Phase 2 adds it. For Phase 1, RLS is off so reads/writes are unrestricted.
//
// Factory rather than singleton so we can extend cleanly if Phase 2 wires
// cookie-based auth via @supabase/ssr — each request will need its own client.

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
