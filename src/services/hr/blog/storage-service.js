import { compressImageFile } from "@/lib/image-compression";
import { fetchWithAuth } from "@/lib/hr-api-client";

const MAX_RAW_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB raw limit pre-compression
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB server upload limit

const ALLOWED_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * Validates an image file before client-side compression and upload.
 *
 * @param {File} file - Selected browser file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateCoverImageFile(file) {
  if (!file) {
    return { valid: false, error: "Please select an image file to upload." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type?.toLowerCase())) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload a JPG, PNG, WEBP, or GIF image.",
    };
  }

  if (file.size > MAX_RAW_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Original image file exceeds 15 MB. Please choose a smaller file.",
    };
  }

  return { valid: true };
}

/**
 * Compresses/converts a cover image to WebP (max 1600px) on the client,
 * then uploads via the session-guarded server API (`/api/hr/blog/upload`).
 *
 * @param {File} file - Browser File object
 * @returns {Promise<{ downloadUrl: string, storagePath: string }>}
 */
export async function uploadBlogCoverImage(file) {
  const validation = validateCoverImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Client-side resize + WebP compression before network upload
  const optimizedFile = await compressImageFile(file, {
    maxWidthOrHeight: 1600,
    quality: 0.82,
    fileType: "image/webp",
  });

  if (optimizedFile.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("Compressed image still exceeds 5 MB. Please select a smaller image.");
  }

  const formData = new FormData();
  formData.append("file", optimizedFile);

  const response = await fetchWithAuth("/api/hr/blog/upload", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || "Failed to upload cover image.");
  }

  return {
    downloadUrl: payload.data.downloadUrl,
    storagePath: payload.data.storagePath,
  };
}

/**
 * Removes a blog cover image from Firebase Storage via the server API.
 *
 * @param {string} storagePath - Storage path (e.g., 'blog/covers/...')
 */
export async function removeBlogCoverImage(storagePath) {
  if (!storagePath) return;
  try {
    await fetchWithAuth("/api/hr/blog/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storagePath }),
    });
  } catch {
    // Non-fatal cleanup
  }
}
