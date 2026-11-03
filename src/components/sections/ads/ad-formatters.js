/**
 * Shared display formatters for offer surfaces.
 *
 * Both the detail page and the listing grid render the same price, discount and
 * date values, so the rules live here instead of being duplicated (and drifting)
 * across two components.
 */

export function formatPrice(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getDiscountLabel(ad) {
  if (!ad.discountPercentage || !["flat", "upto"].includes(ad.discountType)) return "";
  return `${ad.discountType === "upto" ? "UPTO" : "FLAT"} ${ad.discountPercentage}% OFF`;
}

export function formatDate(value) {
  const timestamp = Date.parse(value || "");
  if (Number.isNaN(timestamp)) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(timestamp));
}
