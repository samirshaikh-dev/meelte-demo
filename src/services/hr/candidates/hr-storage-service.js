import { uploadFile, deleteStorageFile } from "@/services/firebase/storage";
import { validateResumeFile } from "@/validation/hr/candidate-validation";
import { HR_STORAGE_PATHS } from "@/constants/hr-constants";

/**
 * Uploads a candidate's resume or portfolio document to Firebase Storage.
 *
 * @param {string} candidateId - Target candidate identifier
 * @param {File} file - Browser File object
 * @returns {Promise<{ downloadUrl: string, storagePath: string, fileName: string }>}
 */
export async function uploadCandidateResume(candidateId, file) {
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Clean filename: strip non-alphanumeric characters except dots, hyphens, and underscores
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const folder = `${HR_STORAGE_PATHS.RESUMES}/${candidateId}`;

  const { downloadUrl, storagePath } = await uploadFile(file, folder, {
    customFileName: `${Date.now()}-${sanitizedName}`,
    contentType: file.type,
  });

  return {
    downloadUrl,
    storagePath,
    fileName: file.name,
  };
}

/**
 * Removes a candidate resume from Firebase Storage.
 *
 * @param {string} storagePath - Storage path (e.g., 'hr/resumes/cand-1/...')
 */
export async function removeCandidateResume(storagePath) {
  if (!storagePath) return;
  await deleteStorageFile(storagePath);
}

