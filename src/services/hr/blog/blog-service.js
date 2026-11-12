import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { BLOG_COLLECTIONS, BLOG_POST_CATEGORIES, BLOG_STATUSES } from "@/constants/blog-constants";
import { slugify } from "@/lib/slug";

/**
 * Blog CMS write service for the HR portal (`/hr/blog`).
 *
 * Mirrors `src/services/hr/jobs/jobs-service.js`: plain Firestore **client**
 * SDK CRUD on the `blog_posts` collection (decision D-C1 — never
 * `firebase-admin`), imported by the `HrProvider` Client Component and by the
 * `/api/hr/blog` route handlers, so it must stay browser-safe.
 *
 * The public read layer is separate and stricter:
 * `src/services/site/blog/blog-service.js` (server-only, `"use cache"`) only
 * ever returns `status === "published"` documents. This service returns
 * drafts and archived posts too, because editors manage the full lifecycle.
 *
 * Firestore prerequisites (Firebase console, per environment):
 *   - Composite indexes on blog_posts listed in the public service header
 *     (`status + publishedAt(desc)`, `status + category + publishedAt(desc)`).
 *   - Security rules that allow the staff write path to blog_posts exactly as
 *     they already allow it for hr_jobs — HR auth is a cookie session, not
 *     Firebase Auth, so rules cannot distinguish it from the public reader.
 */

/**
 * Normalizes a Firestore blog post document into the shape the HR CMS UI
 * renders: ISO date strings, a guaranteed slug, and the same author/tags
 * fallbacks the public normalizer applies, so an edited draft can never
 * disagree with its published rendering.
 */
function normalizeBlogPost(docSnap) {
  const data = docSnap.data() || {};

  const toIso = (value) =>
    value?.toDate
      ? value.toDate().toISOString()
      : typeof value === "string" && value
        ? value
        : null;

  const createdAt = toIso(data.createdAt);
  const title = data.title || "Untitled Post";

  return {
    id: docSnap.id,
    ...data,
    title,
    slug: data.slug || slugify(title, docSnap.id),
    category: data.category || BLOG_POST_CATEGORIES[0],
    excerpt: data.excerpt || "",
    content: data.content || "",
    coverImage: data.coverImage || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: (data.status || BLOG_STATUSES.DRAFT).toLowerCase(),
    createdAt,
    updatedAt: toIso(data.updatedAt) || createdAt,
    // Never fabricated: a post that was never published keeps `null`, and
    // the table renders an em dash instead of a date (AI_RULE.md §2.6).
    publishedAt: toIso(data.publishedAt),
  };
}

/**
 * Fetches all blog posts for the CMS — drafts and archived included —
 * most recently edited first.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function fetchHrBlogPosts() {
  try {
    const db = getFirebaseDb();
    const postsRef = collection(db, BLOG_COLLECTIONS.POSTS);
    const q = query(postsRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(normalizeBlogPost);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Blog Service] Error fetching posts:", error.message);
    }
    return [];
  }
}

/**
 * Fetches a single blog post by Firestore ID, any status.
 *
 * @param {string} id - Firestore document ID
 * @returns {Promise<Object | null>}
 */
export async function fetchHrBlogPostById(id) {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, BLOG_COLLECTIONS.POSTS, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return normalizeBlogPost(snapshot);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Blog Service] Post ${id} fetch error:`, error.message);
    }
  }

  return null;
}

/**
 * Firestore rejects documents containing `undefined` field values, and a
 * zod-validated payload may carry optional keys set to `undefined` (for
 * example the slug transform). Every write goes through this filter first.
 */
function stripUndefinedFields(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  );
}

/**
 * Returns a slug that no existing post uses. The slug is the public
 * permalink (`/blog/{slug}`) and the public lookup resolves it with an
 * equality query, so a duplicate would make that lookup ambiguous.
 * Tries the bare slug, then `-2`, `-3`… before falling back to a short
 * timestamp suffix.
 */
async function ensureUniqueSlug(base) {
  const db = getFirebaseDb();
  const postsRef = collection(db, BLOG_COLLECTIONS.POSTS);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const snapshot = await getDocs(
      query(postsRef, where("slug", "==", candidate), firestoreLimit(1))
    );
    if (snapshot.empty) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Creates a new blog post document in Firestore with a guaranteed unique
 * slug. Publishing on create stamps `publishedAt` once.
 *
 * @param {Object} postData - Validated form payload
 * @returns {Promise<Object>} Created post with ISO date strings
 */
export async function createHrBlogPost(postData) {
  const db = getFirebaseDb();
  const newId = postData.id || `post-${Date.now()}`;
  const docRef = doc(db, BLOG_COLLECTIONS.POSTS, newId);

  const baseSlug = slugify(postData.slug || postData.title);
  const slug = await ensureUniqueSlug(baseSlug || `post-${newId}`);

  const status = postData.status || BLOG_STATUSES.DRAFT;

  const payload = stripUndefinedFields({
    ...postData,
    id: newId,
    slug,
    status,
    featured: Boolean(postData.featured),
    publishedAt: status === BLOG_STATUSES.PUBLISHED ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(docRef, payload);

  const nowIso = new Date().toISOString();
  return {
    ...payload,
    publishedAt: status === BLOG_STATUSES.PUBLISHED ? nowIso : null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Updates an existing blog post document.
 *
 * The slug is the public permalink, so it stays stable after creation unless
 * an explicit replacement is supplied (and that replacement is checked for
 * uniqueness). `publishedAt` is stamped only on the *first* publish — an
 * unpublish/republish cycle keeps the original date so feeds, sitemaps and
 * JSON-LD never see a fabricated publish date.
 *
 * @param {string} id - Firestore document ID
 * @param {Object} updatedFields - Validated fields to update
 * @returns {Promise<Object>} Re-read, normalized post
 */
export async function updateHrBlogPost(id, updatedFields) {
  const db = getFirebaseDb();
  const docRef = doc(db, BLOG_COLLECTIONS.POSTS, id);

  // Read current state first: it decides the publishedAt transition and
  // proves the document exists before updateDoc can throw opaquely.
  const currentSnap = await getDoc(docRef);
  if (!currentSnap.exists()) {
    throw new Error(`Blog post "${id}" not found.`);
  }
  const currentData = currentSnap.data() || {};

  const payload = stripUndefinedFields({
    ...updatedFields,
    updatedAt: serverTimestamp(),
  });

  // The slug is the public permalink: it stays stable unless an explicit
  // *replacement* is supplied. An unchanged (or absent) slug is never
  // re-suffixed, because that would silently break the live `/blog/{slug}` URL.
  if (updatedFields.slug) {
    const nextSlug = slugify(updatedFields.slug);
    if (nextSlug && nextSlug !== currentData.slug) {
      payload.slug = await ensureUniqueSlug(nextSlug);
    } else {
      delete payload.slug;
    }
  } else {
    delete payload.slug;
  }

  const nextStatus = (
    updatedFields.status ||
    currentData.status ||
    BLOG_STATUSES.DRAFT
  ).toLowerCase();
  if (nextStatus === BLOG_STATUSES.PUBLISHED && !currentData.publishedAt) {
    payload.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, payload);

  const refreshed = await getDoc(docRef);
  return normalizeBlogPost(refreshed);
}

/**
 * Deletes a blog post document from Firestore. The public `/blog/[slug]`
 * route then 404s on its next revalidation window.
 *
 * @param {string} id - Firestore document ID
 */
export async function deleteHrBlogPost(id) {
  const db = getFirebaseDb();
  const docRef = doc(db, BLOG_COLLECTIONS.POSTS, id);
  await deleteDoc(docRef);
}
