import Image from "next/image";
import { Button, Icon, type IconName } from "@/components/shared";
import type { Project, ProjectFact } from "../types";

// Large featured project card used at the top of the Projects list
// (PRD §6.8). Photo + Featured stamp + status pill + name/location +
// tagline + 3-up facts strip + units + Open / Share actions.

export function FeaturedProjectCard({ project }: { project: Project }) {
  const facts = (project.facts as ProjectFact[] | null) ?? [];
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft-md">
      <div className="relative h-[200px]">
        {project.cover_image && (
          <Image
            src={project.cover_image}
            alt=""
            fill
            sizes="(min-width: 640px) 360px, 100vw"
            className="object-cover"
            style={{ objectPosition: "55% 55%" }}
          />
        )}
        <div className="absolute left-3 top-3 rounded-pill bg-white/90 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink">
          ✦ Featured
        </div>
        {project.status && (
          <div className="absolute right-3 top-3 rounded-pill bg-accent px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-white">
            {project.status}
          </div>
        )}
      </div>
      <div className="px-[18px] pb-[18px] pt-4">
        <div className="mb-1 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[24px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
              {project.name}
            </div>
            {project.location && (
              <div className="mt-0.5 text-[12.5px] text-ink-3">
                {project.location}
              </div>
            )}
          </div>
          {project.price_from && (
            <div className="shrink-0 pl-3 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink-3">
                From
              </div>
              <div className="text-[16px] font-bold text-ink">
                {project.price_from}
              </div>
            </div>
          )}
        </div>

        {project.tagline && (
          <p className="mb-3.5 mt-3 text-[13px] leading-[1.5] text-ink-2">
            {project.tagline}
          </p>
        )}

        {facts.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
            {facts.map(([icon, label]) => (
              <div key={label}>
                <Icon
                  name={icon as IconName}
                  size={15}
                  className="mb-1.5 text-accent"
                />
                <div className="text-[11px] font-semibold leading-[1.3] text-ink">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {project.units && (
          <div className="mb-3.5 flex items-center gap-2 text-[12px] text-ink-2">
            <Icon name="bed" size={14} className="text-ink-3" />
            {project.units}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            href={`/projects/${project.id}`}
            kind="primary"
            size="sm"
            iconRight={<Icon name="chevron-right" size={14} />}
          >
            Open project
          </Button>
          <Button
            href={`/projects/${project.id}/brochure`}
            kind="ghost"
            size="sm"
            icon={<Icon name="share" size={14} />}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
