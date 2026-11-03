import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../shared/constants";

// Upstream text is untrusted: every string is trimmed and length-capped before
// it can reach a page or a JSON-LD node.
export const MAX_TEXT_LENGTH = 12000;

export function normalizeLimit(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_PAGE_SIZE;
  return Math.max(1, Math.min(MAX_PAGE_SIZE, Math.floor(parsed)));
}

export function normalizeId(value) {
  if (typeof value !== "string") return null;
  const id = value.trim();
  if (!id || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id)) return null;
  return id;
}

export function text(value, maxLength = MAX_TEXT_LENGTH) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function number(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function coordinate(value, minimum, maximum) {
  const parsed = number(value);
  return parsed !== null && parsed >= minimum && parsed <= maximum ? parsed : null;
}

// Only https URLs survive, so a record can never inject a javascript: or http:
// target into an image or a map link.
export function publicUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

// "Others" rows carry the real label in `custom_category`.
export function category(categoryName, customCategory) {
  const normalized = text(categoryName, 120);
  if (/^others?$/i.test(normalized)) {
    return text(customCategory, 120) || normalized;
  }
  return normalized;
}
