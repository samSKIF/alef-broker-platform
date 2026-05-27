"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseSessionClient } from "@/lib/supabase/ssr";
import { uploadToStorage } from "@/lib/supabase/upload";
import type { Broker } from "./types";

// PROJECT_PLAN 2.1 — real Supabase Auth replaces the old `broker_id`
// dummy cookie. The pre-1.5 `onboardBroker(input)` that created a
// broker row from scratch is gone; the new flow is:
//
//   /signup    → signUpWithEmail()         (this file, signUpBroker)
//   /onboarding/name → onboardBroker(formData)   (links profile to auth user)
//   /home      → requireBroker()           (lib/auth.ts)
//
//   /login     → signInWithPassword()      (this file, signInBroker)
//   /welcome   → signInAsDemoBroker()      (real signIn with env-stored creds)
//   anywhere   → signOutBroker()           (clears session, redirects to /welcome)

// ---------------------------------------------------------------------
// Sign-up: create the auth.users row. The broker profile (name, role,
// brokerage, photo) is collected next at /onboarding/name.
// ---------------------------------------------------------------------
export async function signUpBroker(formData: FormData): Promise<void> {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (password !== confirm) {
    throw new Error("Passwords don't match.");
  }

  const sb = await createSupabaseSessionClient();
  const { error } = await sb.auth.signUp({
    email,
    password,
    options: {
      // Auto-confirm in the POC — no email verification step. Phase 2
      // can turn this on (Supabase Dashboard → Auth → Email confirm).
      emailRedirectTo: undefined,
    },
  });
  if (error) throw new Error(error.message);

  redirect("/onboarding/name");
}

// ---------------------------------------------------------------------
// Sign-in for returning brokers. After auth lands, redirect to /home;
// requireBroker() bounces to /onboarding/name if the profile is missing
// (signed up but didn't finish onboarding last time).
// ---------------------------------------------------------------------
export async function signInBroker(formData: FormData): Promise<void> {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const sb = await createSupabaseSessionClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    // Don't leak whether the email exists — same message either way.
    throw new Error("Email or password is incorrect.");
  }

  redirect("/home");
}

// ---------------------------------------------------------------------
// Sign-out. Called from a <form action={signOutBroker}> button anywhere
// inside the broker app.
// ---------------------------------------------------------------------
export async function signOutBroker(): Promise<void> {
  const sb = await createSupabaseSessionClient();
  await sb.auth.signOut();
  redirect("/welcome");
}

// ---------------------------------------------------------------------
// Demo affordance on /welcome — signs in as the pre-provisioned demo
// broker (Layla Hassan, b1). Credentials live in env so the password
// can rotate without a code change.
// ---------------------------------------------------------------------
export async function continueAsDemoBroker(): Promise<void> {
  const email = process.env.DEMO_BROKER_EMAIL ?? "layla@alef-demo.com";
  const password = process.env.DEMO_BROKER_PASSWORD;
  if (!password) {
    throw new Error("DEMO_BROKER_PASSWORD is not set in the environment.");
  }

  const sb = await createSupabaseSessionClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error("Demo broker is not configured — see WORKLOG.");
  }

  redirect("/home");
}

// ---------------------------------------------------------------------
// Profile capture at /onboarding/name. By the time this fires the
// broker is already signed in (from /signup), so we just need to write
// the broker row linked to their auth user. Idempotent: if the broker
// re-submits, we upsert on user_id.
// ---------------------------------------------------------------------
export async function onboardBroker(formData: FormData): Promise<void> {
  const sb = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    redirect("/signup");
  }

  const name = ((formData.get("name") as string) || "").trim();
  const brokerage = ((formData.get("brokerage") as string) || "").trim();
  const role = ((formData.get("role") as string) || "").trim();
  if (!name || !brokerage || !role) {
    throw new Error("Name, brokerage and role are all required.");
  }

  const photoEntry = formData.get("photo");
  let photoUrl: string | null = null;
  if (photoEntry instanceof File && photoEntry.size > 0) {
    photoUrl = await uploadToStorage("broker-photos", photoEntry);
  }

  // Phase 1 broker IDs stay as text — preserves the `b{Date.now()}` shape
  // we used before so the admin roster + activity rows aren't disrupted
  // by a uuid rename. New brokers get a fresh id; existing brokers
  // (re-running onboarding) keep their id.
  const admin = createSupabaseServerClient();

  const { data: existing } = await admin
    .from("brokers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const id = existing?.id ?? `b${Date.now()}`;
  const payload = {
    id,
    name,
    brokerage,
    role,
    user_id: user.id,
    tier: "Bronze",
    points: 0,
    engagement_score: 0,
    photo_url: photoUrl,
  };

  const { error } = await admin
    .from("brokers")
    .upsert(payload)
    .select()
    .single<Broker>();
  if (error) throw error;

  revalidatePath("/home");
  revalidatePath("/admin/brokers");
  redirect("/onboarding/done");
}
