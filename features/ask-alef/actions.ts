"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/upload";

// PRD §7 + 1.5.8 — AI Training admin actions. Edits the singleton
// ai_config row and the ai_sources knowledge library. Phase 1 keeps PDF
// text-extraction manual: we upload the file (file_url is stored) but
// the operator pastes the extracted text into `content`. Real
// PDF-to-text is Phase 2.

export async function updateAiConfig(formData: FormData): Promise<void> {
  const sb = createSupabaseServerClient();

  const instructions =
    (formData.get("instructions") as string | null)?.trim() ?? "";
  if (!instructions) throw new Error("Instructions cannot be empty.");

  const model =
    ((formData.get("model") as string) || "gpt-4o-mini").trim();

  const tempRaw = formData.get("temperature") as string | null;
  const temperature = tempRaw ? Math.max(0, Math.min(2, Number(tempRaw))) : 0.4;

  const maxRaw = formData.get("max_output_tokens") as string | null;
  const maxOutputTokens = maxRaw
    ? Math.max(64, Math.min(4000, Number(maxRaw)))
    : 600;

  const { error } = await sb
    .from("ai_config")
    .update({
      instructions,
      model,
      temperature: Number.isFinite(temperature) ? temperature : 0.4,
      max_output_tokens: Number.isFinite(maxOutputTokens) ? maxOutputTokens : 600,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");
  if (error) throw error;

  revalidatePath("/admin/ai-training");
}

export async function upsertAiSource(formData: FormData): Promise<void> {
  const sb = createSupabaseServerClient();

  const existingId = (formData.get("id") as string | null)?.trim() || null;
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  if (!title) throw new Error("Source title is required.");

  const kind = ((formData.get("kind") as string) || "brochure").trim();
  const projectId =
    ((formData.get("project_id") as string) || "").trim() || null;
  const content = ((formData.get("content") as string) || "").trim() || null;
  const sortOrderRaw = formData.get("sort_order") as string | null;
  const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 0;

  const fileExisting =
    (formData.get("file_url_existing") as string | null)?.trim() || null;
  let fileUrl: string | null = fileExisting;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    fileUrl = await uploadToStorage("brochures", file);
  }

  if (existingId) {
    const { error } = await sb
      .from("ai_sources")
      .update({
        title,
        kind,
        project_id: projectId,
        content,
        file_url: fileUrl,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingId);
    if (error) throw error;
  } else {
    const { error } = await sb.from("ai_sources").insert({
      title,
      kind,
      project_id: projectId,
      content,
      file_url: fileUrl,
      enabled: true,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    });
    if (error) throw error;
  }

  revalidatePath("/admin/ai-training");
  redirect("/admin/ai-training");
}

export async function toggleAiSource(
  id: string,
  enabled: boolean,
): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb
    .from("ai_sources")
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/ai-training");
}

export async function deleteAiSource(id: string): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb.from("ai_sources").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/ai-training");
}
