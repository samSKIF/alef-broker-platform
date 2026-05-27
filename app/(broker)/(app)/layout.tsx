import { PhoneShell, TabBar } from "@/components/shared";
import { requireBroker } from "@/lib/auth";
import { countSentNotifications } from "@/features/notifications/queries";
import { listPublishedModules, listCompletedModuleIds } from "@/features/training/queries";

// Post-onboarding broker app shell — wraps every authenticated screen in
// PhoneShell + a floating TabBar. The bottom-tab badge counts (unfinished
// academy modules) are computed once per layout render and passed to TabBar.
// Each page renders its OWN AppHeader so it can swap in back-nav variants
// (project detail, brochure share) without fighting the layout.
export const dynamic = "force-dynamic";

export default async function BrokerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const broker = await requireBroker();

  const [modules, completed, notifCount] = await Promise.all([
    listPublishedModules(),
    listCompletedModuleIds(broker.id),
    countSentNotifications(),
  ]);
  // Academy pending = modules they haven't completed yet (cap at 9 for UI sanity).
  const pending = Math.min(
    9,
    modules.filter((m) => !completed.has(m.id)).length,
  );

  return (
    <PhoneShell>
      <main className="flex-1 overflow-y-auto pb-[120px]">{children}</main>
      <TabBar
        badges={{
          "/academy": pending,
          "/notifications": notifCount,
        }}
      />
    </PhoneShell>
  );
}
