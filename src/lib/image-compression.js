/**
 * Client-side image compression and WebP conversion utility.
 * Uses native HTML5 Canvas & ImageBitmap APIs (zero extra npm dependencies).
 */

const SKIP_COMPRESSION_TYPES = new Set([
  "image/gif",
  "image/svg+xml",
]);

/**
 * Replaces a filename's extension with the target format extension.
 */
function replaceExtension(filename, newExt) {
  if (!filename) return `image.${newExt}`;
  const lastDot = filename.lastIndexOf(".");
  const base = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  return `${base}.${newExt}`;
}

/**
 * Loads an image File into an HTMLImageElement as fallback when createImageBitmap is unavailable.
 */
function loadImageFallback(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

/**
 * Compresses and resizes an image File on the client before upload.
 *
 * @param {File} file - Original image file
 * @param {Object} [options]
 * @param {number} [options.maxWidthOrHeight=1600] - Max width or height in px
 * @param {number} [options.quality=0.82] - Output quality (0 to 1)
 * @param {string} [options.fileType="image/webp"] - Target MIME type
 * @returns {Promise<File>} Compressed File or original File if smaller/unsupported
 */
export async function compressImageFile(file, options = {}) {
  const {
    maxWidthOrHeight = 1600,
    quality = 0.82,
    fileType = "image/webp",
  } = options;

  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !file ||
    !(file instanceof Blob) ||
    SKIP_COMPRESSION_TYPES.has(file.type?.toLowerCase())
  ) {
    return file;
  }

  try {
    let source;
    let width;
    let height;

    if (typeof createImageBitmap === "function") {
      const bitmap = await createImageBitmap(file);
      source = bitmap;
      width = bitmap.width;
      height = bitmap.height;
    } else {
      const img = await loadImageFallback(file);
      source = img;
      width = img.naturalWidth || img.width;
      height = img.naturalHeight || img.height;
    }

    // Calculate proportional target dimensions
    let targetWidth = width;
    let targetHeight = height;

    if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
      if (width >= height) {
        targetWidth = maxWidthOrHeight;
        targetHeight = Math.round((height * maxWidthOrHeight) / width);
      } else {
        targetHeight = maxWidthOrHeight;
        targetWidth = Math.round((width * maxWidthOrHeight) / height);
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      if (source && typeof source.close === "function") source.close();
      return file;
    }

    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    if (source && typeof source.close === "function") {
      source.close();
    }

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, fileType, quality);
    });

    // Fall back to original if canvas encoding failed or didn't save space
    if (!blob || blob.size === 0 || (blob.size >= file.size && width === targetWidth)) {
      return file;
    }

    const ext = fileType === "image/webp" ? "webp" : fileType.split("/")[1] || "jpg";
    const newName = replaceExtension(file.name, ext);

    return new File([blob], newName, {
      type: fileType,
      lastModified: Date.now(),
    });
  } catch {
    // Non-fatal fallback: return the original file untouched
    return file;
  }
}

