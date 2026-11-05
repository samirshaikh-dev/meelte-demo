/**
 * Centralized Barrel Export for Meelte HR Dashboard Components
 */

// Shared UI & Context
export * from "./shared/hr-context";
export * from "./shared/hr-badge";
export * from "./shared/hr-sidebar";
export * from "./shared/hr-header";

// Dashboard Modules
export * from "./dashboard/dashboard-stats";
export * from "./dashboard/recent-candidates-card";
export * from "./dashboard/recent-jobs-card";

// Job Management Modules
export * from "./jobs/jobs-filter-bar";
export * from "./jobs/jobs-table";
export * from "./jobs/job-modal";
export * from "./jobs/delete-job-dialog";

// Candidate Modules
export * from "./candidates/candidates-filter-bar";
export * from "./candidates/candidates-table";
export * from "./candidates/candidate-detail-modal";

// Login Modules
export * from "./login";

