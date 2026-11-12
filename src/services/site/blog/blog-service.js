import "server-only";
import { cacheLife } from "next/cache";
import { fetchHrBlogPosts, fetchHrBlogPostById } from "@/services/hr/server";
import {
  BLOG_STATUSES,
  DEFAULT_BLOG_PAGE_SIZE,
} from "@/constants/blog-constants";

/** Upper bound for any single public fetch, whatever the caller asks for. */
const MAX_BLOG_PAGE_SIZE = 100;

/** Clamps the requested page size to a sane server-side bound. */
function boundedPageSize(pageSize) {
  const requested = Number(pageSize) || DEFAULT_BLOG_PAGE_SIZE;
  return Math.min(Math.max(1, requested), MAX_BLOG_PAGE_SIZE);
}

/**
 * Maps an admin blog document into the public-safe shape rendered by `/blog` and `/blog/[slug]`.
 */
function toPublicBlogPost(post) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    content: post.content || "",
    coverImage: post.coverImage || null,
    coverImageAlt: post.coverImageAlt || "",
    category: post.category || "Hyperlocal Guides",
    tags: Array.isArray(post.tags) ? post.tags : [],
    status: (post.status || BLOG_STATUSES.PUBLISHED).toLowerCase(),
    featured: Boolean(post.featured),
    readingTime: post.readingTime || null,
    publishedAt: post.publishedAt || null,
    updatedAt: post.updatedAt || post.publishedAt || null,
  };
}

/**
 * Fetches published blog posts, newest first, optionally filtered by category.
 * Uses server-side Admin Firestore via `@/services/hr/server` (matching the
 * public careers service) so public pages never fail due to Firestore client
 * rules or missing composite indexes.
 *
 * Cached with the `minutes` profile (revalidate 60s, expire 1h).
 *
 * @param {{ category?: string, pageSize?: number }} [options]
 * @returns {Promise<Array<Object>>} Public blog post summaries
 */
export async function fetchPublicBlogPosts({
  category,
  pageSize = DEFAULT_BLOG_PAGE_SIZE,
} = {}) {
  "use cache";
  cacheLife("minutes");

  try {
    const allPosts = await fetchHrBlogPosts();
    const isAll = !category || category.trim().toLowerCase() === "all stories";
    const targetCategory = category?.trim().toLowerCase();

    const publishedPosts = allPosts
      .filter((post) => {
        if ((post.status || "").toLowerCase() !== BLOG_STATUSES.PUBLISHED) {
          return false;
        }
        if (!isAll && (post.category || "").toLowerCase() !== targetCategory) {
          return false;
        }
        return true;
      })
      .map(toPublicBlogPost)
      .sort((a, b) => {
        const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return timeB - timeA;
      });

    return publishedPosts.slice(0, boundedPageSize(pageSize));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Blog Service] Failed to fetch blog posts:", error.message);
    }
    return [];
  }
}

/**
 * Fetches a single published blog post by its URL slug or Firestore document ID.
 * Returns `null` when the post does not exist, is a draft, or is archived.
 *
 * Cached with the `minutes` profile so this page and its `generateMetadata`
 * share one cache entry per slug.
 *
 * @param {string} slugOrId - URL slug or Firestore document ID
 * @returns {Promise<Object | null>} Public blog post, or null
 */
export async function fetchPublicBlogPostBySlugOrId(slugOrId) {
  "use cache";
  cacheLife("minutes");

  if (!slugOrId || typeof slugOrId !== "string") return null;

  try {
    const allPosts = await fetchHrBlogPosts();
    const matchBySlug = allPosts.find(
      (post) =>
        post.slug === slugOrId &&
        (post.status || "").toLowerCase() === BLOG_STATUSES.PUBLISHED
    );

    if (matchBySlug) {
      return toPublicBlogPost(matchBySlug);
    }

    const directPost = await fetchHrBlogPostById(slugOrId);
    if (
      directPost &&
      (directPost.status || "").toLowerCase() === BLOG_STATUSES.PUBLISHED
    ) {
      return toPublicBlogPost(directPost);
    }

    return null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Blog Service] Error fetching post "${slugOrId}":`, error.message);
    }
    return null;
  }
}

/**
 * Fetches related published posts from the same category, excluding the
 * current article, for the "Related Stories" section of `/blog/[slug]`.
 *
 * @param {string} currentPostId - Firestore ID of the article being read
 * @param {string} category - Category to pull related stories from
 * @param {number} [maxItems=3] - Maximum related posts to return
 * @returns {Promise<Array<Object>>} Up to `maxItems` related posts
 */
export async function fetchRelatedBlogPosts(currentPostId, category, maxItems = 3) {
  "use cache";
  cacheLife("minutes");

  try {
    const posts = await fetchPublicBlogPosts({
      category,
      pageSize: maxItems + 2,
    });
    return posts.filter((p) => p.id !== currentPostId).slice(0, maxItems);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Blog Service] Failed to fetch related posts:", error.message);
    }
    return [];
  }
}
