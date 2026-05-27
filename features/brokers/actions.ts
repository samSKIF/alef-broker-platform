"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BROKER_COOKIE } from "@/lib/dummy-account";
import type { Broker, BrokerCreateInput } from "./types";

// The pre-seeded demo broker (Layla Hassan, b1 from store.jsx). Sign in as
// her to demo a rich, populated account without walking through onboarding.
const DEMO_BROKER_ID = "b1";

// Onboarding submit. Inserts a fresh Bronze broker (PRD §6.4), sets the
// broker_id cookie so subsequent server-rendered pages know who they are
// (PRD §6.3 — dummy account, no auth), then redirects to the welcome screen.
export async function onboardBroker(input: BrokerCreateInput): Promise<void> {
  const sb = createSupabaseServerClient();
  const id = "b" + Date.now();
  const { data, error } = await sb
    .from("brokers")
    .insert({
      id,
      name: input.name,
      brokerage: input.brokerage,
      role: input.role,
      tier: "Bronze",
      points: 0,
      engagement_score: 0,
    })
    .select()
    .single<Broker>();
  if (error || !data) throw error ?? new Error("Failed to create broker");

  const c = await cookies();
  c.set(BROKER_COOKIE, data.id, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/onboarding/done");
}

// Demo shortcut on /welcome. Skips onboarding by setting the cookie to the
// pre-seeded broker b1 (Layla Hassan), who already has rich activity, so
// the CEO demo opens with a populated dashboard.
export async function continueAsDemoBroker(): Promise<void> {
  const c = await cookies();
  c.set(BROKER_COOKIE, DEMO_BROKER_ID, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/home");
}
