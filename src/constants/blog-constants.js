/**
 * meelTe — Blog Domain Constants & Enums
 *
 * Single source of truth for the public blog's Firestore collection name,
 * canonical category taxonomy, post status lifecycle, page-size caps and the
 * AEO direct-answer lede rendered on `/blog`.
 *
 * Firestore document shape for `blog_posts` (authored by meelTe staff):
 *   title: string, slug: string, excerpt: string, content: string (HTML),
 *   coverImage: string (https URL), category: string (one of BLOG_CATEGORIES,
 *   excluding "All Stories"), tags: string[],
 *   status: "published" | "draft" | "archived", featured: boolean,
 *   readingTime: number (optional — derived when absent),
 *   publishedAt: Firestore Timestamp, updatedAt: Firestore Timestamp.
 *
 * Copy guardrails (AI_RULE.md §2.3): pan-India framing only — no city names,
 * no kilometre radius claims, no fabricated metrics.
 */

export const BLOG_COLLECTIONS = Object.freeze({
  POSTS: "blog_posts",
});

export const BLOG_CATEGORIES = Object.freeze([
  "All Stories",
  "Hyperlocal Guides",
  "Community Stories",
  "Merchant Playbook",
  "Product News",
]);

/**
 * Categories a `blog_posts` document may actually carry. "All Stories" is a
 * UI-only filter default on `/blog` — it is never a stored category, so the
 * blog CMS validation schema and the editor category select both use this
 * list instead of BLOG_CATEGORIES.
 */
export const BLOG_POST_CATEGORIES = Object.freeze(
  BLOG_CATEGORIES.filter((category) => category !== "All Stories")
);

export const BLOG_STATUSES = Object.freeze({
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
});

export const DEFAULT_BLOG_PAGE_SIZE = 12;

/**
 * AEO direct answer for the blog hub — a self-contained, quotable summary of
 * what the meelTe Blog publishes, placed directly under the `/blog` heading so
 * answer engines can extract it without crawling the grid.
 */
export const BLOG_DIRECT_ANSWER =
  "The meelTe Blog features hyperlocal guides, community stories, local merchant strategies, and product updates to help residents and local businesses connect and grow across Indian neighbourhoods.";
