import Link from "next/link";
import { Card, Icon } from "@/components/shared";
import { NotificationRow } from "@/features/notifications";
import { listSentNotifications } from "@/features/notifications/queries";
import { requireBroker } from "@/lib/auth";

// PRD §6.13 — In-app notification feed. Real device push is Phase 2; for
// Phase 1 we render the list from the notifications table.

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  await requireBroker();
  const notifications = await listSentNotifications();

  return (
    <>
      <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-13">
        <Link
          href="/home"
          aria-label="Back"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
        >
          <Icon name="chevron-left" size={20} />
        </Link>
        <div className="text-[16px] font-semibold tracking-[-0.005em]">
          Notifications
        </div>
        <div className="h-[38px] w-[38px]" aria-hidden />
      </div>

      <div className="px-4 pt-2">
        {notifications.length === 0 ? (
          <Card>
            <div className="py-4 text-center text-[13px] text-ink-3">
              You&apos;re all caught up.
            </div>
          </Card>
        ) : (
          notifications.map((n) => <NotificationRow key={n.id} n={n} />)
        )}
      </div>
    </>
  );
}
