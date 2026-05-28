import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  Icon,
  PhoneShell,
} from "@/components/shared";
import { requireBroker } from "@/lib/auth";

// PRD §6.4 — Welcome message. "Ahlan, [name]" + Bronze enrollment confirmation
// + two starter-action cards (Start with Foundation, Explore Alef projects),
// then "Take me to the dashboard" CTA → /home.
export const dynamic = "force-dynamic";

export default async function OnboardingDonePage() {
  const broker = await requireBroker();

  const firstName = broker.name.split(/\s+/)[0] ?? broker.name;

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col px-7 pt-[90px]">
        {/* Avatar with copper check badge */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Avatar name={broker.name} src={broker.photo_url} size={108} />
            <div className="absolute -right-1 -bottom-1 flex h-[38px] w-[38px] items-center justify-center rounded-full border-[3px] border-bg bg-accent text-white shadow-accent">
              <Icon name="check" size={20} strokeWidth={2.6} />
            </div>
          </div>
        </div>

        <div className="mb-2 text-center text-[12px] font-semibold uppercase tracking-[0.25em] text-accent">
          Welcome to the network
        </div>
        <h1 className="m-0 mb-3.5 text-center text-[32px] font-bold leading-[1.1] tracking-[-0.02em]">
          Ahlan, {firstName}.
        </h1>
        <p className="mx-7 mb-8 text-center text-body leading-[1.55] text-ink-2">
          You&apos;ve been enrolled as a{" "}
          <strong className="text-ink">Bronze broker</strong>. Complete your
          first module to start earning toward Silver.
        </p>

        {/* Cards link into the rest of the app — /academy shows the
            "pending for you" first module; /projects is the catalogue.
            PRD §6.4 lists these as starter affordances; without an
            href they were dead clicks. */}
        <Link href="/academy" className="mb-3.5 block">
          <Card pad={18}>
            <StarterRow
              icon="academy"
              title="Start with Foundation"
              sub="10-min intro · 50 pts"
            />
          </Card>
        </Link>
        <Link href="/projects" className="block">
          <Card pad={18}>
            <StarterRow
              icon="project"
              title="Explore Alef projects"
              sub="4 active developments"
            />
          </Card>
        </Link>
      </div>

      <div className="px-5 pb-9 pt-5">
        <Button href="/home" kind="primary" size="lg" full>
          Take me to the dashboard
        </Button>
      </div>
    </PhoneShell>
  );
}

function StarterRow({
  icon,
  title,
  sub,
}: {
  icon: "academy" | "project";
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-tint text-accent">
        <Icon name={icon} size={22} />
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-bold text-ink">{title}</div>
        <div className="mt-0.5 text-[12px] text-ink-3">{sub}</div>
      </div>
      <Icon name="chevron-right" size={18} className="text-ink-3" />
    </div>
  );
}
