import { AppHeader, Chip } from "@/components/shared";
import { FeaturedProjectCard, ProjectRowCard } from "@/features/projects";
import { listPublishedProjects } from "@/features/projects/queries";
import { countSentNotifications } from "@/features/notifications/queries";
import { requireBroker } from "@/lib/auth";

// PRD §6.8 — Projects list. Header, filter chips (static for Phase 1),
// featured project card, then a list of the rest.

export const dynamic = "force-dynamic";

const FILTER_CHIPS = [
  "All",
  "Selling",
  "Handover",
  "New launch",
  "Villas",
  "Apartments",
];

export default async function ProjectsPage() {
  const broker = await requireBroker();
  const [projects, notifCount] = await Promise.all([
    listPublishedProjects(),
    countSentNotifications(),
  ]);

  // The query orders featured first, but be defensive.
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p.id !== featured?.id);

  return (
    <>
      <AppHeader
        brokerName={broker.name}
        brokerPhotoUrl={broker.photo_url}
        notificationCount={notifCount}
      />

      <div className="px-5 pb-4 pt-1">
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.13em] text-accent">
          Portfolio
        </div>
        <h1 className="text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
          Communities to sell.
        </h1>
        <div className="mt-1 text-[13px] leading-[1.4] text-ink-3">
          {projects.length} active Alef{" "}
          {projects.length === 1 ? "community" : "communities"} · all freehold
          for all nationalities.
        </div>
      </div>

      {/* Filter chips — static for Phase 1. Real filtering = future enhancement. */}
      <div className="mb-4.5 flex gap-2 overflow-x-auto px-5">
        {FILTER_CHIPS.map((label, i) => (
          <Chip key={label} active={i === 0}>
            {label}
          </Chip>
        ))}
      </div>

      {featured && (
        <div className="px-4 pb-3.5">
          <FeaturedProjectCard project={featured} />
        </div>
      )}

      <div className="px-4">
        {rest.map((p) => (
          <ProjectRowCard key={p.id} project={p} />
        ))}
      </div>
    </>
  );
}
