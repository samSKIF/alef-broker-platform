// Public surface — client-safe. Server reads (listPublishedProjects,
// getProjectById) live in ./queries and must be deep-imported.
export { FeaturedProjectCard } from "./components/FeaturedProjectCard";
export { ProjectDetailTabs } from "./components/ProjectDetailTabs";
export { ProjectRowCard } from "./components/ProjectRowCard";
export type { Project, ProjectFact } from "./types";
