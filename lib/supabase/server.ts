import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-side Supabase client — service-role key, bypasses RLS.
// `server-only` import guards against accidental client-bundle leaks: if a
// client component ever imports from this file, the Next.js build will fail.
//
// Use in: route handlers (/app/api/*), server actions, server components
// that need to write or bypass RLS. For broker-side reads that respect RLS
// (Phase 2 onward) use createSupabaseBrowserClient instead.

export function createSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
