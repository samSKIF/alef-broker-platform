import type { Database } from "@/types/database";

export type Broker = Database["public"]["Tables"]["brokers"]["Row"];

// Admin roster row — broker + their activity rollup. Modules total reads
// from the modules table at the call site for the X/Y display.
export type BrokerRosterRow = Broker & {
  visits: number;
  shares: number;
  modulesCompleted: number;
  lastActiveIso: string | null;
};
