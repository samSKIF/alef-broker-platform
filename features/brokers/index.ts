// Public surface — client-safe. Server-only reads live in ./queries and
// must be deep-imported by server consumers
// (see PRD §12 — "client-safe feature index" convention).

export { BrokerRosterTable } from "./components/BrokerRosterTable";
export { continueAsDemoBroker, onboardBroker } from "./actions";
export type { Broker, BrokerCreateInput, BrokerRosterRow } from "./types";
