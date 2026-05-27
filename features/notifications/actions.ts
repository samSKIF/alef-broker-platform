"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// PRD §7.6 — Push notifications composer (Phase 1 is in-app only; real
// device push is Phase 2 / PROJECT_PLAN 2.2). "Send" writes one row to
// notifications with sent = true / sent_at = now() so the broker app's
// bell badge + feed pick it up via the existing query.

export async function sendNotification(formData: FormData): Promise<void> {
  const sb = createSupabaseServerClient();

  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const body = ((formData.get("body") as string) || "").trim() || null;
  if (!title) throw new Error("Notification title is required.");

  // Audience targeting per PRD §8.5 — encoded as one of:
  //   'all' | 'tier:Gold' | 'engagement:at-risk' | 'project:hayyan'
  const mode = (formData.get("audience_mode") as string | null) ?? "all";
  let audience: string = "all";
  if (mode === "tier") {
    const t = (formData.get("audience_tier") as string | null)?.trim();
    if (t) audience = `tier:${t}`;
  } else if (mode === "engagement") {
    const b = (formData.get("audience_band") as string | null)?.trim();
    if (b) audience = `engagement:${b}`;
  } else if (mode === "project") {
    const p = (formData.get("audience_project") as string | null)?.trim();
    if (p) audience = `project:${p}`;
  }

  const linkTarget =
    ((formData.get("link_target") as string) || "").trim() || null;

  const { error } = await sb.from("notifications").insert({
    id: `n-${Date.now()}`,
    title,
    body,
    audience,
    link_target: linkTarget,
    sent: true,
    sent_at: new Date().toISOString(),
  });
  if (error) throw error;

  revalidatePath("/admin/push");
  revalidatePath("/notifications");
  revalidatePath("/home"); // bell badge
  redirect("/admin/push");
}
