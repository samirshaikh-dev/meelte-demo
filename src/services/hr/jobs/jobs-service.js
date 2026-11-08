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
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
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
 * Fetches all HR jobs from Firestore.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function fetchHrJobs() {
  try {
    const db = getFirebaseDb();
    const jobsRef = collection(db, HR_COLLECTIONS.JOBS);
    const q = query(jobsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(normalizeJob);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Jobs Service] Error fetching jobs:", error.message);
    }
    return [];
  }
}

/**
 * Fetches a single HR job by ID from Firestore.
 *
 * @param {string} id - Job ID
 * @returns {Promise<Object | null>}
 */
export async function fetchHrJobById(id) {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, HR_COLLECTIONS.JOBS, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return normalizeJob(snapshot);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Jobs Service] Job ${id} fetch error:`, error.message);
    }
  }

  return null;
}

/**
 * Fetches a single HR job by its unique slug or document ID from Firestore.
 *
 * @param {string} slugOrId - URL slug or document ID
 * @returns {Promise<Object | null>}
 */
export async function fetchHrJobBySlugOrId(slugOrId) {
  if (!slugOrId) return null;

  try {
    const db = getFirebaseDb();
    const jobsRef = collection(db, HR_COLLECTIONS.JOBS);

    // 1. Try querying by slug field
    const q = query(jobsRef, where("slug", "==", slugOrId));
    const snapshot = await getDocs(q);

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
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Jobs Service] Slug search error for "${slugOrId}":`, error.message);
    }
    return null;
  }
}

/**
 * Creates a new job document in Firestore with guaranteed slug.
 *
 * @param {Object} jobData - New job details
 * @returns {Promise<Object>} Created job with ID & slug
 */
export async function createHrJob(jobData) {
  const db = getFirebaseDb();
  const newId = jobData.id || `job-${Date.now()}`;
  const docRef = doc(db, HR_COLLECTIONS.JOBS, newId);
  const slug = jobData.slug || generateJobSlug(jobData.title, newId);

  const payload = {
    ...jobData,
    id: newId,
    slug,
    applicantCount: jobData.applicantCount || 0,
    status: jobData.status || "Active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload);

  const today = new Date().toISOString().split("T")[0];
  return {
    ...payload,
    createdAt: today,
    updatedAt: today,
  };
}

/**
 * Updates an existing job document in Firestore.
 *
 * @param {string} id - Job ID
 * @param {Object} updatedFields - Fields to update
 */
export async function updateHrJob(id, updatedFields) {
  const db = getFirebaseDb();
  const docRef = doc(db, HR_COLLECTIONS.JOBS, id);

  const payload = {
    ...updatedFields,
    updatedAt: serverTimestamp(),
  };

  if (updatedFields.title && !updatedFields.slug) {
    payload.slug = generateJobSlug(updatedFields.title, id);
  }

  await updateDoc(docRef, payload);

  return { id, ...payload };
}

/**
 * Deletes a job document from Firestore.
 *
 * @param {string} id - Job ID
 */
export async function deleteHrJob(id) {
  const db = getFirebaseDb();
  const docRef = doc(db, HR_COLLECTIONS.JOBS, id);
  await deleteDoc(docRef);
}

