"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Booking submit (PRD §6.11). POC booking is mocked: we just log the
// `visit_booked` activity row and redirect to the ticket-style confirmation
// screen. No real calendar / availability checks (those are Phase 2).
//
// Revalidation: the broker's own /activity dashboard and the admin's
// Overview + Brokers roster both summarise from `activity`, so both
// sides need a cache bust (PRD §4 round-trip + plan 1.6.5).
export async function submitBooking(input: {
  broker_id: string;
  project_id: string;
  date: string;
  time: string;
  reminder: boolean;
}): Promise<void> {
  const sb = createSupabaseServerClient();
  const { error } = await sb.from("activity").insert({
    broker_id: input.broker_id,
    type: "visit_booked",
    project_id: input.project_id,
    meta: {
      date: input.date,
      time: input.time,
      reminder: input.reminder,
    },
  });
  if (error) throw error;

  revalidatePath("/activity");
  revalidatePath("/admin");
  revalidatePath("/admin/brokers");
  revalidatePath(`/admin/brokers/${input.broker_id}`);

  const params = new URLSearchParams({
    project: input.project_id,
    date: input.date,
    time: input.time,
  });
  redirect(`/booking/confirmation?${params.toString()}`);
}
