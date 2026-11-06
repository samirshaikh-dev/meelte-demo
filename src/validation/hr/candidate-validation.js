import { z } from "zod";
import {
  HR_CANDIDATE_STATUSES,
  HR_FILE_UPLOAD_CONSTRAINTS,
} from "@/constants/hr-constants";

export const candidateApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(120, "Email cannot exceed 120 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(25, "Phone number cannot exceed 25 characters"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  appliedJobId: z.string().min(1, "Applied job ID is required"),
  appliedJobTitle: z.string().min(1, "Applied job title is required"),
  experience: z.string().trim().max(50, "Experience cannot exceed 50 characters").optional().default(""),
  currentCompany: z.string().trim().max(100, "Company cannot exceed 100 characters").optional().default(""),
  status: z.enum(HR_CANDIDATE_STATUSES).default("Applied"),
});

/**
 * Validates an uploaded resume file before Firebase Storage upload.
 *
 * @param {File | Blob} file - Upload candidate file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateResumeFile(file) {
  if (!file) {
    return { valid: false, error: "Please select a file to upload." };
  }

  if (file.size > HR_FILE_UPLOAD_CONSTRAINTS.MAX_RESUME_SIZE_BYTES) {
    return {
      valid: false,
      error: "File size exceeds the 10MB limit. Please upload a smaller document.",
    };
  }

  const mime = file.type || "";
  const name = file.name || "";
  const hasValidMime = HR_FILE_UPLOAD_CONSTRAINTS.ALLOWED_RESUME_MIME_TYPES.includes(mime);
  const hasValidExtension = HR_FILE_UPLOAD_CONSTRAINTS.ALLOWED_RESUME_EXTENSIONS.some((ext) =>
    name.toLowerCase().endsWith(ext)
  );

  if (!hasValidMime && !hasValidExtension) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload a PDF, DOC, or DOCX document.",
    };
  }

  return { valid: true };
}

