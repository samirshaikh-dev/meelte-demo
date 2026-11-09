import { CACHE_TAGS, LIST_REVALIDATE_SECONDS } from "../shared/constants";
import { request } from "../shared/request";
import { normalizeCategory } from "../normalizers/category";

/**
 * Fetch all categories that currently have live ads.
 * Upstream RPC: web_list_ad_categories
 */
export async function listAdCategories() {
  const data = await request(
    "web_list_ad_categories",
    {},
    {
      revalidate: LIST_REVALIDATE_SECONDS,
      tag: CACHE_TAGS.adCategories,
    }
  );

  return Array.isArray(data)
    ? data.map(normalizeCategory).filter((item) => item?.category)
    : [];
}

