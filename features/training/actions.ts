"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import type { QuizQuestion } from "./types";

// Admin authoring actions for academy modules (PRD §7.4). Phase 1 note:
// PRD §7.4 lists "video upload" as an authoring field but PRD §8.3's
// schema has no video_url column on modules — video upload is therefore
// deferred to Phase 2 (PROJECT_PLAN follow-ups + schema migration).

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function parseQuiz(raw: string | null): QuizQuestion[] | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const cleaned = parsed
      .map((q): QuizQuestion | null => {
        if (typeof q !== "object" || q === null) return null;
        const r = q as Record<string, unknown>;
        const question = typeof r.q === "string" ? r.q.trim() : "";
        const options = Array.isArray(r.options)
          ? r.options
              .map((o) => (typeof o === "string" ? o.trim() : ""))
              .filter(Boolean)
          : [];
        const correct = typeof r.correct === "number" ? r.correct : 0;
        if (!question || options.length < 2) return null;
        return { q: question, options, correct };
      })
      .filter((q): q is QuizQuestion => q !== null);
    return cleaned.length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}

export async function upsertModule(formData: FormData): Promise<void> {
  const sb = createSupabaseServerClient();

  const existingId = (formData.get("id") as string | null)?.trim() || "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  if (!title) throw new Error("Module title is required.");
  const kind = (formData.get("kind") as string | null) ?? "online";
  if (kind !== "online" && kind !== "live") {
    throw new Error("Module kind must be 'online' or 'live'.");
  }

  const id = existingId || `m-${slugify(title) || Date.now()}`;

  const pointsRaw = formData.get("points") as string | null;
  const points = pointsRaw && pointsRaw.trim() ? Number(pointsRaw) : 0;

  const projectId =
    ((formData.get("project_id") as string) || "").trim() || null;
  const tierRequired =
    ((formData.get("tier_required") as string) || "").trim() || null;
  const duration =
    ((formData.get("duration") as string) || "").trim() || null;
  const whenAt = ((formData.get("when_at") as string) || "").trim() || null;
  const location =
    ((formData.get("location") as string) || "").trim() || null;
  const seats = ((formData.get("seats") as string) || "").trim() || null;

  const quizParsed = parseQuiz(formData.get("quiz_json") as string | null);

  const payload = {
    id,
    title,
    kind,
    project_id: projectId,
    points: Number.isFinite(points) ? points : 0,
    duration: kind === "online" ? duration : null,
    tier_required: tierRequired,
    published: formData.get("published") === "on",
    quiz: (quizParsed as unknown as Json) ?? null,
    when_at: kind === "live" ? whenAt : null,
    location: kind === "live" ? location : null,
    seats: kind === "live" ? seats : null,
  };

  const { error } = await sb.from("modules").upsert(payload);
  if (error) throw error;

  revalidatePath("/admin/academy");
  revalidatePath("/academy");
  revalidatePath(`/academy/${id}`);
  redirect("/admin/academy");
}

export async function deleteModule(id: string): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb.from("modules").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/academy");
  revalidatePath("/academy");
  redirect("/admin/academy");
}
