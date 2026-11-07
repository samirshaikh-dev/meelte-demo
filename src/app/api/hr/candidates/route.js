import { NextResponse } from "next/server";
import { getHrSession } from "@/services/hr/login";
import { fetchHrCandidates, createCandidateApplication } from "@/services/hr/candidates";
import { candidateApplicationSchema } from "@/validation/hr/candidate-validation";

/**
 * /api/hr/candidates
 *
 * Candidate Applications API:
 *   - GET:  Lists candidate applications from Firestore (authenticated)
 *   - POST: Submits or registers a new candidate profile from HR portal (authenticated)
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

    const candidates = await fetchHrCandidates();
    return NextResponse.json({ success: true, data: candidates });
  } catch (error) {
    console.error("[HR Candidates API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve candidate profiles." },
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

    const validation = candidateApplicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          fieldErrors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newCandidate = await createCandidateApplication(validation.data);
    return NextResponse.json(
      { success: true, data: newCandidate },
      { status: 201 }
    );
  } catch (error) {
    console.error("[HR Candidate Create API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record candidate application." },
      { status: 500 }
    );
  }
}
