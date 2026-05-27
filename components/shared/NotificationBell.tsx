"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Icon } from "./Icon";

// Live bell + badge for the broker AppHeader (PRD §6.5 + §7.6).
// The page renders the header server-side and passes the current unread
// count; this component subscribes to Postgres INSERTs on
// `public.notifications` via Supabase Realtime so a new admin push
// increments the badge AND triggers `router.refresh()` so /notifications
// + the tab badge stay in sync without a manual reload.
//
// We swallow non-`sent` rows defensively (the composer in 1.5.7 always
// writes `sent=true, sent_at=now()`, but future drafts shouldn't bump the
// badge).

type Props = {
  initialCount: number;
};

export function NotificationBell({ initialCount }: Props) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);

  // Keep local state honest if the server-rendered count changes between
  // navigations (e.g. user just opened /notifications which marks read).
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const sb = createSupabaseBrowserClient();
    const channel = sb
      .channel("notifications-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const row = payload.new as { sent?: boolean | null } | null;
          if (!row || row.sent === false) return;
          setCount((c) => c + 1);
          // Refresh server components so the /notifications feed + tab
          // badge pick up the new row on next paint.
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, [router]);

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
    >
      <Icon name="bell" size={20} />
      {count > 0 && (
        <span
          className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white"
          style={{ boxShadow: "0 0 0 2px var(--color-card)" }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
