import Link from "next/link";
import { Icon } from "@/components/shared";
import { requireBroker } from "@/lib/auth";
import { createSupabaseSessionClient } from "@/lib/supabase/ssr";
import { ProfileForm } from "./_form";

// PRD §6.5 (update 2026-05-28) — Broker profile editor, reached by
// tapping the avatar in AppHeader. Lives inside the (app) route group
// so it inherits the floating TabBar. Email is shown read-only; the
// rest (name / role / brokerage / photo) is editable.

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const broker = await requireBroker();
  const sb = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const email = user?.email ?? "";

  return (
    <>
      <header className="flex shrink-0 items-center justify-between px-5 pb-3 pt-13">
        <Link
          href="/home"
          aria-label="Back"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
        >
          <Icon name="chevron-left" size={20} />
        </Link>
        <div className="text-[16px] font-semibold tracking-[-0.005em]">
          Profile
        </div>
        <div className="h-[38px] w-[38px]" aria-hidden />
      </header>

      <ProfileForm
        email={email}
        initialName={broker.name}
        initialRole={broker.role ?? ""}
        initialBrokerage={broker.brokerage ?? ""}
        initialPhotoUrl={broker.photo_url}
      />
    </>
  );
}
