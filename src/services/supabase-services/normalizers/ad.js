import { category, coordinate, number, publicUrl, text } from "./primitives";

/**
 * Map one raw `web_*` offer row onto the fields the shared-link page renders.
 * Anything the page must not display is dropped here rather than at the edge.
 */
export function normalizeAd(value) {
  if (!value || typeof value !== "object") return null;

  const finalPrice = number(value.final_price);
  const originalPrice = number(value.original_price);

  return {
    id: text(value.id, 128),
    productName: text(value.product_name, 300),
    brandName: text(value.brand_name, 300),
    description: text(value.description),
    category: category(value.category, value.custom_category),
    photoUrl: publicUrl(value.photo_url),
    adType: text(value.ad_type, 40),
    finalPrice: finalPrice !== null && finalPrice >= 0 ? finalPrice : null,
    originalPrice: originalPrice !== null && originalPrice >= 0 ? originalPrice : null,
    discountType: text(value.discount_type, 40),
    discountPercentage: number(value.discount_percentage),
    locationName: text(value.location_name, 500),
    lat: coordinate(value.lat, -90, 90),
    lng: coordinate(value.lng, -180, 180),
    city: text(value.city, 120),
    state: text(value.state, 120),
    country: text(value.country, 120),
    startAt: text(value.start_at, 80),
    endAt: text(value.end_at, 80),
    hasEnded: value.has_ended === true,
    createdBy: text(value.created_by, 200),
    likesCount: number(value.likes_count),
    commentsCount: number(value.comments_count),
    createdAt: text(value.created_at, 80),
  };
}
