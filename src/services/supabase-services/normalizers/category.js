/**
 * Normalize a category row returned by `web_list_ad_categories` or `web_list_event_categories`.
 *
 * Contract per MEELTE Web API v1.1:
 * - category: Exact stored name. Display in menu and send as p_category. Don't trim or change it.
 * - slug: Lowercase form for URLs. Null when the name has no a-z or 0-9.
 * - live_count: Number of live items for this category.
 * - is_other: true for Other / Others catch-all category.
 */
export function normalizeCategory(raw) {
  if (!raw || typeof raw !== "object") return null;

  const categoryName = typeof raw.category === "string" ? raw.category : "";
  if (!categoryName) return null;

  return {
    category: categoryName,
    slug: typeof raw.slug === "string" ? raw.slug : null,
    liveCount: typeof raw.live_count === "number" && Number.isFinite(raw.live_count) ? raw.live_count : 0,
    isOther: Boolean(raw.is_other),
  };
}

