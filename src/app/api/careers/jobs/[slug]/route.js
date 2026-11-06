import { NextResponse } from "next/server";
import { fetchPublicJobBySlugOrId } from "@/services/careers/public-jobs-service";

/**
 * GET /api/careers/jobs/[slug]
 *
 * Public unauthenticated endpoint retrieving a single active job opening by slug or ID.
 * Returns 404 if the job does not exist, is not Active, or has passed its deadline.
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const job = await fetchPublicJobBySlugOrId(slug);

    if (!job) {
      return NextResponse.json(
        { success: false, error: "This job opening is no longer open." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("[Careers Job Detail API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve job details." },
      { status: 500 }
    );
  }
}

