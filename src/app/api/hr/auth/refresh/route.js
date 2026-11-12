import { NextResponse } from "next/server";
import { getClientIdentifier, refreshHrSession } from "@/services/hr/auth";
import { isSameOriginRequest } from "@/utils/security/origin-guard";

/**
 * /api/hr/auth/refresh
 *
 * Refresh Token Rotation (RTR) Endpoint:
 *   - POST: Validates current refresh token, checks for reuse/breach,
 *           rotates the token in DB, and issues a fresh 15-min access token.
 */
export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "Cross-site request blocked." },
      { status: 403 }
    );
  }

  const clientIp = await getClientIdentifier(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  const result = await refreshHrSession({ clientIp, userAgent });

  return NextResponse.json(result.data, { status: result.status });
}

