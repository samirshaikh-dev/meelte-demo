import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import {
  BLOG_COLLECTIONS,
  BLOG_POST_CATEGORIES,
  BLOG_STATUSES,
} from "@/constants/blog-constants";
import { slugify } from "@/lib/slug";

/**
 * Normalizes a Firestore Admin document snapshot into the HR Blog CMS shape.
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

  let readingTime = Number.isFinite(data.readingTime)
    ? Math.max(1, Math.ceil(data.readingTime))
    : null;
  if (!readingTime && typeof data.content === "string" && data.content.trim()) {
    const wordCount = data.content
      .replace(/<[^>]+>/g, " ")
      .trim()
      .split(/\s+/).length;
    readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  return {
    id: docSnap.id,
    ...data,
    title,
    slug: data.slug || slugify(title, docSnap.id),
    category: data.category || BLOG_POST_CATEGORIES[0],
    excerpt: data.excerpt || "",
    content: data.content || "",
    coverImage: data.coverImage || null,
    coverImageAlt: data.coverImageAlt || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: (data.status || BLOG_STATUSES.DRAFT).toLowerCase(),
    featured: Boolean(data.featured),
    readingTime,
    createdAt,
    updatedAt: toIso(data.updatedAt) || createdAt,
    publishedAt: toIso(data.publishedAt),
  };
}

/**
 * Filters out undefined field values before writing to Firestore.
 */
function stripUndefinedFields(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  );
}

/**
 * Ensures the story slug is unique across the `blog_posts` collection.
 */
async function ensureUniqueSlug(base) {
  const db = getAdminDb();
  const postsRef = db.collection(BLOG_COLLECTIONS.POSTS);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const snapshot = await postsRef
      .where("slug", "==", candidate)
      .limit(1)
      .get();
    if (snapshot.empty) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Fetches all blog posts for the HR CMS via Firebase Admin SDK.
 * Bypasses client security rules and executes with server-level privileges.
 */
export async function fetchHrBlogPosts() {
  try {
    const db = getAdminDb();
    const postsRef = db.collection(BLOG_COLLECTIONS.POSTS);
    const snapshot = await postsRef.orderBy("updatedAt", "desc").get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(normalizeBlogPost);
  } catch (error) {
    console.error("[Blog Admin Service] Error fetching posts:", error);
    throw error;
  }
}

/**
 * Fetches a single blog post by ID via Firebase Admin SDK.
 */
export async function fetchHrBlogPostById(id) {
  try {
    const db = getAdminDb();
    const docRef = db.collection(BLOG_COLLECTIONS.POSTS).doc(id);
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      return normalizeBlogPost(snapshot);
    }
    return null;
  } catch (error) {
    console.error(`[Blog Admin Service] Post ${id} fetch error:`, error);
    throw error;
  }
}

/**
 * Creates a new blog post in Firestore via Firebase Admin SDK.
 */
export async function createHrBlogPost(postData) {
  const db = getAdminDb();
  const newId = postData.id || `post-${Date.now()}`;
  const docRef = db.collection(BLOG_COLLECTIONS.POSTS).doc(newId);

  const baseSlug = slugify(postData.slug || postData.title);
  const slug = await ensureUniqueSlug(baseSlug || `post-${newId}`);
  const status = postData.status || BLOG_STATUSES.DRAFT;

  const payload = stripUndefinedFields({
    ...postData,
    id: newId,
    slug,
    status,
    featured: Boolean(postData.featured),
    publishedAt:
      status === BLOG_STATUSES.PUBLISHED ? FieldValue.serverTimestamp() : null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await docRef.set(payload);

  const nowIso = new Date().toISOString();
  return {
    ...payload,
    publishedAt: status === BLOG_STATUSES.PUBLISHED ? nowIso : null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Updates an existing blog post in Firestore via Firebase Admin SDK.
 */
export async function updateHrBlogPost(id, updatedFields) {
  const db = getAdminDb();
  const docRef = db.collection(BLOG_COLLECTIONS.POSTS).doc(id);

  const currentSnap = await docRef.get();
  if (!currentSnap.exists) {
    throw new Error(`Blog post "${id}" not found.`);
  }
  const currentData = currentSnap.data() || {};

  const payload = stripUndefinedFields({
    ...updatedFields,
    updatedAt: FieldValue.serverTimestamp(),
  });

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
    payload.publishedAt = FieldValue.serverTimestamp();
  }

  await docRef.update(payload);

  const refreshed = await docRef.get();
  return normalizeBlogPost(refreshed);
}

/**
 * Deletes a blog post document via Firebase Admin SDK.
 */
export async function deleteHrBlogPost(id) {
  const db = getAdminDb();
  const docRef = db.collection(BLOG_COLLECTIONS.POSTS).doc(id);
  await docRef.delete();
}
