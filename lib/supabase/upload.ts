import "server-only";
import { createSupabaseServerClient } from "./server";

// Upload a File to a public Supabase Storage bucket and return its
// publicly accessible URL. Service-role key bypasses any RLS on
// storage.objects (none yet — Phase 1 posture).
//
// Used by admin authoring forms (projects, modules, ai-sources).

export async function uploadToStorage(
  bucket: string,
  file: File,
): Promise<string> {
  const sb = createSupabaseServerClient();
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
    : "bin";
  // crypto.randomUUID is available in Node 19+/Edge. We're on Node 24.
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
