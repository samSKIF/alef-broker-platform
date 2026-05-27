import { Card } from "@/components/shared";
import { NotificationComposer } from "@/features/notifications";
import { listAllNotifications } from "@/features/notifications/queries";
import { listAllProjects } from "@/features/projects/queries";

// PRD §7.6 — Push notifications. Phase 1 in-app only; "Send" writes a
// notifications row and the broker app picks it up via its existing query.
export const dynamic = "force-dynamic";

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminPushPage() {
  const [notifications, projects] = await Promise.all([
    listAllNotifications(),
    listAllProjects(),
  ]);

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <div className="mb-5">
        <h1 className="text-h2 font-bold tracking-[-0.01em] text-ink">
          Push notifications
        </h1>
        <div className="mt-0.5 text-caption text-ink-3">
          Compose · target · send. Sent notifications appear in the broker
          app&apos;s in-app feed and bump the bell badge in real time.
        </div>
      </div>

      <NotificationComposer
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />

      <div className="mt-8">
        <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-3">
          Recent · {notifications.length}
        </div>
        {notifications.length === 0 ? (
          <Card>
            <div className="py-6 text-center text-[13px] text-ink-3">
              You haven&apos;t sent any notifications yet.
            </div>
          </Card>
        ) : (
          <Card pad={0} className="overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-bg">
                <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-3">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Audience</th>
                  <th className="px-5 py-3">Sent</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n, i) => (
                  <tr
                    key={n.id}
                    className={
                      i < notifications.length - 1
                        ? "border-b border-line"
                        : ""
                    }
                  >
                    <td className="px-5 py-3">
                      <div className="font-bold text-ink">{n.title}</div>
                      {n.body && (
                        <div className="text-[11.5px] text-ink-3">
                          {n.body}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-pill bg-tint px-2 py-0.5 font-mono text-[11px] text-accent-2">
                        {n.audience ?? "all"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-ink-3">
                      {n.sent_at ? TIME_FMT.format(new Date(n.sent_at)) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
