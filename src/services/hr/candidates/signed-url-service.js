import "server-only";
import { getAdminBucket } from "@/services/firebase/admin";

/**
 * Generates a short-lived signed URL for an authenticated HR admin to view or
 * download a private candidate resume.
 *
 * This helper lives in its own module instead of `storage-service.js` on
 * purpose: `storage-service.js` is reachable from the `HrProvider` Client
 * Component, and it must stay free of `firebase-admin` so Turbopack never tries
 * to bundle Node-only modules (`fs`, `tls`, `net`, `child_process`) for the
 * browser. Only Route Handlers may import this file.
 *
 * @param {string} storagePath - Private storage path (e.g. 'hr/resumes/cand-1/...')
 * @returns {Promise<string>} Signed read URL valid for 60 seconds
 */
export async function getSignedResumeDownloadUrl(storagePath) {
  const bucket = getAdminBucket();
  const file = bucket.file(storagePath);

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 1000, // 60 seconds TTL
  });

  return signedUrl;
}
