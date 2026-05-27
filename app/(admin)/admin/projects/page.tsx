import Link from "next/link";
import { Button, Card, Icon } from "@/components/shared";
import { ProjectAdminRow } from "@/features/projects";
import { listAllProjects } from "@/features/projects/queries";

// PRD §7.3 — Projects authoring list. Includes drafts. New project +
// edit + delete from this page.
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listAllProjects();
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-[-0.01em] text-ink">
            Projects
          </h1>
          <div className="mt-0.5 text-caption text-ink-3">
            {projects.length} total · {projects.filter((p) => p.published).length}{" "}
            published · {projects.filter((p) => p.ai_indexed).length} indexed
            for Ask Alef
          </div>
        </div>
        <Button
          href="/admin/projects/new"
          kind="accent"
          icon={<Icon name="plus" size={16} />}
        >
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <div className="py-6 text-center text-[13px] text-ink-3">
            No projects yet —{" "}
            <Link
              href="/admin/projects/new"
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
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Flags</th>
                <th className="px-5 py-3">Price from</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <ProjectAdminRow key={p.id} project={p} />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
