import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { fetchPublicActiveJobs } from "@/services/site/careers";

/**
 * GET /api/site/careers/jobs
 *
 * Public unauthenticated endpoint listing active, unexpired job openings.
 * Excludes internal administrative fields.
 */
export async function GET() {
  try {
    const jobs = await fetchPublicActiveJobs();
    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    logger.error(
      { err: error, operation: "fetch_public_active_jobs" },
      "Failed to retrieve public job listings"
    );
    return NextResponse.json(
      { success: false, error: "Failed to retrieve public job listings." },
      { status: 500 }
    );
  }
}

