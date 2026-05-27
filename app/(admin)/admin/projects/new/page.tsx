import Link from "next/link";
import { Icon } from "@/components/shared";
import { ProjectAdminForm } from "@/features/projects";

// PRD §7.3 — Create a new project.

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        Projects
      </Link>
      <h1 className="mb-5 text-h2 font-bold tracking-[-0.01em] text-ink">
        New project
      </h1>
      <ProjectAdminForm />
    </div>
  );
}
