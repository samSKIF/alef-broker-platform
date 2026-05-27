import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Button,
  Card,
  Icon,
  type IconName,
} from "@/components/shared";
import { ProjectDetailTabs } from "@/features/projects";
import {
  getProjectById,
} from "@/features/projects/queries";
import { listModulesForProject } from "@/features/training/queries";
import type { ProjectFact } from "@/features/projects/types";

// PRD §6.9 — Project detail. Hero image with overlay back/share, title /
// location / status, facts strip, Overview/Units/Gallery/Training tabs,
// and a "Share project brochure" CTA at the bottom.

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, relatedModules] = await Promise.all([
    getProjectById(id),
    listModulesForProject(id),
  ]);
  if (!project) notFound();

  const facts = (project.facts as ProjectFact[] | null) ?? [];

  return (
    <>
      {/* Hero with overlay nav */}
      <div className="relative h-[280px] w-full overflow-hidden">
        {project.cover_image && (
          <Image
            src={project.cover_image}
            alt=""
            fill
            priority
            sizes="(min-width: 640px) 390px, 100vw"
            className="object-cover"
            style={{ objectPosition: "55% 55%" }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(20,28,34,0.45)] to-transparent"
        />
        <div className="absolute inset-x-0 top-13 flex items-center justify-between px-5">
          <Link
            href="/projects"
            aria-label="Back"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-white/90 text-ink shadow-soft-sm"
          >
            <Icon name="chevron-left" size={20} />
          </Link>
          <Link
            href={`/projects/${project.id}/brochure`}
            aria-label="Share brochure"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-white/90 text-ink shadow-soft-sm"
          >
            <Icon name="share" size={18} />
          </Link>
        </div>
        {project.status && (
          <div className="absolute bottom-3.5 left-5 rounded-pill bg-accent px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-white">
            {project.status}
          </div>
        )}
      </div>

      {/* Title + location + price */}
      <div className="px-5 pb-4 pt-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-h1 font-bold leading-[1.1] tracking-[-0.02em] text-ink">
              {project.name}
            </h1>
            {project.location && (
              <div className="mt-1 text-[13px] text-ink-3">
                {project.location}
              </div>
            )}
          </div>
          {project.price_from && (
            <div className="shrink-0 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink-3">
                From
              </div>
              <div className="text-h3 font-bold text-ink">
                {project.price_from}
              </div>
            </div>
          )}
        </div>

        {facts.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
            {facts.map(([icon, label]) => (
              <div key={label}>
                <Icon
                  name={icon as IconName}
                  size={16}
                  className="mb-1.5 text-accent"
                />
                <div className="text-[11px] font-semibold leading-[1.3] text-ink">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5">
        <ProjectDetailTabs
          overview={
            <div className="pb-4">
              {project.tagline && (
                <p className="mb-4 text-body leading-[1.55] text-ink-2">
                  {project.tagline}
                </p>
              )}
              <Card>
                <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-3">
                  Status
                </div>
                <div className="mt-0.5 text-[14px] font-semibold text-ink">
                  {project.status ?? "Available"}
                </div>
              </Card>
            </div>
          }
          units={
            <div className="pb-4">
              <Card>
                <div className="flex items-center gap-2.5">
                  <Icon name="bed" size={18} className="text-accent" />
                  <div className="text-[14px] font-semibold text-ink">
                    {project.units ?? "Various unit types"}
                  </div>
                </div>
                {project.price_from && (
                  <div className="mt-2 text-[12px] text-ink-3">
                    Starting from{" "}
                    <span className="font-bold text-ink">
                      {project.price_from}
                    </span>
                  </div>
                )}
              </Card>
              <div className="mt-3 text-[12px] text-ink-3">
                Detailed floor plans arrive in Phase 2.
              </div>
            </div>
          }
          gallery={
            <div className="pb-4">
              {project.cover_image ? (
                <div className="relative h-[200px] overflow-hidden rounded-xl">
                  <Image
                    src={project.cover_image}
                    alt={project.name}
                    fill
                    sizes="(min-width: 640px) 360px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <Card>
                  <div className="text-[12px] text-ink-3">
                    No gallery imagery yet.
                  </div>
                </Card>
              )}
              <div className="mt-3 text-[12px] text-ink-3">
                Full project gallery arrives in Phase 2.
              </div>
            </div>
          }
          training={
            <div className="pb-4">
              {relatedModules.length === 0 ? (
                <Card>
                  <div className="text-[12px] text-ink-3">
                    No training modules linked to this project yet.
                  </div>
                </Card>
              ) : (
                <div>
                  {relatedModules.map((m) => (
                    <Link
                      key={m.id}
                      href={`/academy/${m.id}`}
                      className="mb-2 block"
                    >
                      <Card>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-tint text-accent">
                            <Icon
                              name={m.kind === "live" ? "calendar" : "play"}
                              size={16}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-bold text-ink">
                              {m.title}
                            </div>
                            <div className="text-[11px] text-ink-3">
                              {m.kind === "live"
                                ? `${m.when_at ?? ""}${
                                    m.location ? ` · ${m.location}` : ""
                                  }`
                                : m.duration ?? ""}
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[14px] font-bold text-accent">
                              +{m.points}
                            </div>
                            <div className="text-[9px] font-semibold uppercase tracking-[0.06em] text-ink-3">
                              pts
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          }
        />
      </div>

      <div className="px-5 pb-6 pt-2">
        <Button
          href={`/projects/${project.id}/brochure`}
          kind="primary"
          size="lg"
          full
          icon={<Icon name="share" size={18} />}
        >
          Share project brochure
        </Button>
      </div>
    </>
  );
}
