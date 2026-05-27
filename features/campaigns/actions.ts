"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/upload";

// Admin authoring for campaigns (PRD §7.5). Same pattern as projects.

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function upsertCampaign(formData: FormData): Promise<void> {
  const sb = createSupabaseServerClient();

  const existingId = (formData.get("id") as string | null)?.trim() || "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  if (!title) throw new Error("Campaign title is required.");

  const id = existingId || `c-${slugify(title) || Date.now()}`;

  const imageExisting =
    (formData.get("image_existing") as string | null)?.trim() || null;
  const imageFile = formData.get("image_file");
  let image = imageExisting;
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await uploadToStorage("project-images", imageFile);
  }

  const kind = ((formData.get("kind") as string) || "").trim() || null;
  // PRD §8.2 link_target: 'detail' | 'projects' | 'academy' | 'activity'.
  const linkTarget =
    ((formData.get("link_target") as string) || "").trim() || null;

  const payload = {
    id,
    tag: ((formData.get("tag") as string) || "").trim() || null,
    title,
    subtitle: ((formData.get("subtitle") as string) || "").trim() || null,
    image,
    kind,
    link_target: linkTarget,
    schedule: ((formData.get("schedule") as string) || "").trim() || null,
    published: formData.get("published") === "on",
  };

  const { error } = await sb.from("campaigns").upsert(payload);
  if (error) throw error;

  revalidatePath("/admin/campaigns");
  revalidatePath("/home"); // broker carousel
  redirect("/admin/campaigns");
}

export async function deleteCampaign(id: string): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb.from("campaigns").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/campaigns");
  revalidatePath("/home");
  redirect("/admin/campaigns");
}
