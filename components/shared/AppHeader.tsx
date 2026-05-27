import { Avatar } from "./Avatar";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";

// Top bar shared by every post-onboarding broker screen (PRD §6.5).
// Logo · bell with unread badge · broker avatar. The bell is its own
// client component (NotificationBell) so it can subscribe to Supabase
// Realtime — see PRD §7.6 / plan item 1.6.4.

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
        <NotificationBell initialCount={notificationCount} />
        <Avatar
          name={brokerName}
          size={38}
          className="border-[1.5px] border-line shadow-soft-sm"
        />
      </div>
    </header>
  );
}
