import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { HR_COLLECTIONS } from "@/constants/hr-constants";

/**
 * Normalizes Firestore candidate document into client model.
 */
function normalizeCandidate(docSnap) {
  const data = docSnap.data();
  const appliedDate = data.appliedDate?.toDate
    ? data.appliedDate.toDate().toISOString().split("T")[0]
    : data.appliedDate || new Date().toISOString().split("T")[0];

  return {
    id: docSnap.id,
    ...data,
    appliedDate,
  };
}

/**
 * Fetches all candidates from Cloud Firestore via Firebase Admin SDK.
 * Bypasses client security rules and executes with server-level privileges.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function fetchHrCandidates() {
  try {
    const db = getAdminDb();
    const candRef = db.collection(HR_COLLECTIONS.CANDIDATES);
    const snapshot = await candRef.orderBy("appliedDate", "desc").get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(normalizeCandidate);
  } catch (error) {
    console.error("[Candidates Admin Service] Error fetching candidates:", error);
    throw error;
  }
}

/**
 * Updates a candidate's pipeline status stage in Firestore via Admin SDK.
 *
 * @param {string} candidateId - Candidate ID
 * @param {string} newStatus - New stage (e.g., 'Interview', 'Offered')
 */
export async function updateCandidateStage(candidateId, newStatus) {
  const db = getAdminDb();
  const docRef = db.collection(HR_COLLECTIONS.CANDIDATES).doc(candidateId);

  await docRef.update({
    status: newStatus,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Appends a new internal note to a candidate profile in Firestore via Admin SDK.
 *
 * @param {string} candidateId - Candidate ID
 * @param {string} noteText - Content of the evaluation note
 * @param {string} [author="HR Operations"] - Note author
 * @returns {Promise<Object>} Created note object
 */
export async function addCandidateNote(candidateId, noteText, author = "HR Operations") {
  const db = getAdminDb();
  const docRef = db.collection(HR_COLLECTIONS.CANDIDATES).doc(candidateId);

  const today = new Date().toISOString().split("T")[0];
  const newNote = {
    id: `note-${Date.now()}`,
    author,
    date: today,
    text: noteText.trim(),
  };

  await docRef.update({
    notes: FieldValue.arrayUnion(newNote),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return newNote;
}

/**
 * Submits a new candidate application to Firestore via Admin SDK and increments applicantCount.
 *
 * @param {Object} candidateData - Applicant details
 * @returns {Promise<Object>} Created candidate record
 */
export async function createCandidateApplication(candidateData) {
  const db = getAdminDb();
  const candidateId = candidateData.id || `cand-${Date.now()}`;
  const candDocRef = db.collection(HR_COLLECTIONS.CANDIDATES).doc(candidateId);
  const today = new Date().toISOString().split("T")[0];

  const payload = {
    ...candidateData,
    id: candidateId,
    status: candidateData.status || "Applied",
    appliedDate: today,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await candDocRef.set(payload);

  // Atomically increment applicant count on the associated job
  if (candidateData.appliedJobId) {
    try {
      const jobDocRef = db.collection(HR_COLLECTIONS.JOBS).doc(candidateData.appliedJobId);
      await jobDocRef.update({
        applicantCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (jobErr) {
      console.error("[Candidates Admin Service] Failed to increment job applicant count:", jobErr.message);
    }
  }

  return {
    ...payload,
    appliedDate: today,
  };
}

