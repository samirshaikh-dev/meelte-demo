import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { HR_COLLECTIONS } from "@/constants/hr-constants";
import { generateJobSlug } from "@/lib/slug";

/**
 * Normalizes Firestore timestamps into readable date strings for client UI.
 */
function normalizeJob(docSnap) {
  const data = docSnap.data();
  const createdAt = data.createdAt?.toDate
    ? data.createdAt.toDate().toISOString().split("T")[0]
    : data.createdAt || new Date().toISOString().split("T")[0];
  const updatedAt = data.updatedAt?.toDate
    ? data.updatedAt.toDate().toISOString().split("T")[0]
    : data.updatedAt || createdAt;

  const slug = data.slug || generateJobSlug(data.title, docSnap.id);

  return {
    id: docSnap.id,
    ...data,
    slug,
    createdAt,
    updatedAt,
  };
}

/**
 * Fetches all HR jobs from Cloud Firestore via Firebase Admin SDK.
 * Bypasses client security rules and executes with server-level privileges.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function fetchHrJobs() {
  try {
    const db = getAdminDb();
    const jobsRef = db.collection(HR_COLLECTIONS.JOBS);
    const snapshot = await jobsRef.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(normalizeJob);
  } catch (error) {
    console.error("[Jobs Admin Service] Error fetching jobs:", error);
    throw error;
  }
}

/**
 * Fetches a single HR job by ID from Firestore via Admin SDK.
 *
 * @param {string} id - Job ID
 * @returns {Promise<Object | null>}
 */
export async function fetchHrJobById(id) {
  try {
    const db = getAdminDb();
    const docRef = db.collection(HR_COLLECTIONS.JOBS).doc(id);
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      return normalizeJob(snapshot);
    }
    return null;
  } catch (error) {
    console.error(`[Jobs Admin Service] Job ${id} fetch error:`, error);
    throw error;
  }
}

/**
 * Fetches a single HR job by its unique slug or document ID from Firestore via Admin SDK.
 *
 * @param {string} slugOrId - URL slug or document ID
 * @returns {Promise<Object | null>}
 */
export async function fetchHrJobBySlugOrId(slugOrId) {
  if (!slugOrId) return null;

  try {
    const db = getAdminDb();
    const jobsRef = db.collection(HR_COLLECTIONS.JOBS);

    // 1. Try querying by slug field
    const snapshot = await jobsRef.where("slug", "==", slugOrId).limit(1).get();
    if (!snapshot.empty) {
      return normalizeJob(snapshot.docs[0]);
    }

    // 2. Fall back to direct ID lookup
    const directDoc = await fetchHrJobById(slugOrId);
    if (directDoc) {
      return directDoc;
    }

    // 3. Fall back to scanning all jobs for fallback slug match
    const allJobs = await fetchHrJobs();
    const matched = allJobs.find(
      (j) => j.slug === slugOrId || j.id === slugOrId
    );
    return matched || null;
  } catch (error) {
    console.error(`[Jobs Admin Service] Slug search error for "${slugOrId}":`, error);
    throw error;
  }
}

/**
 * Creates a new job document in Firestore with guaranteed slug via Admin SDK.
 *
 * @param {Object} jobData - New job details
 * @returns {Promise<Object>} Created job with ID & slug
 */
export async function createHrJob(jobData) {
  const db = getAdminDb();
  const newId = jobData.id || `job-${Date.now()}`;
  const docRef = db.collection(HR_COLLECTIONS.JOBS).doc(newId);
  const slug = jobData.slug || generateJobSlug(jobData.title, newId);

  const payload = {
    ...jobData,
    id: newId,
    slug,
    applicantCount: jobData.applicantCount || 0,
    status: jobData.status || "Active",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(payload);

  const today = new Date().toISOString().split("T")[0];
  return {
    ...payload,
    createdAt: today,
    updatedAt: today,
  };
}

/**
 * Updates an existing job document in Firestore via Admin SDK.
 *
 * @param {string} id - Job ID
 * @param {Object} updatedFields - Fields to update
 */
export async function updateHrJob(id, updatedFields) {
  const db = getAdminDb();
  const docRef = db.collection(HR_COLLECTIONS.JOBS).doc(id);

  const payload = {
    ...updatedFields,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (updatedFields.title && !updatedFields.slug) {
    payload.slug = generateJobSlug(updatedFields.title, id);
  }

  await docRef.update(payload);

  return { id, ...payload };
}

/**
 * Deletes a job document from Firestore via Admin SDK.
 *
 * @param {string} id - Job ID
 */
export async function deleteHrJob(id) {
  const db = getAdminDb();
  const docRef = db.collection(HR_COLLECTIONS.JOBS).doc(id);
  await docRef.delete();
}

