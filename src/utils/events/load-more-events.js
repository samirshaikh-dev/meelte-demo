"use server";

import { listPublicEvents } from "@/services/supabase-services/events/get-all-events";
import { LISTING_PAGE_SIZE } from "@/services/supabase-services/shared/constants";
import { validateEventsCursor } from "@/validation/events/events-cursor-validation";

/**
 * Append the next page of live community events to the `/events` listing.
 *
 * `AI_RULE.md` §2.1 forbids `app/api/**` route handlers, so the "load more"
 * round-trip goes through this Server Action instead. The anon key stays in
 * `src/services/supabase-services/shared/request.js` and is never part of the
 * request or the response.
 *
 * The action never throws. Next.js replaces thrown errors with an opaque digest
 * in production, so failures are returned as a discriminated result the client
 * can render honestly.
 *
 * @param {{ beforeCreatedAt?: unknown, beforeId?: unknown }} input
 * @returns {Promise<
 *   | { ok: true, items: Array<object>, nextCursor: { beforeCreatedAt: string, beforeId: string } | null }
 *   | { ok: false, error: "INVALID_CURSOR" | "UPSTREAM_UNAVAILABLE" }
 * >}
 */
export async function loadMoreEvents(input) {
  const validated = validateEventsCursor(input);
  if (!validated) {
    return { ok: false, error: "INVALID_CURSOR" };
  }

  try {
    const page = await listPublicEvents({
      limit: LISTING_PAGE_SIZE,
      beforeCreatedAt: validated.cursor.beforeCreatedAt,
      beforeId: validated.cursor.beforeId,
    });

    // The cursor comes from the last *raw* row, including events that have
    // already ended. `hasEnded` is filtered for display only; using the last
    // visible row instead would re-fetch or skip rows upstream.
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

