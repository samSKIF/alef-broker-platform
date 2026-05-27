import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared";
import { AiSourceForm } from "@/features/ask-alef";
import { listAllAiSources } from "@/features/ask-alef/queries";
import { listAllProjects } from "@/features/projects/queries";

export const dynamic = "force-dynamic";

export default async function EditAiSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [sources, projects] = await Promise.all([
    listAllAiSources(),
    listAllProjects(),
  ]);
  const source = sources.find((s) => s.id === id);
  if (!source) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/ai-training"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        AI Training
      </Link>
      <h1 className="mb-1 text-h2 font-bold tracking-[-0.01em] text-ink">
        {source.title}
      </h1>
      <div className="mb-5 text-caption text-ink-3">
        Edit knowledge source
      </div>
      <AiSourceForm
        source={source}
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
