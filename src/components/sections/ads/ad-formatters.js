/**
 * Shared display formatters for offer surfaces.
 *
 * Both the detail page and the listing grid render the same price, discount and
 * date values, so the rules live here instead of being duplicated (and drifting)
 * across two components.
 */

/**
 * Rupee amounts for offers. Whole amounts drop the ",00" because "₹499.00" reads
 * as a price list entry, not a deal; fractional amounts keep their paise.
 */
export function formatPrice(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function getDiscountLabel(ad) {
  if (!ad.discountPercentage || !["flat", "upto"].includes(ad.discountType)) return "";
  return `${ad.discountType === "upto" ? "UPTO" : "FLAT"} ${ad.discountPercentage}% OFF`;
}

/**
 * Display casing for merchant-entered names.
 *
 * The rule itself lives in `src/lib/display-name.js` because event surfaces
 * render host-typed names with the same rule; re-exported here so offer
 * components keep one import site.
 */
export { formatDisplayName } from "@/lib/display-name";

/**
 * The one deal value shown over an offer photo, so the saving is visible before
 * any scrolling: the advertised discount when the shop set one, otherwise the
 * price drop, otherwise the plain price.
 */
export function getDealBadge(ad) {
  const discountLabel = getDiscountLabel(ad);
  if (discountLabel) return discountLabel;

  const finalPrice = formatPrice(ad.finalPrice);
  const originalPrice = formatPrice(ad.originalPrice);
  const hasPriceDrop =
    Boolean(originalPrice && finalPrice) &&
    typeof ad.originalPrice === "number" &&
    typeof ad.finalPrice === "number" &&
    ad.originalPrice > ad.finalPrice;

  if (hasPriceDrop) return `${originalPrice} → ${finalPrice}`;
  return finalPrice;
}

/**
 * Shop addresses arrive as free text, and many start with house numbers or a
 * Google plus code ("VPX7+RFW, Bengaluru, …"). Only a readable place name is
 * worth showing on a card, so unreadable leading fragments are skipped instead
 * of printed as an "area".
 */
function isReadablePlace(value) {
  if (!value) return false;
  if (value.length < 5 || value.length > 40) return false;
  if (/[0-9+]/.test(value)) return false;
  return /[A-Za-z]{3}/.test(value);
}

/**
 * The readable segments of a shop address, minus the trailing state and country
 * that every address repeats. Addresses are free text (Google-formatted), so the
 * first segments carry the locality that actually makes an offer local.
 */
function localityParts(locationName) {
  if (typeof locationName !== "string") return [];

  const parts = locationName
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const belt = parts.length > 2 ? parts.slice(0, -2) : parts;
  const readable = belt.filter(isReadablePlace);

  return readable.length > 0 ? readable : parts.filter(isReadablePlace);
}

function truncatePlace(place) {
  return place.length > 34 ? `${place.slice(0, 33).trimEnd()}…` : place;
}

function placeFromAddress(locationName) {
  return localityParts(locationName)[0] || "";
}

/**
 * Short area label for one offer. The API returns addresses and coordinates but
 * no distance, so the listing shows where an offer is, never a computed
 * "X km away" claim.
 */
export function getAreaLabel(ad) {
  const city = typeof ad.city === "string" ? ad.city.trim() : "";

  if (isReadablePlace(city)) return truncatePlace(city);

  const place = placeFromAddress(ad.locationName);
  return place ? truncatePlace(place) : "";
}

/**
 * The area the loaded offers actually concentrate in, used for the listing's
 * location pill. Every readable locality segment of each address is counted, so
 * "Kodathi gate, Kodathi JHC" still credits Kodathi JHC. Returns an empty string
 * when offers are spread across places, so the page never implies a single
 * neighbourhood it cannot support.
 */
export function getListingAreaLabel(ads = []) {
  if (ads.length === 0) return "";

  const counts = new Map();

  ads.forEach((ad) => {
    localityParts(ad?.locationName).forEach((place) => {
      counts.set(place, (counts.get(place) || 0) + 1);
    });
  });

  if (counts.size === 0) return "";

  const [topPlace, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return topCount / ads.length >= 0.5 ? truncatePlace(topPlace) : "";
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
 * Google Maps deep link for a shared offer, or null when the shop never placed
 * itself on the map. Coordinates arrive as numbers or null from the normalizer,
 * so anything that is not a real number is treated as "no location" rather than
 * formatted into a broken URL.
 */
export function getDirectionsHref(ad) {
  if (typeof ad.lat !== "number" || typeof ad.lng !== "number") return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ad.lat},${ad.lng}`)}`;
}
