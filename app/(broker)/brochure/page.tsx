import { redirect } from "next/navigation";
import { listPublishedProjects } from "@/features/projects/queries";

// "Share brochure" quick-action on Home links here. Auto-pick the featured
// project (falls back to the first published one) and forward to its
// branded-brochure page (PRD §6.10). Useful so the home quick action stays
// hardcoded but the destination follows whatever the data says is featured.
export const dynamic = "force-dynamic";

export default async function BrochureRedirect() {
  const projects = await listPublishedProjects();
  const target = projects.find((p) => p.featured) ?? projects[0];
  if (!target) redirect("/projects");
  redirect(`/projects/${target.id}/brochure`);
}
