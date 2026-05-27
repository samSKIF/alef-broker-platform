import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared";
import { ProjectAdminForm } from "@/features/projects";
import { getProjectById } from "@/features/projects/queries";

// PRD §7.3 — Edit an existing project.
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        Projects
      </Link>
      <h1 className="mb-1 text-h2 font-bold tracking-[-0.01em] text-ink">
        {project.name}
      </h1>
      <div className="mb-5 text-caption text-ink-3">
        Edit project · id <span className="font-mono">{project.id}</span>
      </div>
      <ProjectAdminForm project={project} />
    </div>
  );
}
