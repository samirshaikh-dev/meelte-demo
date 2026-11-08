import { NextResponse } from "next/server";
import { getClientIdentifier, refreshHrSession } from "@/services/hr/login";

/**
 * Validates request Origin against Host to prevent CSRF attacks on cookie-based endpoints.
 *
 * @param {Request} request
 * @returns {boolean}
 */
function isOriginAllowed(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

/**
 * /api/hr/auth/refresh
 *
 * Refresh Token Rotation (RTR) Endpoint:
 *   - POST: Validates current refresh token, checks for reuse/breach,
 *           rotates the token in DB, and issues a fresh 15-min access token.
 */
export async function POST(request) {
  if (!isOriginAllowed(request)) {
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

