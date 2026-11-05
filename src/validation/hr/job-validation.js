import { z } from "zod";

export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Operations",
  "Marketing",
  "HR & Finance",
  "Customer Support",
];

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const WORKPLACE_TYPES = [
  "On-site",
  "Hybrid",
  "Remote",
];

export const EXPERIENCE_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior",
  "Lead",
  "Director",
];

export const SALARY_PERIODS = [
  "per year",
  "per month",
];

export const SALARY_CURRENCIES = [
  "₹ (INR)",
  "$ (USD)",
  "€ (EUR)",
  "£ (GBP)",
];

/**
 * Strips HTML tags and common non-breaking space entities to verify whether
 * a rich text editor has meaningful text content.
 *
 * @param {string} html
 * @returns {boolean} True if empty or whitespace only
 */
export function isRichTextEmpty(html) {
  if (!html || typeof html !== "string") return true;
  const stripped = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length === 0;
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 * Used for date picker min limits and validation.
 */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns default suggested deadline (30 days from today) formatted as YYYY-MM-DD.
 *
 * This reads the clock, so it must never be called during render. Next.js 16 Cache
 * Components treats `new Date()` inside a Client Component as an unstable value and
 * fails the static prerender. Consumers seed it from an effect instead, e.g. the
 * deadline default in `JobMultiStepForm`.
 */
export function getDefaultDeadlineDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Full validation schema for publishing an active job requisition.
 * All steps must pass validation before a job is published.
 */
export const jobPublishSchema = z
  .object({
    // Step 1: Basics
    title: z
      .string()
      .trim()
      .min(3, "Job title must be at least 3 characters.")
      .max(120, "Job title cannot exceed 120 characters."),
    department: z
      .string()
      .min(1, "Please select a department."),
    employmentType: z
      .string()
      .min(1, "Please select an employment type."),
    experienceLevel: z
      .string()
      .min(1, "Please select an experience level."),

    // Step 2: Location and Pay
    workplaceType: z
      .string()
      .min(1, "Please select a workplace type."),
    location: z
      .string()
      .trim(),
    salaryMin: z
      .union([z.number(), z.string(), z.null(), z.undefined()])
      .transform((val) => (val === "" || val === null || val === undefined ? null : Number(val))),
    salaryMax: z
      .union([z.number(), z.string(), z.null(), z.undefined()])
      .transform((val) => (val === "" || val === null || val === undefined ? null : Number(val))),
    salaryCurrency: z
      .string()
      .default("₹ (INR)"),
    salaryPeriod: z
      .string()
      .default("per year"),
    deadline: z
      .string()
      .min(1, "Application deadline is required."),
    openings: z
      .union([z.number(), z.string(), z.null(), z.undefined()])
      .transform((val) => (val === "" || val === null || val === undefined ? 1 : Number(val)))
      .pipe(z.number().int().min(1, "Openings must be at least 1.")),

    // Step 3: Details
    description: z
      .string()
      .refine((val) => !isRichTextEmpty(val), {
        message: "Job overview is required.",
      }),
    responsibilities: z
      .string()
      .refine((val) => !isRichTextEmpty(val), {
        message: "Key responsibilities are required.",
      }),
    requirements: z
      .string()
      .refine((val) => !isRichTextEmpty(val), {
        message: "Requirements & qualifications are required.",
      }),
    skills: z
      .array(z.string())
      .default([]),
  })
  .superRefine((data, ctx) => {
    // Location is required for On-site and Hybrid; optional for Remote
    if (data.workplaceType !== "Remote") {
      if (!data.location || data.location.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Location is required for On-site and Hybrid roles.",
          path: ["location"],
        });
      }
    }

    // Salary min cannot be greater than salary max if both are provided
    if (
      typeof data.salaryMin === "number" &&
      !isNaN(data.salaryMin) &&
      typeof data.salaryMax === "number" &&
      !isNaN(data.salaryMax)
    ) {
      if (data.salaryMin > data.salaryMax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum salary cannot be greater than maximum salary.",
          path: ["salaryMin"],
        });
      }
    }

    // Deadline cannot be in the past
    if (data.deadline) {
      const today = getTodayDateString();
      if (data.deadline < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deadline cannot be in the past.",
          path: ["deadline"],
        });
      }
    }
  });

/**
 * Draft validation schema: only requires a Job Title.
 * All other fields are optional.
 */
export const jobDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Job title is required to save a draft.")
    .max(120, "Job title cannot exceed 120 characters."),
  department: z.string().optional(),
  employmentType: z.string().optional(),
  experienceLevel: z.string().optional(),
  workplaceType: z.string().optional(),
  location: z.string().optional(),
  salaryMin: z.any().optional(),
  salaryMax: z.any().optional(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.string().optional(),
  deadline: z.string().optional(),
  openings: z.any().optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

/**
 * Field mappings for each step, used by react-hook-form trigger() to validate
 * only the active step before allowing forward progression.
 */
export const STEP_FIELDS = {
  1: ["title", "department", "employmentType", "experienceLevel"],
  2: ["workplaceType", "location", "salaryMin", "salaryMax", "salaryCurrency", "salaryPeriod", "deadline", "openings"],
  3: ["description", "responsibilities", "requirements", "skills"],
  4: [], // Review step has no unique inputs
};

/**
 * Initial empty values for a new job form.
 *
 * Deliberately clock-free: `deadline` starts empty and is seeded from an effect after
 * mount (`JobMultiStepForm`), so this stays a pure function safe to call during the
 * prerender of `/hr/jobs/new` and `/hr/jobs/[id]/edit`.
 */
export function getInitialJobFormValues(existingJob = null) {
  if (existingJob) {
    // Extract salary parts if existing job has string like "₹10,00,000 - ₹16,00,000 / yr"
    return {
      title: existingJob.title || "",
      department: existingJob.department || "Engineering",
      employmentType: existingJob.employmentType || "Full-time",
      experienceLevel: existingJob.experienceLevel || "Mid-level",
      workplaceType: existingJob.workplaceType || "Hybrid",
      location: existingJob.location || "",
      salaryMin: existingJob.salaryMin ?? "",
      salaryMax: existingJob.salaryMax ?? "",
      salaryCurrency: existingJob.salaryCurrency || "₹ (INR)",
      salaryPeriod: existingJob.salaryPeriod || "per year",
      deadline: existingJob.deadline || "",
      openings: existingJob.openings ?? 1,
      description: existingJob.description || "",
      responsibilities: existingJob.responsibilities || "",
      requirements: existingJob.requirements || "",
      skills: existingJob.skills || [],
    };
  }

  return {
    title: "",
    department: "Engineering",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workplaceType: "Hybrid",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "₹ (INR)",
    salaryPeriod: "per year",
    deadline: "",
    openings: 1,
    description: "",
    responsibilities: "",
    requirements: "",
    skills: [],
  };
}
