import { AppHeader } from "@/components/shared";
import { BookingForm } from "@/features/booking";
import { listPublishedProjects } from "@/features/projects/queries";
import { countSentNotifications } from "@/features/notifications/queries";
import { requireBroker } from "@/lib/auth";

// PRD §6.11 — Book a visit. AppHeader + intro + the form.

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const broker = await requireBroker();
  const [projects, notifCount] = await Promise.all([
    listPublishedProjects(),
    countSentNotifications(),
  ]);

  return (
    <>
      <AppHeader
        brokerName={broker.name}
        brokerPhotoUrl={broker.photo_url}
        notificationCount={notifCount}
      />
      <div className="px-5 pb-3 pt-1">
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.13em] text-accent">
          Book a visit
        </div>
        <h1 className="text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
          Show Alef in person.
        </h1>
        <p className="mt-1.5 text-[13px] text-ink-3">
          Pick a project, date and time slot. We&apos;ll log it on your activity.
        </p>
      </div>
      <BookingForm brokerId={broker.id} projects={projects} />
    </>
  );
}
