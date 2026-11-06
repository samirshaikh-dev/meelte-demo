/**
 * HR Module Constants & Domain Enums
 *
 * Single source of truth for Firestore collection names, Storage paths,
 * file upload limits, and status states across the HR portal.
 */

export const HR_COLLECTIONS = Object.freeze({
  JOBS: "hr_jobs",
  CANDIDATES: "hr_candidates",
});

export const HR_STORAGE_PATHS = Object.freeze({
  RESUMES: "hr/resumes",
});

export const DEPARTMENTS = Object.freeze([
  "All Departments",
  "Engineering",
  "Operations",
  "Marketing",
  "Product Design",
  "Support",
  "HR & Admin",
]);

export const HR_DEPARTMENTS = Object.freeze([
  "Engineering",
  "Operations",
  "Marketing",
  "Product Design",
  "Support",
  "HR & Admin",
]);

export const EMPLOYMENT_TYPES = Object.freeze([
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
]);

export const WORKPLACE_TYPES = Object.freeze([
  "On-site",
  "Hybrid",
  "Remote",
]);

export const JOB_STATUSES = Object.freeze([
  "Active",
  "Draft",
  "Expired",
  "Archived",
]);

export const HR_JOB_STATUSES = JOB_STATUSES;

export const CANDIDATE_STATUSES = Object.freeze([
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Offered",
  "Rejected",
]);

export const HR_CANDIDATE_STATUSES = CANDIDATE_STATUSES;

export const HR_FILE_UPLOAD_CONSTRAINTS = Object.freeze({
  MAX_RESUME_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_RESUME_MIME_TYPES: Object.freeze([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
  ALLOWED_RESUME_EXTENSIONS: Object.freeze([".pdf", ".doc", ".docx"]),
});
