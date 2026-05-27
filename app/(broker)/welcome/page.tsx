import Image from "next/image";
import { Button, Icon, Logo, PhoneShell } from "@/components/shared";
import { continueAsDemoBroker } from "@/features/brokers";

// PRD §6.2 — Onboarding Welcome.
// Hero photo top, brand logo overlay, headline + sub, "Get started" CTA →
// /onboarding/name. Below: a tiny "demo as Layla Hassan" form button that
// skips onboarding and signs in as the pre-seeded broker b1 — useful for
// the CEO demo so the dashboard opens populated. Clearly labelled "Demo
// shortcut" so a real broker doesn't tap it by accident.

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
          href="/onboarding/name"
          kind="accent"
          size="lg"
          full
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          Get started
        </Button>

        {/* Demo shortcut — POC-only. Skips onboarding and signs in as the
            pre-seeded broker b1 (Layla Hassan) so the dashboard opens with
            real activity. Form submit calls the continueAsDemoBroker
            server action which sets the cookie + redirects. */}
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
