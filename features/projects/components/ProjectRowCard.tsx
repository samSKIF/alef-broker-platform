import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/shared";
import type { Project, ProjectFact } from "../types";

// Compact project row used below the Featured card on the Projects list
// (PRD §6.8). Thumb · name · location · units · "From" price, plus a
// 3-fact bottom strip.

export function ProjectRowCard({ project }: { project: Project }) {
  const facts = ((project.facts as ProjectFact[] | null) ?? []).slice(0, 3);
  return (
    <Link
      href={`/projects/${project.id}`}
      className="mb-3 block rounded-xl border border-line bg-card p-3 shadow-soft-sm"
    >
      <div className="flex items-center gap-3.5">
        <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[14px] bg-tint">
          {project.cover_image && (
            <Image
              src={project.cover_image}
              alt=""
              fill
              sizes="84px"
              className="object-cover"
              style={{ objectPosition: "55% 55%" }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {project.status && (
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-accent">
              {project.status}
            </div>
          )}
          <div className="text-[16px] font-bold leading-tight tracking-[-0.015em] text-ink">
            {project.name}
          </div>
          {project.location && (
            <div className="mb-1 text-[12px] text-ink-3">
              {project.location}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-ink-2">
            {project.units && <span>{project.units}</span>}
            {project.units && project.price_from && (
              <span className="text-ink-4">·</span>
            )}
            {project.price_from && (
              <span className="font-bold text-ink">
                From {project.price_from}
              </span>
            )}
          </div>
        </div>
        <Icon
          name="chevron-right"
          size={18}
          className="shrink-0 text-ink-3"
        />
      </div>
      {facts.length > 0 && (
        <div
          className="mt-3 flex gap-3 border-t border-dashed border-line pt-2.5"
        >
          {facts.map(([icon, label]) => (
            <div
              key={label}
              className="flex min-w-0 items-center gap-1.5"
            >
              <Icon
                name={icon as IconName}
                size={12}
                className="shrink-0 text-accent"
              />
              <span className="truncate text-[10.5px] font-medium text-ink-2">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
