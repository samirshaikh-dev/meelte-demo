import {
  CACHE_TAGS,
  DEFAULT_PAGE_SIZE,
  LIST_REVALIDATE_SECONDS,
  SITEMAP_REVALIDATE_SECONDS,
} from "../shared/constants";
import { allPages } from "../shared/pagination";
import { request } from "../shared/request";
import { normalizeEvent } from "../normalizers/event";
import { normalizeLimit, text } from "../normalizers/primitives";

/**
 * One bounded page of public events, newest first.
 *
 * Cursor pagination: pass the previous page's `createdAt` and `id` as
 * `beforeCreatedAt` / `beforeId` to continue.
 */
export async function listPublicEvents({
  limit = DEFAULT_PAGE_SIZE,
  category: categoryName,
  beforeCreatedAt,
  beforeId,
  forSitemap = false,
} = {}) {
  const isAll = !categoryName || categoryName.trim().toLowerCase() === "all";
  const data = await request(
    "web_list_events",
    {
      p_limit: normalizeLimit(limit),
      ...(!isAll && { p_category: text(categoryName, 120) }),
      ...(beforeCreatedAt && { p_before_created_at: beforeCreatedAt }),
      ...(beforeId && { p_before_id: beforeId }),
    },
    {
      revalidate: forSitemap ? SITEMAP_REVALIDATE_SECONDS : LIST_REVALIDATE_SECONDS,
      tag: CACHE_TAGS.events,
    }
  );

  return Array.isArray(data) ? data.map(normalizeEvent).filter((item) => item?.id) : [];
}

/**
 * Every live event, walked page by page. Used only by the sitemap, which needs
 * the complete set rather than one page.
 */
export async function allLiveEvents() {
  return allPages((cursor) => listPublicEvents({ ...cursor, forSitemap: true }));
}
