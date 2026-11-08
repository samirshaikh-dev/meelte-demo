import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  arrayUnion,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
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
 * Fetches all candidates from Firestore.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function fetchHrCandidates() {
  try {
    const db = getFirebaseDb();
    const candRef = collection(db, HR_COLLECTIONS.CANDIDATES);
    const q = query(candRef, orderBy("appliedDate", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(normalizeCandidate);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Candidates Service] Error fetching candidates:", error.message);
    }
    return [];
  }
}

/**
 * Updates a candidate's pipeline status stage in Firestore.
 *
 * @param {string} candidateId - Candidate ID
 * @param {string} newStatus - New stage (e.g., 'Interview', 'Offered')
 */
export async function updateCandidateStage(candidateId, newStatus) {
  const db = getFirebaseDb();
  const docRef = doc(db, HR_COLLECTIONS.CANDIDATES, candidateId);

  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Appends a new internal note to a candidate profile in Firestore.
 *
 * @param {string} candidateId - Candidate ID
 * @param {string} noteText - Content of the evaluation note
 * @param {string} [author="HR Operations"] - Note author
 * @returns {Promise<Object>} Created note object
 */
export async function addCandidateNote(candidateId, noteText, author = "HR Operations") {
  const db = getFirebaseDb();
  const docRef = doc(db, HR_COLLECTIONS.CANDIDATES, candidateId);

  const today = new Date().toISOString().split("T")[0];
  const newNote = {
    id: `note-${Date.now()}`,
    author,
    date: today,
    text: noteText.trim(),
  };

  await updateDoc(docRef, {
    notes: arrayUnion(newNote),
    updatedAt: serverTimestamp(),
  });

  return newNote;
}

/**
 * Submits a new candidate application to Firestore and increments the applicantCount of the target job.
 *
 * @param {Object} candidateData - Applicant details
 * @returns {Promise<Object>} Created candidate record
 */
export async function createCandidateApplication(candidateData) {
  const db = getFirebaseDb();
  const candidateId = candidateData.id || `cand-${Date.now()}`;
  const candDocRef = doc(db, HR_COLLECTIONS.CANDIDATES, candidateId);
  const today = new Date().toISOString().split("T")[0];

  const payload = {
    ...candidateData,
    id: candidateId,
    status: candidateData.status || "Applied",
    appliedDate: today,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(candDocRef, payload);

  // Atomically increment applicant count on the associated job
  if (candidateData.appliedJobId) {
    try {
      const jobDocRef = doc(db, HR_COLLECTIONS.JOBS, candidateData.appliedJobId);
      await updateDoc(jobDocRef, {
        applicantCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch (jobErr) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Candidates Service] Failed to increment job applicant count:", jobErr.message);
      }
    }
  }

  return {
    ...payload,
    appliedDate: today,
  };
}

