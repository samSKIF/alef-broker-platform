"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/upload";
import { BROKER_COOKIE } from "@/lib/dummy-account";
import type { Broker } from "./types";

// The pre-seeded demo broker (Layla Hassan, b1 from store.jsx). Sign in as
// her to demo a rich, populated account without walking through onboarding.
const DEMO_BROKER_ID = "b1";

// Onboarding submit. Inserts a fresh Bronze broker (PRD §6.4), sets the
// broker_id cookie so subsequent server-rendered pages know who they are
// (PRD §6.3 — dummy account, no auth), then redirects to the welcome screen.
//
// Wire format is FormData so we can carry an optional profile photo File
// alongside the text fields (PRD §6.3 — "Profile photo (optional,
// skippable)"). Mirrors the admin authoring forms' convention.
export async function onboardBroker(formData: FormData): Promise<void> {
  const name = ((formData.get("name") as string) || "").trim();
  const brokerage = ((formData.get("brokerage") as string) || "").trim();
  const role = ((formData.get("role") as string) || "").trim();
  if (!name || !brokerage || !role) {
    throw new Error("Name, brokerage and role are all required.");
  }

  // Optional profile photo. Empty file inputs come through as a File with
  // size 0 — guard so we don't try to upload nothing.
  const photoEntry = formData.get("photo");
  let photoUrl: string | null = null;
  if (photoEntry instanceof File && photoEntry.size > 0) {
    photoUrl = await uploadToStorage("broker-photos", photoEntry);
  }

  const sb = createSupabaseServerClient();
  const id = "b" + Date.now();
  const { data, error } = await sb
    .from("brokers")
    .insert({
      id,
      name,
      brokerage,
      role,
      tier: "Bronze",
      points: 0,
      engagement_score: 0,
      photo_url: photoUrl,
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
