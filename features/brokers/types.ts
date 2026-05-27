import type { Database } from "@/types/database";

export type Broker = Database["public"]["Tables"]["brokers"]["Row"];

export type BrokerCreateInput = {
  name: string;
  brokerage: string;
  role: string;
};
