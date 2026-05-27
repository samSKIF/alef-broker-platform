import Link from "next/link";
import {
  Button,
  Card,
  Chip,
  Icon,
  Logo,
  Progress,
  TierBadge,
} from "@/components/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Phase 1 · 1.1 + 1.2 verify page — design system check + DB sanity check.
// The DB section confirms the typed Supabase client (1.2.5) is wired against
// the seeded schema (1.2.2–1.2.4). Real broker / admin routes come in 1.3 / 1.5.
export const dynamic = "force-dynamic";

export default async function Home() {
  const sb = createSupabaseServerClient();
  const [{ count: brokerCount }, { data: projects }] = await Promise.all([
    sb.from("brokers").select("*", { count: "exact", head: true }),
    sb.from("projects").select("id, name, status").order("name"),
  ]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex items-center justify-between border-b border-line pb-6">
        <Logo height={28} />
        <span className="text-caption font-bold uppercase tracking-[0.14em] text-ink-3">
          Design system · Phase 1 · 1.1
        </span>
      </header>

      <section className="flex flex-col gap-2">
        <h1 className="text-display font-semibold tracking-[-0.02em]">
          Alef Broker Platform
        </h1>
        <p className="max-w-xl text-h3 text-ink-2">
          POC scaffold. The broker PWA lives at{" "}
          <Link className="text-accent underline" href="/broker">
            /broker
          </Link>{" "}
          and the admin console at{" "}
          <Link className="text-accent underline" href="/admin">
            /admin
          </Link>
          .
        </p>
      </section>

      <Section title="Palette">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          <Swatch name="ink" cssVar="--color-ink" textOn="white" />
          <Swatch name="accent" cssVar="--color-accent" textOn="white" />
          <Swatch name="accent-2" cssVar="--color-accent-2" textOn="white" />
          <Swatch name="tint" cssVar="--color-tint" textOn="ink" />
          <Swatch name="balance" cssVar="--color-balance" textOn="white" />
          <Swatch name="possibilities" cssVar="--color-possibilities" textOn="white" />
          <Swatch name="bronze" cssVar="--color-bronze" textOn="white" />
          <Swatch name="silver" cssVar="--color-silver" textOn="white" />
          <Swatch name="gold" cssVar="--color-gold" textOn="white" />
          <Swatch name="preferred" cssVar="--color-preferred" textOn="white" />
          <Swatch name="success" cssVar="--color-success" textOn="white" />
          <Swatch name="olive" cssVar="--color-olive" textOn="white" />
        </div>
      </Section>

      <Section title="Type scale (PRD §5.2)">
        <div className="flex flex-col gap-2">
          <div className="text-display">Display · 42</div>
          <div className="text-h1">H1 · 28</div>
          <div className="text-h2">H2 · 22</div>
          <div className="text-h3">H3 · 17</div>
          <div className="text-body">Body · 15 — the workhorse paragraph size.</div>
          <div className="text-caption text-ink-3">Caption · 12</div>
          <div className="text-label uppercase tracking-[0.14em] text-ink-3">
            Label · 11
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button kind="primary">Primary</Button>
          <Button kind="accent" icon={<Icon name="share" size={18} />}>
            Accent
          </Button>
          <Button kind="ghost">Ghost</Button>
          <Button kind="tint" iconRight={<Icon name="arrow-right" size={18} />}>
            Tint
          </Button>
          <Button kind="primary" size="sm">
            Small
          </Button>
          <Button kind="primary" size="lg">
            Large (56px CTA)
          </Button>
        </div>
      </Section>

      <Section title="Chips · Tier · Progress">
        <div className="flex flex-wrap items-center gap-3">
          <Chip active icon={<Icon name="home" size={14} />}>
            Home
          </Chip>
          <Chip icon={<Icon name="academy" size={14} />}>Academy</Chip>
          <Chip icon={<Icon name="project" size={14} />}>Projects</Chip>
          <TierBadge tier="Bronze" />
          <TierBadge tier="Silver" />
          <TierBadge tier="Gold" />
          <TierBadge tier="Preferred" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TierBadge tier="Silver" compact />
          <TierBadge tier="Gold" compact />
        </div>
        <Card>
          <div className="mb-2 text-h3 font-semibold">
            Progress to Gold
          </div>
          <Progress value={1840} total={2500} showCount />
        </Card>
      </Section>

      <Section title="Cards">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="text-h3 font-semibold">Default card</div>
            <p className="mt-1 text-caption text-ink-3">
              White surface, hairline border, soft-sm shadow.
            </p>
          </Card>
          <Card white={false}>
            <div className="text-h3 font-semibold">Tint card</div>
            <p className="mt-1 text-caption text-ink-3">
              Warm beige (Belonging), no border.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="DB sanity (Supabase wiring)">
        <Card>
          <div className="text-h3 font-semibold">
            {brokerCount} brokers seeded
          </div>
          <p className="mt-1 text-caption text-ink-3">
            Fetched via <code className="font-mono">createSupabaseServerClient()</code> at
            request time. Confirms 1.2.2–1.2.6 are end-to-end wired.
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-body">
            {projects?.map((p) => (
              <li
                key={p.id}
                className="flex items-baseline justify-between border-t border-line py-1.5 first:border-t-0"
              >
                <span className="font-semibold">{p.name}</span>
                <span className="text-caption text-ink-3">{p.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h2 font-semibold tracking-[-0.01em]">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({
  name,
  cssVar,
  textOn,
}: {
  name: string;
  cssVar: string;
  textOn: "white" | "ink";
}) {
  return (
    <div
      className="flex h-20 flex-col justify-between rounded-lg p-2.5 text-label font-bold uppercase tracking-wider shadow-soft-sm"
      style={{
        background: `var(${cssVar})`,
        color: textOn === "white" ? "#fff" : "var(--color-ink)",
      }}
    >
      <span>{name}</span>
      <span className="font-mono text-[10px] normal-case tracking-normal opacity-80">
        var({cssVar})
      </span>
    </div>
  );
}
