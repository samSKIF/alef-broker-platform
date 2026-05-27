import Link from "next/link";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

// Top bar shared by every post-onboarding broker screen (PRD §6.5).
// Logo · bell with unread badge · broker avatar.

type AppHeaderProps = {
  brokerName: string;
  notificationCount?: number;
};

export function AppHeader({
  brokerName,
  notificationCount = 0,
}: AppHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 px-5 pb-3 pt-13">
      <Logo height={26} />
      <div className="flex items-center gap-2">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
        >
          <Icon name="bell" size={20} />
          {notificationCount > 0 && (
            <span
              className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white"
              style={{ boxShadow: "0 0 0 2px var(--color-card)" }}
            >
              {notificationCount}
            </span>
          )}
        </Link>
        <Avatar
          name={brokerName}
          size={38}
          className="border-[1.5px] border-line shadow-soft-sm"
        />
      </div>
    </header>
  );
}
