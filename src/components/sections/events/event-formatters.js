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

/**
 * A one-line schedule for a detail page.
 *
 * Most events start and finish on the same day, and printing the date twice
 * ("30 Nov 2026, 7:30 pm – 30 Nov 2026, 11:30 pm") buries the time the reader is
 * actually looking for. Same-day ranges collapse to one date; multi-day ranges
 * keep both.
 */
export function formatSchedule(startValue, endValue) {
  const start = formatDateTime(startValue);
  const end = formatDateTime(endValue);

  if (!start) return end;
  if (!end) return start;

  const startDate = formatDate(startValue);
  const endDate = formatDate(endValue);

  if (startDate && startDate === endDate) {
    const endTime = new Intl.DateTimeFormat("en-IN", {
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date(Date.parse(endValue)));

    return `${start} – ${endTime}`;
  }

  return `${start} – ${end}`;
}

export function formatCost(value) {
  if (value === 0) return "FREE";
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    // Matches offer pricing: "₹99", not "₹99.00", which reads like a price list.
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

/**
 * Venue text for an event detail page.
 *
 * Hosts often type the same place into both the venue name and the address, and
 * the two columns then print it twice. When the address already contains the
 * venue name, only the fuller value is kept.
 */
export function formatEventPlace(locationName, address) {
  const venue = typeof locationName === "string" ? locationName.replace(/\s+/g, " ").trim() : "";
  const full = typeof address === "string" ? address.replace(/\s+/g, " ").trim() : "";

  if (!full) return venue;
  if (!venue) return full;

  return full.toLowerCase().includes(venue.toLowerCase()) ? full : `${venue}\n${full}`;
}

/**
 * Google Maps deep link for a shared event, or null when the host never placed
 * it on the map. Coordinates arrive as numbers or null from the normalizer, so
 * anything that is not a real number is treated as "no location" rather than
 * formatted into a broken URL.
 */
export function getDirectionsHref(event) {
  if (typeof event.lat !== "number" || typeof event.lng !== "number") return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.lat},${event.lng}`)}`;
}

