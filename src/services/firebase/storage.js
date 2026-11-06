import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/config";

/**
 * Uploads a file (File, Blob, or Uint8Array) to Firebase Storage and returns the download URL and full storage path.
 *
 * @param {File | Blob} file - The file or blob to upload
 * @param {string} [folder="uploads"] - Storage folder destination
 * @param {Object} [options] - Additional metadata options
 * @param {string} [options.customFileName] - Optional explicit file name
 * @param {string} [options.contentType] - Explicit MIME type override
 * @returns {Promise<{ downloadUrl: string, storagePath: string }>}
 */
export async function uploadFile(file, folder = "uploads", options = {}) {
  const storage = getFirebaseStorage();
  const fileName = options.customFileName || `${Date.now()}-${file.name || "upload"}`;
  const storagePath = `${folder}/${fileName}`;
  const fileRef = ref(storage, storagePath);

  const metadata = {
    contentType: options.contentType || file.type || "application/octet-stream",
  };

  await uploadBytes(fileRef, file, metadata);
  const downloadUrl = await getDownloadURL(fileRef);

  return {
    downloadUrl,
    storagePath,
  };
}

/**
 * Retrieves the public download URL for an existing file reference in Firebase Storage.
 *
 * @param {string} storagePath - Relative path inside storage (e.g., 'uploads/image.png')
 * @returns {Promise<string>} Download URL
 */
export async function getFileDownloadUrl(storagePath) {
  const storage = getFirebaseStorage();
  const fileRef = ref(storage, storagePath);
  return getDownloadURL(fileRef);
}

/**
 * Deletes a file from Firebase Storage given its storage path.
 *
 * @param {string} storagePath - Relative path inside storage
 */
export async function deleteStorageFile(storagePath) {
  const storage = getFirebaseStorage();
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}

