import Link from "next/link";
import { Icon, PhoneShell } from "@/components/shared";
import { NameForm } from "./_form";

// PRD §6.3 — Onboarding name capture. Header with back button + "1 of 2"
// step indicator, then the controlled form. Submit creates the broker.

export default function NameCapturePage() {
  return (
    <PhoneShell>
      <div className="flex h-full w-full flex-col">
        {/* Header — back arrow + step indicator */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-13">
          <Link
            href="/welcome"
            aria-label="Back"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
          >
            <Icon name="chevron-left" size={20} />
          </Link>
          <div className="text-[13px] font-semibold text-ink-3">1 of 2</div>
        </div>
        <NameForm />
      </div>
    </PhoneShell>
  );
}
