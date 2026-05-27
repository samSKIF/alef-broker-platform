// Public surface — client-safe. Server reads (listPublishedModules,
// listModulesForProject, listCompletedModuleIds) live in ./queries.
export { AcademyTabs } from "./components/AcademyTabs";
export { LiveModuleCard } from "./components/LiveModuleCard";
export { MarkCompleteButton } from "./components/MarkCompleteButton";
export { ModuleCard } from "./components/ModuleCard";
export type { Module, QuizQuestion } from "./types";
