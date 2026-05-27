import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "./supabase/ssr";
import { createSupabaseServerClient } from "./supabase/server";
import type { Broker } from "@/features/brokers/types";

// PROJECT_PLAN 2.1 — real broker authentication via Supabase Auth.
//
// `auth.users` rows are the source of truth for "who is signed in"; each
// row is linked to a `public.brokers` row via `brokers.user_id`. The
// helpers below are the only API the rest of the app should use to ask
// "who is the current broker?". Pages no longer read a `broker_id` cookie
// directly — that pre-1.5 flow is gone (see PRD §12 history).

/** The broker row linked to the current auth user, or null if no session. */
export async function getCurrentBroker(): Promise<Broker | null> {
  const sb = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  // Use the service-role client for the broker lookup. Phase 1 has RLS
  // disabled (PROJECT_PLAN 2.7); when 2.7 lands we'll add a policy
  // "user can read their own broker row" and switch this to the
  // session client. For now service-role is the safe default — RLS
  // policy mistakes can't lock the user out of their own profile.
  const admin = createSupabaseServerClient();
  const { data } = await admin
    .from("brokers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
}

/**
 * Convenience: returns the broker, or redirects appropriately:
 *   - no auth session       → /welcome
 *   - signed in, no profile → /onboarding/name
 *
 * Use this in server components that should only render for signed-in
 * brokers with a complete profile (home, projects, academy, etc.). The
 * two-step redirect handles the edge case where /signup succeeded but
 * the broker bailed out of /onboarding/name without saving — they keep
 * their auth session and resume onboarding next visit instead of being
 * bounced back to /welcome.
 */
export async function requireBroker(): Promise<Broker> {
  const sb = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/welcome");

  const admin = createSupabaseServerClient();
  const { data: broker } = await admin
    .from("brokers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!broker) redirect("/onboarding/name");
  return broker;
}

/**
 * Signs the user out and clears the Supabase session cookies. Server
 * Action callable from a <form> — usually paired with redirect("/welcome").
 */
export async function signOutCurrentUser(): Promise<void> {
  const sb = await createSupabaseSessionClient();
  await sb.auth.signOut();
}
