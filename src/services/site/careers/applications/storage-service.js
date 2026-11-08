import "server-only";
import crypto from "node:crypto";
import { getAdminBucket } from "@/services/firebase/admin";

/**
 * Generates a randomized private storage path for candidate resume.
 *
 * @param {string} candidateId
 * @param {string} originalFileName
 * @returns {string}
 */
export function generateResumeStoragePath(candidateId, originalFileName) {
  const ext = originalFileName.includes(".")
    ? originalFileName.slice(originalFileName.lastIndexOf(".")).toLowerCase()
    : ".pdf";
  const randomToken = crypto.randomBytes(16).toString("hex");
  return `hr/resumes/${candidateId}/${randomToken}${ext}`;
}

/**
 * Saves a validated resume buffer directly to Firebase Storage.
 *
 * @param {string} storagePath
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @returns {Promise<void>}
 */
export async function uploadResumeBuffer(storagePath, buffer, mimeType) {
  const bucket = getAdminBucket();
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    contentType: mimeType,
    resumable: false,
    metadata: {
      cacheControl: "private, max-age=0, no-transform",
    },
  });
}

/**
 * Deletes an uploaded resume file (for rollback / orphan cleanup).
 *
 * @param {string} storagePath
 * @returns {Promise<void>}
 */
export async function deleteStoredResume(storagePath) {
  if (!storagePath) return;
  try {
    const bucket = getAdminBucket();
    const file = bucket.file(storagePath);
    await file.delete({ ignoreNotFound: true });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Apply Storage] Failed to delete resume file:", storagePath, err.message);
    }
  }
}

