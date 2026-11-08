import "server-only";
import { headers, cookies } from "next/headers";
import { hrLoginSchema } from "@/validation/hr/auth-validation";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "./rate-limit";
import {
  isSessionSigningConfigured,
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "@/utils/hr/auth-crypto";
import { stripEnvQuotes } from "@/utils/hr/env";
import { HR_REFRESH_COOKIE_NAME } from "@/utils/hr/session-cookie";
import { safeStringCompare, verifyPassword } from "./password";
import {
  issueHrSession,
  setHrSessionCookies,
  clearHrSessionCookies,
} from "./session";

const UNKNOWN_CLIENT_ID = "unknown-client";
const GENERIC_CREDENTIAL_ERROR = "Invalid email or password";
const SIGNING_UNAVAILABLE_ERROR = "Sign-in is temporarily unavailable. Please try again later.";

/**
 * Extracts client IP from request headers.
 *
 * @param {{ get: (name: string) => string|null }} headerSource
 * @returns {string}
 */
function readClientIp(headerSource) {
  const forwardedFor = headerSource.get("x-forwarded-for");
  if (forwardedFor) {
    const firstHop = forwardedFor.split(",")[0].trim();
    if (firstHop) return firstHop;
  }
  return headerSource.get("x-real-ip")?.trim() || UNKNOWN_CLIENT_ID;
}

/**
 * Resolves the client IP identifier for rate limiting.
 *
 * @param {Request|null} request
 * @returns {Promise<string>}
 */
export async function getClientIdentifier(request = null) {
  try {
    if (request?.headers?.get) {
      return readClientIp(request.headers);
    }
    return readClientIp(await headers());
  } catch {
    return UNKNOWN_CLIENT_ID;
  }
}

/**
 * Authenticates HR credentials and issues dual session cookies.
 *
 * @param {{ email?: unknown, password?: unknown, clientIp?: string|null }} input
 * @returns {Promise<{
 *   status: 200|401|429|503,
 *   token?: string,
 *   data: { ok: boolean, error?: string, redirectUrl?: string, accessToken?: string, refreshToken?: string, user?: Object }
 * }>}
 */
export async function loginHr({ email, password, clientIp = null }) {
  const ip = clientIp || (await getClientIdentifier());

  // 1. Rate limiting check
  const rateLimitStatus = checkRateLimit(ip);
  if (rateLimitStatus.isBlocked) {
    const minutes = Math.ceil(rateLimitStatus.remainingSeconds / 60);
    return {
      status: 429,
      data: {
        ok: false,
        error: `Too many failed login attempts. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
      },
    };
  }

  // 2. Boundary validation
  const validation = hrLoginSchema.safeParse({ email, password });
  if (!validation.success) {
    recordFailedAttempt(ip);
    return {
      status: 401,
      data: { ok: false, error: GENERIC_CREDENTIAL_ERROR },
    };
  }

  // 3. Deployment configuration
  const rawExpectedEmail = process.env.HR_EMAIL;
  const rawExpectedPassword = process.env.HR_PASSWORD;

  if (!rawExpectedEmail || !rawExpectedPassword) {
    recordFailedAttempt(ip);
    return {
      status: 401,
      data: { ok: false, error: GENERIC_CREDENTIAL_ERROR },
    };
  }

  const expectedEmail = stripEnvQuotes(rawExpectedEmail).toLowerCase();
  const expectedPassword = stripEnvQuotes(rawExpectedPassword);
  const candidateEmail = validation.data.email.trim().toLowerCase();

  // 4. Constant-time credential verification
  const isEmailMatch = safeStringCompare(candidateEmail, expectedEmail);
  const isPasswordMatch = verifyPassword(validation.data.password, expectedPassword);

  if (!isEmailMatch || !isPasswordMatch) {
    const lockResult = recordFailedAttempt(ip);
    if (lockResult.isLocked) {
      return {
        status: 429,
        data: {
          ok: false,
          error: "Too many failed login attempts. Your IP has been temporarily locked for 15 minutes.",
        },
      };
    }
    return {
      status: 401,
      data: { ok: false, error: GENERIC_CREDENTIAL_ERROR },
    };
  }

  resetRateLimit(ip);

  if (!isSessionSigningConfigured()) {
    return {
      status: 503,
      data: { ok: false, error: SIGNING_UNAVAILABLE_ERROR },
    };
  }

  const session = await issueHrSession(expectedEmail);

  return {
    status: 200,
    token: session.accessToken,
    data: {
      ok: true,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      redirectUrl: "/hr/dashboard",
      user: {
        email: expectedEmail,
        role: "hr_admin",
      },
    },
  };
}

/**
 * Validates the refresh token cookie and rotates both access & refresh tokens.
 *
 * @returns {Promise<{
 *   status: 200|401,
 *   data: { ok: boolean, error?: string, accessToken?: string, refreshToken?: string }
 * }>}
 */
export async function refreshHrSession() {
  const cookieStore = await cookies();
  const rawRefresh = cookieStore.get(HR_REFRESH_COOKIE_NAME)?.value;

  if (!rawRefresh) {
    return {
      status: 401,
      data: { ok: false, error: "No refresh token provided." },
    };
  }

  const payload = await verifyRefreshToken(rawRefresh);

  if (!payload?.email) {
    await clearHrSessionCookies();
    return {
      status: 401,
      data: { ok: false, error: "Invalid or expired refresh token." },
    };
  }

  const newAccessToken = await createAccessToken({
    email: payload.email,
    role: payload.role || "hr_admin",
  });
  const newRefreshToken = await createRefreshToken({
    email: payload.email,
    role: payload.role || "hr_admin",
  });

  await setHrSessionCookies({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  return {
    status: 200,
    data: {
      ok: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
}

