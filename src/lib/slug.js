/**
 * Converts a string (such as a job title) into a URL-friendly slug.
 *
 * @param {string} text - Raw string to slugify
 * @param {string} [idFallback] - Fallback identifier if text is empty
 * @returns {string} URL slug
 */
export function slugify(text, idFallback = "") {
  if (!text || typeof text !== "string") {
    return idFallback ? String(idFallback).toLowerCase() : "";
  }

  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

  return slug || (idFallback ? String(idFallback).toLowerCase() : "");
}

/**
 * Creates a unique slug combining job title with an optional short suffix if needed.
 */
export function generateJobSlug(title, id = "") {
  const base = slugify(title);
  if (!base) {
    return id ? `role-${id}` : `role-${Date.now()}`;
  }
  return base;
}

