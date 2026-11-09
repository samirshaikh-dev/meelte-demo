import { z } from "zod";

/**
 * Bounds for the opaque offer cursor.
 *
 * `beforeCreatedAt` mirrors the upstream `created_at` text column and
 * `beforeId` mirrors `id`, so both are capped at the same lengths the
 * normalizer already enforces (`src/services/supabase-services/normalizers/ad.js`).
 * Anything longer, empty, or containing control characters is rejected before it
 * can reach PostgREST.
 */
export const ADS_CURSOR_LIMITS = {
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

export const ADS_CURSOR_SCHEMA = z.object({
  beforeCreatedAt: cursorString(ADS_CURSOR_LIMITS.beforeCreatedAt),
  beforeId: cursorString(ADS_CURSOR_LIMITS.beforeId),
});

export const ADS_FILTER_SCHEMA = z.object({
  category: z
    .string()
    .trim()
    .max(120)
    .refine((value) => !SINGLE_LINE.test(value), {
      message: "Category must be single-line text.",
    })
    .optional(),
  beforeCreatedAt: cursorString(ADS_CURSOR_LIMITS.beforeCreatedAt).optional(),
  beforeId: cursorString(ADS_CURSOR_LIMITS.beforeId).optional(),
});

/**
 * Validate the filter and pagination argument a browser may send to the `loadMoreAds` server action.
 *
 * @param {unknown} input
 * @returns {{ category?: string, cursor: { beforeCreatedAt: string, beforeId: string } | null } | null}
 */
export function validateAdsFilter(input) {
  const source = input && typeof input === "object" ? input : {};
  const categoryRaw = typeof source.category === "string" ? source.category.trim() : undefined;

  let validatedCategory;
  if (categoryRaw) {
    const catParsed = ADS_FILTER_SCHEMA.shape.category.safeParse(categoryRaw);
    if (!catParsed.success) return null;
    validatedCategory = catParsed.data;
  }

  // Cursor is optional, but if either beforeCreatedAt or beforeId is passed, both must be valid
  if (source.beforeCreatedAt || source.beforeId) {
    const cursorResult = ADS_CURSOR_SCHEMA.safeParse({
      beforeCreatedAt: source.beforeCreatedAt,
      beforeId: source.beforeId,
    });
    if (!cursorResult.success) return null;
    return {
      category: validatedCategory,
      cursor: cursorResult.data,
    };
  }

  return {
    category: validatedCategory,
    cursor: null,
  };
}

/**
 * Validate the argument a browser may send to the `loadMoreAds` server action.
 *
 * A server action is a public endpoint, so the cursor is treated as untrusted
 * input even though it originates from our own page.
 *
 * @param {unknown} input
 * @returns {{ cursor: { beforeCreatedAt: string, beforeId: string } } | null}
 */
export function validateAdsCursor(input) {
  const source = input && typeof input === "object" ? input : {};
  const result = ADS_CURSOR_SCHEMA.safeParse({
    beforeCreatedAt: source.beforeCreatedAt,
    beforeId: source.beforeId,
  });

  return result.success ? { cursor: result.data } : null;
}
