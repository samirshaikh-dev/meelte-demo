"use server";

import { listPublicAds } from "@/services/supabase-services/ads/get-all-ads";
import { LISTING_PAGE_SIZE } from "@/services/supabase-services/shared/constants";
import { validateAdsFilter } from "@/validation/ads/ads-cursor-validation";

/**
 * Fetch a page of live offers, optionally filtered by category,
 * with cursor pagination.
 *
 * @param {{ category?: string, beforeCreatedAt?: string, beforeId?: string }} input
 * @returns {Promise<
 *   | { ok: true, items: Array<object>, nextCursor: { beforeCreatedAt: string, beforeId: string } | null }
 *   | { ok: false, error: "INVALID_CURSOR" | "UPSTREAM_UNAVAILABLE" }
 * >}
 */
export async function loadMoreAds(input) {
  const validated = validateAdsFilter(input);
  if (!validated) {
    return { ok: false, error: "INVALID_CURSOR" };
  }

  try {
    const page = await listPublicAds({
      limit: LISTING_PAGE_SIZE,
      category: validated.category,
      beforeCreatedAt: validated.cursor?.beforeCreatedAt,
      beforeId: validated.cursor?.beforeId,
    });

    const last = page[page.length - 1];
    const hasMore = page.length === LISTING_PAGE_SIZE;

    return {
      ok: true,
      items: page.filter((ad) => !ad.hasEnded),
      nextCursor:
        hasMore && last?.createdAt && last?.id
          ? { beforeCreatedAt: last.createdAt, beforeId: last.id }
          : null,
    };
  } catch {
    return { ok: false, error: "UPSTREAM_UNAVAILABLE" };
  }
}
