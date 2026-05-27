import Link from "next/link";
import { Button, Card, Icon } from "@/components/shared";
import { ModuleAdminRow } from "@/features/training";
import { listAllModules } from "@/features/training/queries";
import { listAllProjects } from "@/features/projects/queries";

// PRD §7.4 — Academy authoring list (online videos + face-to-face workshops).
export const dynamic = "force-dynamic";

export default async function AdminAcademyPage() {
  const [modules, projects] = await Promise.all([
    listAllModules(),
    listAllProjects(),
  ]);
  const projectName = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-[-0.01em] text-ink">
            Academy
          </h1>
          <div className="mt-0.5 text-caption text-ink-3">
            {modules.length} modules ·{" "}
            {modules.filter((m) => m.published).length} published ·{" "}
            {modules.filter((m) => m.kind === "live").length} face-to-face
          </div>
        </div>
        <Button
          href="/admin/academy/new"
          kind="accent"
          icon={<Icon name="plus" size={16} />}
        >
          New module
        </Button>
      </div>

      {modules.length === 0 ? (
        <Card>
          <div className="py-6 text-center text-[13px] text-ink-3">
            No modules yet —{" "}
            <Link
              href="/admin/academy/new"
              className="font-semibold text-accent hover:underline"
            >
              create the first one
            </Link>
            .
          </div>
        </Card>
      ) : (
        <Card pad={0} className="overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-bg">
              <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-3">
                <th className="px-5 py-3">Module</th>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Points</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <ModuleAdminRow
                  key={m.id}
                  mod={m}
                  projectName={
                    m.project_id ? projectName.get(m.project_id) : undefined
                  }
                />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
