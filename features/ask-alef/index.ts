// Public surface — client-safe. Server reads (getAiConfig,
// listEnabledAiSources, listAllAiSources) live in ./queries.
export { AiInstructionsEditor } from "./components/AiInstructionsEditor";
export { AiSourceForm } from "./components/AiSourceForm";
export { AiSourcesList } from "./components/AiSourcesList";
export { AlefAIAvatar } from "./components/AlefAIAvatar";
export { AskAlefChat } from "./components/AskAlefChat";
export { AskAlefFAB } from "./components/AskAlefFAB";
export {
  deleteAiSource,
  toggleAiSource,
  updateAiConfig,
  upsertAiSource,
} from "./actions";
export type { AiConfig, AiSource, ChatMessage, ChatRole } from "./types";
