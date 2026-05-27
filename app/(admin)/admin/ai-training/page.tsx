import { Button, Icon } from "@/components/shared";
import { AiInstructionsEditor, AiSourcesList } from "@/features/ask-alef";
import {
  getAiConfig,
  listAllAiSources,
} from "@/features/ask-alef/queries";
import { listAllProjects } from "@/features/projects/queries";

// PROJECT_PLAN 1.5.8 — AI Training. Edits the singleton ai_config row
// (instructions / model / temperature / max tokens) and manages the
// ai_sources knowledge library.
export const dynamic = "force-dynamic";

export default async function AdminAiTrainingPage() {
  const [config, sources, projects] = await Promise.all([
    getAiConfig(),
    listAllAiSources(),
    listAllProjects(),
  ]);
  const projectName = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <div className="mb-7">
        <h1 className="text-h2 font-bold tracking-[-0.01em] text-ink">
          AI Training
        </h1>
        <div className="mt-0.5 text-caption text-ink-3">
          Edit the assistant&apos;s system instructions and knowledge corpus.
          Saved changes apply to the next Ask Alef request — no redeploy.
        </div>
      </div>

      <AiInstructionsEditor config={config} />

      <div className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-h2 font-bold tracking-[-0.01em] text-ink">
              Knowledge sources
            </h2>
            <div className="mt-0.5 text-caption text-ink-3">
              {sources.length} sources ·{" "}
              {sources.filter((s) => s.enabled).length} enabled. The route
              handler concatenates enabled-source content into the system
              prompt at request time.
            </div>
          </div>
          <Button
            href="/admin/ai-training/source/new"
            kind="accent"
            icon={<Icon name="plus" size={16} />}
          >
            New source
          </Button>
        </div>
        <AiSourcesList sources={sources} projectName={projectName} />
      </div>
    </div>
  );
}
