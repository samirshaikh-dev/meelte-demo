import { CACHE_TAGS, LIST_REVALIDATE_SECONDS } from "../shared/constants";
import { request } from "../shared/request";
import { normalizeCategory } from "../normalizers/category";

/**
 * Fetch all categories that currently have live or upcoming public events.
 * Upstream RPC: web_list_event_categories
 */
export async function listEventCategories() {
  const data = await request(
    "web_list_event_categories",
    {},
    {
      revalidate: LIST_REVALIDATE_SECONDS,
      tag: CACHE_TAGS.eventCategories,
    }
  );

  return Array.isArray(data)
    ? data.map(normalizeCategory).filter((item) => item?.category)
    : [];
}

