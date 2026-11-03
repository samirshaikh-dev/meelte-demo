import { z } from "zod";

/**
 * Bounds for the opaque event cursor.
 *
 * `beforeCreatedAt` mirrors the upstream `created_at` text column and
 * `beforeId` mirrors `id`, so both are capped at the same lengths the
 * normalizer already enforces (`src/services/supabase-services/normalizers/event.js`).
 * Anything longer, empty, or containing control characters is rejected before it
 * can reach PostgREST.
 */
export const EVENTS_CURSOR_LIMITS = {
  beforeCreatedAt: 80,
  beforeId: 128,
};

const SINGLE_LINE = /[\u0000-\u001f\u007f]/;

const cursorString = (maxLength) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .refine((value) => !SINGLE_LINE.test(value), {
      message: "Cursor values must be single-line text.",
    });

export const EVENTS_CURSOR_SCHEMA = z.object({
  beforeCreatedAt: cursorString(EVENTS_CURSOR_LIMITS.beforeCreatedAt),
  beforeId: cursorString(EVENTS_CURSOR_LIMITS.beforeId),
});

/**
 * Validate the argument a browser may send to the `loadMoreEvents` server action.
 *
 * A server action is a public endpoint, so the cursor is treated as untrusted
 * input even though it originates from our own page.
 *
 * @param {unknown} input
 * @returns {{ cursor: { beforeCreatedAt: string, beforeId: string } } | null}
 */
export function validateEventsCursor(input) {
  const source = input && typeof input === "object" ? input : {};
  const result = EVENTS_CURSOR_SCHEMA.safeParse({
    beforeCreatedAt: source.beforeCreatedAt,
    beforeId: source.beforeId,
  });

  return result.success ? { cursor: result.data } : null;
}

