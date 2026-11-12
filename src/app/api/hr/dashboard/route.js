import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getHrSession } from "@/services/hr/auth";
import { fetchHrJobs, fetchHrCandidates, fetchHrBlogPosts } from "@/services/hr/server";

/**
 * GET /api/hr/dashboard
 *
 * Secure server-side endpoint providing aggregated dashboard metrics,
 * live job requisitions, candidate applications and blog posts for the HR
 * portal. Blog posts ride the same aggregate so `HrProvider` needs no second
 * initial fetch; the dashboard stat cards still consume only jobs and
 * candidates.
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

    const [jobs, candidates, blogPosts] = await Promise.all([
      fetchHrJobs(),
      fetchHrCandidates(),
      fetchHrBlogPosts(),
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
        blogPosts,
        stats: {
          totalRegisteredCandidates,
          totalActiveJobs,
          totalExpiredJobs,
          totalApplications,
        },
      },
    });
  } catch (error) {
    // Log structured error details server-side for diagnostics
    logger.error(
      { err: error, operation: "get_hr_dashboard" },
      "Unable to retrieve dashboard metrics from database"
    );

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

