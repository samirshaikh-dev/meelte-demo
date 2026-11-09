"use server";

import { listPublicEvents } from "@/services/supabase-services/events/get-all-events";
import { LISTING_PAGE_SIZE } from "@/services/supabase-services/shared/constants";
import { validateEventsFilter } from "@/validation/events/events-cursor-validation";

/**
 * Fetch a page of live community events, optionally filtered by category,
 * with cursor pagination.
 *
 * @param {{ category?: string, beforeCreatedAt?: string, beforeId?: string }} input
 * @returns {Promise<
 *   | { ok: true, items: Array<object>, nextCursor: { beforeCreatedAt: string, beforeId: string } | null }
 *   | { ok: false, error: "INVALID_CURSOR" | "UPSTREAM_UNAVAILABLE" }
 * >}
 */
export async function loadMoreEvents(input) {
  const validated = validateEventsFilter(input);
  if (!validated) {
    return { ok: false, error: "INVALID_CURSOR" };
  }

  try {
    const page = await listPublicEvents({
      limit: LISTING_PAGE_SIZE,
      category: validated.category,
      beforeCreatedAt: validated.cursor?.beforeCreatedAt,
      beforeId: validated.cursor?.beforeId,
    });

    const last = page[page.length - 1];
    const hasMore = page.length === LISTING_PAGE_SIZE;

    return {
      ok: true,
      items: page.filter((event) => !event.hasEnded),
      nextCursor:
        hasMore && last?.createdAt && last?.id
          ? { beforeCreatedAt: last.createdAt, beforeId: last.id }
          : null,
    };
  } catch {
    return { ok: false, error: "UPSTREAM_UNAVAILABLE" };
  }
}
