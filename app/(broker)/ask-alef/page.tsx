import { PhoneShell } from "@/components/shared";
import { AskAlefChat } from "@/features/ask-alef";
import { requireBroker } from "@/lib/auth";

// PRD §6.6 — Ask Alef chat surface. Lives OUTSIDE the (app) layout so the
// chat's own bottom input bar doesn't fight the floating tab bar; the
// chat is a full-screen modal-ish surface. Header inside the chat has a
// back link to /home.

export const dynamic = "force-dynamic";

export default async function AskAlefPage() {
  await requireBroker();
  return (
    <PhoneShell>
      <AskAlefChat />
    </PhoneShell>
  );
}
