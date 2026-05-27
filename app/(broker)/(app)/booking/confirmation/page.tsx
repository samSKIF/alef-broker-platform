import Link from "next/link";
import { Button, Card, Icon } from "@/components/shared";
import { getProjectById } from "@/features/projects/queries";

// PRD §6.12 — Booking confirmation, ticket-style. Reads ?project / ?date /
// ?time from the URL (set by submitBooking's redirect) and renders a
// celebratory confirmation.

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; date?: string; time?: string }>;
}) {
  const params = await searchParams;
  const projectId = params.project;
  const date = params.date;
  const time = params.time;

  const project = projectId ? await getProjectById(projectId) : null;
  const prettyDate = date
    ? DATE_FMT.format(new Date(date))
    : "Date to be confirmed";

  return (
    <div className="flex flex-col px-5 pt-13">
      {/* Big copper check */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-accent text-white shadow-accent">
          <Icon name="check" size={42} strokeWidth={2.4} />
        </div>
      </div>

      <div className="mb-1.5 text-center text-[12px] font-bold uppercase tracking-[0.25em] text-accent">
        You&apos;re on the list
      </div>
      <h1 className="m-0 mb-2.5 text-center text-[28px] font-bold leading-[1.15] tracking-[-0.02em]">
        Visit booked.
      </h1>
      <p className="mb-7 text-center text-body leading-[1.55] text-ink-2">
        Our team has noted your visit. Bring your client; we&apos;ll handle the
        rest.
      </p>

      <Card pad={18} className="mb-3 border-2 border-dashed !border-line">
        <Detail label="Project" value={project?.name ?? "—"} />
        <Detail
          label="Location"
          value={project?.location ?? "Alef sales suite"}
        />
        <Detail label="Date" value={prettyDate} />
        <Detail label="Time" value={time ?? "—"} />
        <Detail
          label="With"
          value="Alef sales advisor on site"
          last
        />
      </Card>

      <Card pad={14}>
        <div className="flex items-start gap-2.5">
          <Icon
            name="sparkle"
            size={16}
            className="mt-0.5 shrink-0 text-accent"
          />
          <div className="text-[12px] leading-[1.45] text-accent-2">
            Visit booked is logged on your activity. Complete the tour to roll
            up to the next tier faster.
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-2">
        <Button href="/activity" kind="primary" size="lg" full>
          See my activity
        </Button>
        <Link
          href="/home"
          className="py-2 text-center text-[13px] font-semibold text-ink-3"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-baseline justify-between gap-3 py-2.5",
        last ? "" : "border-b border-dashed border-line",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-3">
        {label}
      </div>
      <div className="text-right text-[13px] font-semibold text-ink">
        {value}
      </div>
    </div>
  );
}
