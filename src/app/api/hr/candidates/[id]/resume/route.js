import { NextResponse } from "next/server";
import { getHrSession } from "@/services/hr/auth";
import { getAdminDb } from "@/services/firebase/admin";
import { HR_COLLECTIONS } from "@/constants/hr-constants";
import { getSignedResumeDownloadUrl } from "@/services/careers/apply-storage";

/**
 * GET /api/hr/candidates/[id]/resume
 *
 * Secure, authenticated resume download endpoint for HR portal admins.
 * Issues a 60-second signed read URL and redirects.
 */
export async function GET(request, context) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const params = await context.params;
    const candidateId = params?.id;

    if (!candidateId) {
      return NextResponse.json(
        { success: false, error: "Candidate ID is required." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const docRef = db.collection(HR_COLLECTIONS.CANDIDATES).doc(candidateId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Candidate not found." },
        { status: 404 }
      );
    }

    const candidate = docSnap.data();

    // 1. Private storage path (new standard)
    if (candidate.resumeStoragePath) {
      const signedUrl = await getSignedResumeDownloadUrl(candidate.resumeStoragePath);
      return NextResponse.redirect(signedUrl, 302);
    }

    // 2. Fallback to legacy resumeUrl if not empty or '#'
    if (candidate.resumeUrl && candidate.resumeUrl !== "#" && candidate.resumeUrl.startsWith("http")) {
      return NextResponse.redirect(candidate.resumeUrl, 302);
    }

    return NextResponse.json(
      { success: false, error: "No resume document available for this candidate." },
      { status: 404 }
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[HR Candidate Resume API Error]:", error);
    }
    return NextResponse.json(
      { success: false, error: "Failed to load candidate resume." },
      { status: 500 }
    );
  }
}

