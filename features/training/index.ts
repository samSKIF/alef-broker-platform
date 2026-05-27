// Public surface — client-safe. Server reads (listPublishedModules,
// listModulesForProject, listCompletedModuleIds) live in ./queries.
export { AcademyTabs } from "./components/AcademyTabs";
export { LiveModuleCard } from "./components/LiveModuleCard";
export { MarkCompleteButton } from "./components/MarkCompleteButton";
export { ModuleAdminForm } from "./components/ModuleAdminForm";
export { ModuleAdminRow } from "./components/ModuleAdminRow";
export { ModuleCard } from "./components/ModuleCard";
export { QuizBuilder } from "./components/QuizBuilder";
export { deleteModule, upsertModule } from "./actions";
export type { Module, QuizQuestion } from "./types";
