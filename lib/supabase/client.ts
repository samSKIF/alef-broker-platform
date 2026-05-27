import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Browser-side Supabase client — safe to import in client components.
// Uses the public NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; respects RLS when
// Phase 2 adds it. For Phase 1, RLS is off so reads/writes are unrestricted.
//
// Memoised so re-mounts of client components (e.g. <NotificationBell>
// re-rendering on navigation) don't spin up new GoTrue auth clients under
// the same browser storage key — Supabase warns about that loudly and it
// is the recommended browser-side pattern. We still wrap creation in a
// factory so unit tests can stub it.

let browserClient: SupabaseClient<Database> | undefined;

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;
  browserClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  return browserClient;
}
