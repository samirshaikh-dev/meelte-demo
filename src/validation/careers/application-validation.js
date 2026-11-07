import { z } from "zod";
import { HR_FILE_UPLOAD_CONSTRAINTS } from "@/constants/hr-constants";

export const MAX_RESUME_SIZE_BYTES = HR_FILE_UPLOAD_CONSTRAINTS.MAX_RESUME_SIZE_BYTES; // 5MB

/**
 * Validates HTTPS-only optional URLs (LinkedIn, Portfolio) without fetching.
 */
const httpsUrlSchema = z
  .string()
  .trim()
  .max(200, "URL cannot exceed 200 characters")
  .optional()
  .default("")
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid HTTPS URL (e.g. https://linkedin.com/in/...)" }
  );

/**
 * Zod schema for career job application form submission.
 */
export const publicApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(120, "Email cannot exceed 120 characters"),
  phone: z
    .string()
    .trim()
    .max(25, "Phone number cannot exceed 25 characters")
    .refine(
      (val) => {
        const digits = val.replace(/[\s+\-()]/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      { message: "Please provide a valid phone number (7-15 digits)" }
    ),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  linkedinUrl: httpsUrlSchema,
  portfolioUrl: httpsUrlSchema,
  experience: z.string().trim().max(50, "Experience cannot exceed 50 characters").optional().default(""),
  currentCompany: z.string().trim().max(100, "Company cannot exceed 100 characters").optional().default(""),
  noticePeriod: z.string().trim().max(50, "Notice period cannot exceed 50 characters").optional().default(""),
  expectedSalary: z.string().trim().max(50, "Expected salary cannot exceed 50 characters").optional().default(""),
  coverNote: z.string().trim().max(1000, "Cover note cannot exceed 1000 characters").optional().default(""),
  consent: z
    .union([z.boolean(), z.string()])
    .refine((val) => val === true || val === "true", {
      message: "You must consent to storing your application details.",
    }),
  website: z.string().optional().default(""), // Honeypot field - must remain empty
  uploadToken: z.string().optional(), // For Phase-A signed upload
});

/**
 * Validates resume file buffer magic bytes and size.
 *
 * @param {Buffer | Uint8Array} buffer
 * @param {string} fileName
 * @returns {{ valid: boolean, error?: string, mimeType?: string }}
 */
export function validateResumeBuffer(buffer, fileName = "") {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Please upload your resume document." };
  }

  if (buffer.length > MAX_RESUME_SIZE_BYTES) {
    return {
      valid: false,
      error: "Resume file size exceeds the 5MB limit. Please upload a smaller document.",
    };
  }

  const lowerName = fileName.toLowerCase();
  const isPdfExt = lowerName.endsWith(".pdf");
  const isDocExt = lowerName.endsWith(".doc");
  const isDocxExt = lowerName.endsWith(".docx");

  if (!isPdfExt && !isDocExt && !isDocxExt) {
    return {
      valid: false,
      error: "Unsupported file extension. Allowed formats: PDF (.pdf), Word (.doc, .docx).",
    };
  }

  // Check magic bytes
  // PDF: %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
  if (isPdfExt) {
    if (
      buffer.length >= 5 &&
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46 &&
      buffer[4] === 0x2d
    ) {
      return { valid: true, mimeType: "application/pdf" };
    }
    return { valid: false, error: "Invalid PDF document format." };
  }

  // DOC: OLE CFB (0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1)
  if (isDocExt) {
    if (
      buffer.length >= 8 &&
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0 &&
      buffer[4] === 0xa1 &&
      buffer[5] === 0xb1 &&
      buffer[6] === 0x1a &&
      buffer[7] === 0xe1
    ) {
      return { valid: true, mimeType: "application/msword" };
    }
    return { valid: false, error: "Invalid Word .doc document format." };
  }

  // DOCX: ZIP (0x50, 0x4B, 0x03, 0x04)
  if (isDocxExt) {
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    ) {
      return {
        valid: true,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }
    return { valid: false, error: "Invalid Word .docx document format." };
  }

  return { valid: false, error: "Unsupported document format." };
}

