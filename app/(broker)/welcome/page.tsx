import Image from "next/image";
import Link from "next/link";
import { Button, Icon, Logo, PhoneShell } from "@/components/shared";
import { continueAsDemoBroker } from "@/features/brokers";

// PRD §6.2 — Onboarding Welcome.
// Hero photo top, brand logo overlay, headline + sub, "Get started" CTA →
// /signup (was /onboarding/name in the pre-2.1 dummy-cookie flow). Below:
// "Already enrolled? Log in" for returning brokers (PROJECT_PLAN 2.1),
// and a tiny "demo as Layla Hassan" form button that signs in as the
// pre-provisioned demo auth account so the CEO demo opens populated.

export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="relative flex h-[500px] shrink-0 overflow-hidden">
        <Image
          src="/assets/onboard-hero.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 390px, 100vw"
          className="object-cover"
          style={{ objectPosition: "62% center" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(20,28,34,0.45)] to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-transparent to-bg"
        />
        <div className="absolute inset-x-0 top-16 flex justify-center">
          <Logo height={36} dark />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end px-7 pb-[110px] pt-2">
        <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-accent">
          Broker · مرحبا
        </div>
        <h1 className="m-0 text-[34px] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
          Sell the
          <br />
          communities of
          <br />
          tomorrow.
        </h1>
        <p className="mb-7 mt-3.5 text-body leading-[1.55] text-ink-2">
          The home for Alef Group&apos;s broker network — learn, share, and
          book site visits, all from one app.
        </p>
        <Button
          href="/signup"
          kind="accent"
          size="lg"
          full
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          Get started
        </Button>

        <div className="mt-3 text-center text-[12.5px] text-ink-3">
          Already enrolled?{" "}
          <Link href="/login" className="font-semibold text-accent">
            Log in
          </Link>
        </div>

        {/* Demo shortcut — POC-only. Signs in as the pre-provisioned
            demo auth account (layla@alef-demo.com, broker b1) so the
            dashboard opens with real activity. The server action
            uses Supabase Auth signInWithPassword under the hood;
            credentials live in env (DEMO_BROKER_EMAIL/PASSWORD). */}
        <form
          action={continueAsDemoBroker}
          className="mt-3 flex justify-center"
        >
          <button
            type="submit"
            className="rounded-pill px-3 py-2 text-[12px] text-ink-3 underline decoration-ink-4 underline-offset-2 hover:text-ink"
          >
            <span className="font-bold uppercase tracking-[0.13em] text-accent">
              Demo
            </span>
            <span className="mx-1.5 text-ink-4">·</span>
            Continue as Layla Hassan
          </button>
        </form>
      </div>
    </PhoneShell>
  );
}
