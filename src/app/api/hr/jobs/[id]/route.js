import { NextResponse } from "next/server";
import { getHrSession } from "@/services/hr/login";
import {
  fetchHrJobById,
  updateHrJob,
  deleteHrJob,
} from "@/services/hr/jobs";

/**
 * /api/hr/jobs/[id]
 *
 * Job Requisition by ID API:
 *   - GET:    Retrieves a single job requisition
 *   - PATCH:  Updates an existing job requisition
 *   - DELETE: Deletes a job requisition
 */

export async function GET(request, { params }) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const job = await fetchHrJobById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job requisition not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("[HR Job API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve job requisition." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const updatedJob = await updateHrJob(id, body);
    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error("[HR Job API PATCH Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job requisition." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await deleteHrJob(id);
    return NextResponse.json({ success: true, message: "Job deleted successfully." });
  } catch (error) {
    console.error("[HR Job API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job requisition." },
      { status: 500 }
    );
  }
}

