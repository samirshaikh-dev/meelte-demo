import "server-only";
import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { HR_COLLECTIONS } from "@/constants/hr-constants";
import {
  uploadResumeBuffer,
  generateResumeStoragePath,
  deleteStoredResume,
} from "./storage-service";

/**
 * Generates a deterministic candidate ID based on email and appliedJobId.
 * Enforces atomic uniqueness at the database document level.
 *
 * @param {string} email
 * @param {string} appliedJobId
 * @returns {string}
 */
export function generateCandidateId(email, appliedJobId) {
  const normalized = (email || "").trim().toLowerCase();
  const hash = crypto
    .createHash("sha256")
    .update(`${normalized}|${appliedJobId}`)
    .digest("hex");
  return `cand_${hash.slice(0, 24)}`;
}

/**
 * Finds a job record in Cloud Firestore by slug or document ID.
 *
 * @param {string} slugOrId
 * @returns {Promise<Object | null>}
 */
export async function findActiveJobBySlugOrId(slugOrId) {
  if (!slugOrId) return null;
  const db = getAdminDb();
  const jobsRef = db.collection(HR_COLLECTIONS.JOBS);

  // 1. Try slug match
  try {
    const slugSnap = await jobsRef.where("slug", "==", slugOrId).limit(1).get();
    if (!slugSnap.empty) {
      const docSnap = slugSnap.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Apply Service] Slug query warning:", err.message);
    }
  }

  // 2. Direct ID match
  try {
    const directDoc = await jobsRef.doc(slugOrId).get();
    if (directDoc.exists) {
      return { id: directDoc.id, ...directDoc.data() };
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Apply Service] Direct ID query warning:", err.message);
    }
  }

  // 3. Fallback scan for generated slug
  try {
    const allSnap = await jobsRef.get();
    for (const docSnap of allSnap.docs) {
      const data = docSnap.data();
      const generatedSlug =
        data.slug ||
        (data.title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      if (generatedSlug === slugOrId || docSnap.id === slugOrId) {
        return { id: docSnap.id, ...data };
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Apply Service] Job scan error:", err.message);
    }
  }

  return null;
}

/**
 * Validates if the job is active and has not passed its deadline.
 *
 * @param {Object} job
 * @returns {boolean}
 */
export function isJobOpen(job) {
  if (!job) return false;
  const isStatusActive = (job.status || "").toLowerCase() === "active";
  if (!isStatusActive) return false;

  const today = new Date().toISOString().split("T")[0];
  if (job.deadline && typeof job.deadline === "string" && job.deadline.trim().length > 0) {
    if (job.deadline < today) {
      return false;
    }
  }

  return true;
}

/**
 * Atomically submits a candidate application:
 *   - Verifies deduplication
 *   - Stores resume in private storage
 *   - Creates candidate document in hr_candidates
 *   - Increments applicantCount in hr_jobs
 *   - Automatically rolls back storage file on failure
 *
 * @param {Object} params
 * @param {Object} params.job
 * @param {Object} params.candidateData
 * @param {Buffer} params.resumeBuffer
 * @param {string} params.resumeFileName
 * @param {string} params.resumeMimeType
 * @returns {Promise<{ success: boolean, appliedAt: string, jobTitle: string }>}
 */
export async function submitJobApplication({
  job,
  candidateData,
  resumeBuffer,
  resumeFileName,
  resumeMimeType,
}) {
  const db = getAdminDb();
  const candidateId = generateCandidateId(candidateData.email, job.id);
  const candDocRef = db.collection(HR_COLLECTIONS.CANDIDATES).doc(candidateId);
  const jobDocRef = db.collection(HR_COLLECTIONS.JOBS).doc(job.id);

  // 1. Initial existence check before file upload
  const existingDoc = await candDocRef.get();
  if (existingDoc.exists) {
    const err = new Error("You've already applied for this role.");
    err.code = "ALREADY_APPLIED";
    throw err;
  }

  // 2. Upload resume file
  const storagePath = generateResumeStoragePath(candidateId, resumeFileName);
  await uploadResumeBuffer(storagePath, resumeBuffer, resumeMimeType);

  // 3. Prepare payload & run Firestore Transaction
  const today = new Date().toISOString().split("T")[0];
  const candidatePayload = {
    id: candidateId,
    fullName: candidateData.fullName,
    email: candidateData.email.toLowerCase(),
    phone: candidateData.phone,
    location: candidateData.location,
    appliedJobId: job.id,
    appliedJobTitle: job.title,
    experience: candidateData.experience || "",
    currentCompany: candidateData.currentCompany || "",
    noticePeriod: candidateData.noticePeriod || "",
    expectedSalary: candidateData.expectedSalary || "",
    linkedinUrl: candidateData.linkedinUrl || "",
    portfolioUrl: candidateData.portfolioUrl || "",
    coverNote: candidateData.coverNote || "",
    status: "Applied",
    appliedDate: today,
    appliedAt: FieldValue.serverTimestamp(),
    source: "careers-page",
    resumeStoragePath: storagePath,
    resumeFileName: resumeFileName,
    resumeSizeBytes: resumeBuffer.length,
    resumeMimeType: resumeMimeType,
    consentGiven: true,
    consentGivenAt: FieldValue.serverTimestamp(),
    consentVersion: "2026-11",
    notes: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    await db.runTransaction(async (transaction) => {
      const candSnap = await transaction.get(candDocRef);
      if (candSnap.exists) {
        const err = new Error("You've already applied for this role.");
        err.code = "ALREADY_APPLIED";
        throw err;
      }

      transaction.set(candDocRef, candidatePayload);
      transaction.update(jobDocRef, {
        applicantCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (txErr) {
    // Clean up uploaded file if transaction fails
    await deleteStoredResume(storagePath);
    throw txErr;
  }

  return {
    success: true,
    appliedAt: today,
    jobTitle: job.title,
  };
}

