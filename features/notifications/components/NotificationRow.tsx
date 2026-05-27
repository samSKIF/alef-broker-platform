import Link from "next/link";
import { Icon } from "@/components/shared";
import type { Notification } from "../types";

// In-app notification feed row (PRD §6.13 / §6.14). Each row mirrors a
// "push" notification — title, body, optional deep-link, sent time.

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});
const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function whenLabel(sentAt: string | null): string {
  if (!sentAt) return "—";
  const d = new Date(sentAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return TIME_FMT.format(d);
  return DATE_FMT.format(d);
}

function linkTargetToHref(target: string | null): string | null {
  if (!target) return null;
  if (target.startsWith("/")) return target;
  if (target.startsWith("project:")) return `/projects/${target.slice(8)}`;
  switch (target) {
    case "projects":
      return "/projects";
    case "academy":
      return "/academy";
    case "activity":
      return "/activity";
    default:
      return null;
  }
}

export function NotificationRow({ n }: { n: Notification }) {
  const href = linkTargetToHref(n.link_target);
  const body = (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-card p-3.5 shadow-soft-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
        <Icon name="bell" size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-[14px] font-bold leading-[1.25] text-ink">
            {n.title}
          </div>
          <div className="shrink-0 text-[10.5px] font-semibold text-ink-3">
            {whenLabel(n.sent_at)}
          </div>
        </div>
        {n.body && (
          <div className="mt-1 text-[12.5px] leading-[1.45] text-ink-2">
            {n.body}
          </div>
        )}
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="mb-2.5 block">
      {body}
    </Link>
  ) : (
    <div className="mb-2.5">{body}</div>
  );
}
