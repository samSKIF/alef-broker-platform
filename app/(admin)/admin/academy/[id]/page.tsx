import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared";
import { ModuleAdminForm } from "@/features/training";
import { getModuleById } from "@/features/training/queries";
import { listAllProjects } from "@/features/projects/queries";

export const dynamic = "force-dynamic";

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [mod, projects] = await Promise.all([
    getModuleById(id),
    listAllProjects(),
  ]);
  if (!mod) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/academy"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        Academy
      </Link>
      <h1 className="mb-1 text-h2 font-bold tracking-[-0.01em] text-ink">
        {mod.title}
      </h1>
      <div className="mb-5 text-caption text-ink-3">
        Edit module · id <span className="font-mono">{mod.id}</span>
      </div>
      <ModuleAdminForm
        module={mod}
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
