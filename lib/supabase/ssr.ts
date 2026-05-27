import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Cookie-aware Supabase client for server components, server actions, and
// route handlers. Uses @supabase/ssr to read/write the auth-session cookies
// that supabase-js v2 manages on behalf of the user. The middleware in
// `/middleware.ts` is what keeps the JWT cookie auto-refreshed — this
// helper just consumes the current session.
//
// Phase 2 item 2.1 (real auth) lives on top of this; queries that need
// to bypass RLS (admin actions, AI route handler reading broker rows
// across users) still use `createSupabaseServerClient` from ./server.ts
// which uses the service-role key.

export async function createSupabaseSessionClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Setting cookies from a server component throws — that's
          // expected. The middleware handles the actual cookie writes
          // on each navigation; this catch keeps Server Components
          // happy while still letting Server Actions / Route Handlers
          // set cookies as intended.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions),
            );
          } catch {
            // no-op — see comment above
          }
        },
      },
    },
  );
}
