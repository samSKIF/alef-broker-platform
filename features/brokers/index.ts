// Public surface — client-safe. Server-only reads live in ./queries and
// must be deep-imported by server consumers
// (see PRD §12 — "client-safe feature index" convention).

export { BrokerRosterTable } from "./components/BrokerRosterTable";
export {
  continueAsDemoBroker,
  onboardBroker,
  signInBroker,
  signOutBroker,
  signUpBroker,
  updateBrokerProfile,
} from "./actions";
export {
  TIERS,
  TIER_BENEFITS,
  POINTS_RULES,
  getCurrentTier,
  nextTier,
  progressTowardNext,
} from "./tiers";
export type { Tier } from "./tiers";
export type { Broker, BrokerRosterRow } from "./types";
