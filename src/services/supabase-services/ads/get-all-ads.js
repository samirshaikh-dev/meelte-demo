import {
  CACHE_TAGS,
  DEFAULT_PAGE_SIZE,
  LIST_REVALIDATE_SECONDS,
  SITEMAP_REVALIDATE_SECONDS,
} from "../shared/constants";
import { allPages } from "../shared/pagination";
import { request } from "../shared/request";
import { normalizeAd } from "../normalizers/ad";
import { normalizeLimit, text } from "../normalizers/primitives";

/**
 * One bounded page of public offers, newest first.
 *
 * Cursor pagination: pass the previous page's `createdAt` and `id` as
 * `beforeCreatedAt` / `beforeId` to continue.
 */
export async function listPublicAds({
  limit = DEFAULT_PAGE_SIZE,
  category: categoryName,
  beforeCreatedAt,
  beforeId,
  forSitemap = false,
} = {}) {
  const data = await request(
    "web_list_ads",
    {
      p_limit: normalizeLimit(limit),
      ...(categoryName && { p_category: text(categoryName, 120) }),
      ...(beforeCreatedAt && { p_before_created_at: beforeCreatedAt }),
      ...(beforeId && { p_before_id: beforeId }),
    },
    {
      revalidate: forSitemap ? SITEMAP_REVALIDATE_SECONDS : LIST_REVALIDATE_SECONDS,
      tag: CACHE_TAGS.ads,
    }
  );

  return Array.isArray(data) ? data.map(normalizeAd).filter((item) => item?.id) : [];
}

/**
 * Every live offer, walked page by page. Used only by the sitemap, which needs
 * the complete set rather than one page.
 */
export async function allLiveAds() {
  return allPages((cursor) => listPublicAds({ ...cursor, forSitemap: true }));
}
