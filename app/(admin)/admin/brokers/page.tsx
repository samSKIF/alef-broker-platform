import { BrokerRosterTable } from "@/features/brokers";
import { listAllBrokers } from "@/features/brokers/queries";
import { listPublishedModules } from "@/features/training/queries";

// PRD §7.2 — Brokers roster. Table view with engagement / activity counts
// + last active. Click a row → /admin/brokers/[id] drill-down.
export const dynamic = "force-dynamic";

export default async function AdminBrokersPage() {
  const [brokers, modules] = await Promise.all([
    listAllBrokers(),
    listPublishedModules(),
  ]);

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-[-0.01em] text-ink">
            {brokers.length} brokers in the network
          </h1>
          <div className="mt-0.5 text-caption text-ink-3">
            Click a row to drill into a broker&apos;s engagement breakdown and
            activity timeline.
          </div>
        </div>
      </div>
      <BrokerRosterTable brokers={brokers} totalModules={modules.length} />
    </div>
  );
}
