// Public surface — client-safe. Server reads (getAiConfig,
// listEnabledAiSources, listAllAiSources) live in ./queries.
export { AlefAIAvatar } from "./components/AlefAIAvatar";
export { AskAlefChat } from "./components/AskAlefChat";
export { AskAlefFAB } from "./components/AskAlefFAB";
export type { AiConfig, AiSource, ChatMessage, ChatRole } from "./types";
