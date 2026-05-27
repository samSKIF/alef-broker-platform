import Link from "next/link";
import { Icon } from "@/components/shared";
import { AiSourceForm } from "@/features/ask-alef";
import { listAllProjects } from "@/features/projects/queries";

export const dynamic = "force-dynamic";

export default async function NewAiSourcePage() {
  const projects = await listAllProjects();
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/ai-training"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        AI Training
      </Link>
      <h1 className="mb-5 text-h2 font-bold tracking-[-0.01em] text-ink">
        New knowledge source
      </h1>
      <AiSourceForm
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
