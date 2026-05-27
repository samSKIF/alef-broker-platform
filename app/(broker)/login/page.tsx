import Link from "next/link";
import { Icon, PhoneShell } from "@/components/shared";
import { LoginForm } from "./_form";

// PROJECT_PLAN 2.1 — sign in with the email + password set at /signup.

export default function LoginPage() {
  return (
    <PhoneShell>
      <div className="flex h-full w-full flex-col">
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-13">
          <Link
            href="/welcome"
            aria-label="Back"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
          >
            <Icon name="chevron-left" size={20} />
          </Link>
          <div className="text-[13px] font-semibold text-ink-3">Log in</div>
        </div>
        <LoginForm />
      </div>
    </PhoneShell>
  );
}
