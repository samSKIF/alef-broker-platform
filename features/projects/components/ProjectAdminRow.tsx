import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/shared";
import { deleteProject } from "../actions";
import type { Project } from "../types";

// One row in the admin Projects list. Shows thumb + identity + status
// pills, plus Edit / Delete actions.

export function ProjectAdminRow({ project }: { project: Project }) {
  return (
    <tr className="border-b border-line last:border-b-0 hover:bg-bg">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-tint">
            {project.cover_image && (
              <Image
                src={project.cover_image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/projects/${project.id}`}
              className="text-[13.5px] font-bold text-ink hover:underline"
            >
              {project.name}
            </Link>
            {project.location && (
              <div className="text-[11.5px] text-ink-3">
                {project.location}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-3 text-[12px] text-ink-2">
        {project.status ?? "—"}
      </td>
      <td className="px-5 py-3">
        <div className="flex flex-wrap gap-1.5">
          <Pill
            on={project.published}
            label={project.published ? "Published" : "Draft"}
            tone={project.published ? "success" : "ink"}
          />
          {project.featured && (
            <Pill on label="Featured" tone="accent" />
          )}
          {project.ai_indexed && (
            <Pill on label="AI" tone="possibilities" />
          )}
        </div>
      </td>
      <td className="px-5 py-3 text-[12px] font-semibold text-ink">
        {project.price_from ?? "—"}
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/projects/${project.id}`}
            className="rounded-pill border border-line bg-card px-2.5 py-1 text-[11.5px] font-semibold text-ink hover:bg-bg"
          >
            Edit
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteProject(project.id);
            }}
          >
            <button
              type="submit"
              aria-label={`Delete ${project.name}`}
              className="flex h-6 w-6 items-center justify-center rounded-pill text-ink-3 hover:bg-[#E53E3E]/10 hover:text-[#E53E3E]"
            >
              <Icon name="close" size={14} />
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function Pill({
  on,
  label,
  tone,
}: {
  on: boolean;
  label: string;
  tone: "success" | "ink" | "accent" | "possibilities";
}) {
  const classes = {
    success: "bg-success/15 text-success",
    ink: "bg-ink-4/30 text-ink-2",
    accent: "bg-accent/15 text-accent",
    possibilities: "bg-possibilities/20 text-[#6E62A8]",
  } as const;
  return (
    <span
      className={[
        "inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
        on ? classes[tone] : "bg-line text-ink-3",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
