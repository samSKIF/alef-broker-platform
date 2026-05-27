"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/upload";

// Admin authoring actions for projects (PRD §7.3). Real DB writes; Storage
// uploads optional (the seed already populates 4 projects with cover images).
// FormData is the wire format so file inputs Just Work.

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

async function uploadIfPresent(
  bucket: string,
  field: FormDataEntryValue | null,
): Promise<string | null> {
  if (!(field instanceof File)) return null;
  if (field.size === 0) return null;
  return uploadToStorage(bucket, field);
}

export async function upsertProject(formData: FormData): Promise<void> {
  const sb = createSupabaseServerClient();

  const existingId = (formData.get("id") as string | null)?.trim() || "";
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  if (!name) {
    throw new Error("Project name is required.");
  }

  const id = existingId || slugify(name) || `p-${Date.now()}`;

  const coverExisting =
    (formData.get("cover_image_existing") as string | null)?.trim() || null;
  const videoExisting =
    (formData.get("video_url_existing") as string | null)?.trim() || null;
  const brochureExisting =
    (formData.get("brochure_url_existing") as string | null)?.trim() || null;

  const uploadedCover = await uploadIfPresent(
    "project-images",
    formData.get("cover_image_file"),
  );
  const uploadedVideo = await uploadIfPresent(
    "videos",
    formData.get("video_file"),
  );
  const uploadedBrochure = await uploadIfPresent(
    "brochures",
    formData.get("brochure_file"),
  );

  const payload = {
    id,
    name,
    location: ((formData.get("location") as string) || "").trim() || null,
    tagline: ((formData.get("tagline") as string) || "").trim() || null,
    units: ((formData.get("units") as string) || "").trim() || null,
    price_from:
      ((formData.get("price_from") as string) || "").trim() || null,
    status: ((formData.get("status") as string) || "").trim() || null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    ai_indexed: formData.get("ai_indexed") === "on",
    cover_image: uploadedCover ?? coverExisting,
    video_url: uploadedVideo ?? videoExisting,
    brochure_url: uploadedBrochure ?? brochureExisting,
  };

  const { error } = await sb.from("projects").upsert(payload);
  if (error) throw error;

  revalidatePath("/admin/projects");
  revalidatePath("/projects"); // broker app list
  revalidatePath(`/projects/${id}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}
