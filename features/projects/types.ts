import type { Database } from "@/types/database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];

// PRD §8.1: facts jsonb is "array of [icon, label]". Keep that shape with a
// narrow type so the broker app can render the fact strip without ceremony.
export type ProjectFact = [icon: string, label: string];
