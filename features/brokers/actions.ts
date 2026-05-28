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
//
// POC posture: we want a one-step signup with no email-verification
// round-trip. `supabase.auth.signUp` from the publishable-key client
// respects the project's "Confirm email" setting — if it's on (default
// in Supabase), signUp sends a confirmation email and returns no
// session, leaving the broker stranded at /onboarding/name with no
// auth user. To avoid being tied to that dashboard toggle, we use the
// service-role admin API to create the user with email already
// confirmed, then call signInWithPassword from the session client to
// establish the cookie. Phase 2 (real email-verification gating) can
// flip back to the standard signUp flow.
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

  // 1. Create the auth user with email already confirmed (service-role).
  const admin = createSupabaseServerClient();
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) {
    // Supabase returns a uniqueness violation when the email is
    // already registered. Map it to a UX-friendly message that hints
    // at the existing-account path.
    const msg = createError.message ?? "";
    if (/already (registered|exists)|duplicate|unique/i.test(msg)) {
      throw new Error("That email is already registered. Try signing in instead.");
    }
    throw new Error(msg || "Could not create your account.");
  }

  // 2. Sign them in via the session client so the JWT cookie is set
  //    for the redirected page. signInWithPassword writes the cookies
  //    through @supabase/ssr's cookie adapter.
  const sb = await createSupabaseSessionClient();
  const { error: signInError } = await sb.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    throw new Error(signInError.message || "Account created but sign-in failed.");
  }

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

// ---------------------------------------------------------------------
// Profile edit — same fields as onboarding (name / role / brokerage /
// photo) but for a broker who already has a row. Tapped from the
// avatar in AppHeader; lives at /profile. Revalidates every path
// where the avatar / name appear so the new photo shows up
// everywhere on the next paint.
// ---------------------------------------------------------------------
export async function updateBrokerProfile(formData: FormData): Promise<void> {
  const sb = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const name = ((formData.get("name") as string) || "").trim();
  const brokerage = ((formData.get("brokerage") as string) || "").trim();
  const role = ((formData.get("role") as string) || "").trim();
  if (!name || !brokerage || !role) {
    throw new Error("Name, brokerage and role are all required.");
  }

  const admin = createSupabaseServerClient();

  // Look up the existing broker so we know whether to keep or replace
  // the photo. Empty file inputs come through as a 0-byte File.
  const { data: existing } = await admin
    .from("brokers")
    .select("id, photo_url")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!existing) {
    // No profile yet → bounce to onboarding instead of silently creating
    // (this keeps /profile a strict UPDATE endpoint).
    redirect("/onboarding/name");
  }

  let photoUrl: string | null = existing.photo_url;
  const photoEntry = formData.get("photo");
  if (photoEntry instanceof File && photoEntry.size > 0) {
    photoUrl = await uploadToStorage("broker-photos", photoEntry);
  }
  // "Remove photo" affordance: a hidden input named "clear_photo" with
  // value "1" tells us to drop the current photo without uploading
  // a new one.
  if ((formData.get("clear_photo") as string | null) === "1") {
    photoUrl = null;
  }

  const { error } = await admin
    .from("brokers")
    .update({
      name,
      brokerage,
      role,
      photo_url: photoUrl,
    })
    .eq("id", existing.id);
  if (error) throw error;

  // Avatar appears on every broker-app screen via AppHeader, plus the
  // admin roster + drill-down + leaderboard. Force-dynamic pages
  // re-fetch on nav, but explicit revalidate makes the change visible
  // on /home immediately when the user hits "Save" + we redirect there.
  revalidatePath("/home");
  revalidatePath("/projects");
  revalidatePath("/academy");
  revalidatePath("/activity");
  revalidatePath("/booking");
  revalidatePath("/notifications");
  revalidatePath("/profile");
  revalidatePath("/admin");
  revalidatePath("/admin/brokers");
  revalidatePath(`/admin/brokers/${existing.id}`);

  redirect("/home");
}
