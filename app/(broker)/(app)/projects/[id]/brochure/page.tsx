import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@/components/shared";
import { BrochureShareClient } from "@/features/brochures";
import { getBrokerById } from "@/features/brokers/queries";
import { getProjectById } from "@/features/projects/queries";
import { getBrokerIdFromCookie } from "@/lib/dummy-account";

// PRD §6.10 — Branded brochure share for a specific project. Header with
// back nav, then the client-side brochure preview / share UX.

export const dynamic = "force-dynamic";

export default async function BrochureSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brokerId = await getBrokerIdFromCookie();
  if (!brokerId) redirect("/welcome");
  const [broker, project] = await Promise.all([
    getBrokerById(brokerId),
    getProjectById(id),
  ]);
  if (!broker) redirect("/welcome");
  if (!project) notFound();

  return (
    <>
      <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-13">
        <Link
          href={`/projects/${project.id}`}
          aria-label="Back"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
        >
          <Icon name="chevron-left" size={20} />
        </Link>
        <div className="text-[16px] font-semibold tracking-[-0.005em]">
          Share {project.name}
        </div>
        <div className="h-[38px] w-[38px]" aria-hidden />
      </div>

      <BrochureShareClient broker={broker} project={project} />
    </>
  );
}
