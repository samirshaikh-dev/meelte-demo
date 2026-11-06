import { NextResponse } from "next/server";
import { getClientIdentifier, loginHr, logoutHr, getHrSession } from "@/services/hr/login";

/**
 * /api/hr/auth
 *
 * Consolidated HR Authentication Endpoint:
 *   - GET:    Verifies current session state
 *   - POST:   Authenticates credentials and issues session cookie
 *   - DELETE: Terminates session and expires cookie
 */

export async function GET() {
  const session = await getHrSession();
  return NextResponse.json(session);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  // Handle logout via POST if invoked with action=logout
  if (body?.action === "logout") {
    const logoutResult = await logoutHr();
    return NextResponse.json(logoutResult);
  }

  const clientIp = await getClientIdentifier(request);
  const result = await loginHr({
    email: body?.email,
    password: body?.password,
    clientIp,
  });

  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE() {
  const result = await logoutHr();
  return NextResponse.json(result);
}

