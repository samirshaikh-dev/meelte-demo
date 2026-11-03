/**
 * Shared display formatters for event surfaces.
 *
 * Both the detail page and the listing grid render the same date, time, cost
 * and directions values, so the rules live here instead of being duplicated.
 */

export function formatDateTime(value) {
  const timestamp = Date.parse(value || "");
  if (Number.isNaN(timestamp)) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(timestamp));
}

export function formatDate(value) {
  const timestamp = Date.parse(value || "");
  if (Number.isNaN(timestamp)) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(timestamp));
}

export function formatCost(value) {
  if (value === 0) return "FREE";
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getDirectionsHref(event) {
  if (event.lat === null || event.lng === null || typeof event.lat === "undefined" || typeof event.lng === "undefined") {
    return null;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.lat},${event.lng}`)}`;
}

