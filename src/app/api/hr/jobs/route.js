import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getHrSession } from "@/services/hr/auth";
import { fetchHrJobs, createHrJob } from "@/services/hr/jobs";

/**
 * /api/hr/jobs
 *
 * Job Requisitions API:
 *   - GET:  Lists all job requisitions from Firestore
 *   - POST: Creates a new job requisition in Firestore
 */

export async function GET() {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const jobs = await fetchHrJobs();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    logger.error(
      { err: error, operation: "fetch_hr_jobs" },
      "Failed to retrieve job requisitions"
    );
    return NextResponse.json(
      { success: false, error: "Failed to retrieve job requisitions." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const newJob = await createHrJob(body);
    logger.info(
      { operation: "create_hr_job", jobId: newJob?.id },
      "Job requisition created successfully"
    );
    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    logger.error(
      { err: error, operation: "create_hr_job" },
      "Failed to create job requisition"
    );
    return NextResponse.json(
      { success: false, error: "Failed to create job requisition." },
      { status: 500 }
    );
  }
}

