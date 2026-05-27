// Public surface — client-safe. Server reads (listPublishedProjects,
// listAllProjects, getProjectById) live in ./queries and must be deep-imported.
export { FeaturedProjectCard } from "./components/FeaturedProjectCard";
export { ProjectAdminForm } from "./components/ProjectAdminForm";
export { ProjectAdminRow } from "./components/ProjectAdminRow";
export { ProjectDetailTabs } from "./components/ProjectDetailTabs";
export { ProjectRowCard } from "./components/ProjectRowCard";
export { deleteProject, upsertProject } from "./actions";
export type { Project, ProjectFact } from "./types";
