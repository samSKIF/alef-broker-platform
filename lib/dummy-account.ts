import "server-only";
import { cookies } from "next/headers";

// Dummy-account cookie — sole persistence of "who's signed in" for the POC
// per PRD §6.3. Set during onboarding (features/brokers/actions.ts), read
// by every authenticated broker-app page. Phase 2 replaces this with real
// Supabase Auth (PROJECT_PLAN 2.1).

export const BROKER_COOKIE = "broker_id";

export async function getBrokerIdFromCookie(): Promise<string | null> {
  const c = await cookies();
  return c.get(BROKER_COOKIE)?.value ?? null;
}

export async function clearBrokerCookie(): Promise<void> {
  const c = await cookies();
  c.delete(BROKER_COOKIE);
}
