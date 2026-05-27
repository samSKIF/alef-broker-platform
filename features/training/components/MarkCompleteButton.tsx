"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon } from "@/components/shared";
import { logActivity } from "@/features/engagement/actions";

// Client-side "Mark complete" button for module detail. Writes a
// module_completed activity row (PRD §8.6) then redirects back to /academy.
// Quiz-taking is Phase 2 — this is the simple-completion fallback per §6.7.

export function MarkCompleteButton({
  brokerId,
  moduleId,
  done,
}: {
  brokerId: string;
  moduleId: string;
  done: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-pill bg-success/10 px-4 py-3 text-[13px] font-bold text-success">
        <Icon name="check" size={16} strokeWidth={2.4} />
        Completed
      </div>
    );
  }
  return (
    <Button
      kind="primary"
      size="lg"
      full
      disabled={pending}
      onClick={() => {
        start(async () => {
          await logActivity({
            broker_id: brokerId,
            type: "module_completed",
            module_id: moduleId,
          });
          router.push("/academy");
          router.refresh();
        });
      }}
    >
      {pending ? "Saving…" : "Mark complete"}
    </Button>
  );
}
