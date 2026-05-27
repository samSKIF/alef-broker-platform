import Image from "next/image";
import Link from "next/link";
import { Button, Icon, Logo, PhoneShell } from "@/components/shared";

// PRD §6.2 — Onboarding Welcome.
// Hero photo top, brand logo overlay + subtle "Sign in" affordance,
// headline + sub, "Get started" CTA → /onboarding/name.

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
        {/* Top scrim — keeps status-bar / logo legible against the photo. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(20,28,34,0.45)] to-transparent"
        />
        {/* Bottom fade into the page bg. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-transparent to-bg"
        />
        <div className="absolute inset-x-0 top-16 flex justify-center">
          <Logo height={36} dark />
        </div>
        <div className="absolute right-[22px] top-[70px] text-[12.5px] font-semibold tracking-[0.02em] text-white/85">
          Sign in
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
        <div className="mt-3.5 text-center text-[13px] text-ink-3">
          Already enrolled?{" "}
          <Link
            href="/home"
            className="font-semibold text-ink"
          >
            Sign in
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
