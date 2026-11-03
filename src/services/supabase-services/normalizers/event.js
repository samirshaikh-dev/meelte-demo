import { category, coordinate, number, publicUrl, text } from "./primitives";

/**
 * Map one raw `web_*` event row onto the fields the shared-link page renders.
 * Anything the page must not display is dropped here rather than at the edge.
 */
export function normalizeEvent(value) {
  if (!value || typeof value !== "object") return null;

  const cost = number(value.cost);

  return {
    id: text(value.id, 128),
    title: text(value.title, 300),
    description: text(value.description),
    category: category(value.category, value.custom_category),
    cost: cost !== null && cost >= 0 ? cost : 0,
    coverUrl: publicUrl(value.cover_url),
    locationName: text(value.location_name, 500),
    address: text(value.address, 1000),
    lat: coordinate(value.lat, -90, 90),
    lng: coordinate(value.lng, -180, 180),
    city: text(value.city, 120),
    state: text(value.state, 120),
    country: text(value.country, 120),
    startTime: text(value.start_time, 80),
    endTime: text(value.end_time, 80),
    hasEnded: value.has_ended === true,
    creatorName: text(value.creator_name, 200),
    creatorPhotoUrl: publicUrl(value.creator_photo_url),
    attendeesCount: number(value.attendees_count),
    likesCount: number(value.likes_count),
    commentsCount: number(value.comments_count),
    createdAt: text(value.created_at, 80),
  };
}
