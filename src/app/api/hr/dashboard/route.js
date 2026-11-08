import { NextResponse } from "next/server";
import { getHrSession } from "@/services/hr/auth";
import { fetchHrJobs } from "@/services/hr/jobs";
import { fetchHrCandidates } from "@/services/hr/candidates";

/**
 * GET /api/hr/dashboard
 *
 * Secure server-side endpoint providing aggregated dashboard metrics,
 * live job requisitions, and candidate applications for the HR portal.
 */
export async function GET() {
  try {
    const session = await getHrSession();

    if (!session?.authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to access dashboard metrics.",
        },
        { status: 401 }
      );
    }

    const [jobs, candidates] = await Promise.all([
      fetchHrJobs(),
      fetchHrCandidates(),
    ]);

    const totalRegisteredCandidates = candidates.length;
    const totalActiveJobs = jobs.filter((j) => j.status === "Active").length;
    const totalExpiredJobs = jobs.filter((j) => j.status === "Expired").length;
    const totalApplications = jobs.reduce(
      (acc, j) => acc + (Number(j.applicantCount) || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        candidates,
        stats: {
          totalRegisteredCandidates,
          totalActiveJobs,
          totalExpiredJobs,
          totalApplications,
        },
      },
    });
  } catch (error) {
    // Log complete error details server-side for diagnostics
    console.error("[HR Dashboard API Error]:", error);

    // Return generic user-friendly message to caller
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve dashboard metrics from database. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}

