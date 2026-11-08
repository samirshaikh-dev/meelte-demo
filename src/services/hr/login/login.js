import "server-only";
import { headers } from "next/headers";
import { hrLoginSchema } from "@/validation/hr/auth-validation";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "./rate-limit";
import { isSessionSigningConfigured } from "@/utils/hr/auth-crypto";
import { stripEnvQuotes } from "@/utils/hr/env";
import { safeStringCompare, verifyPassword } from "./password";
import { issueHrSession } from "./session";

/**
 * HR portal sign-in.
 *
 * Owns the whole decision for one login attempt: rate limit → validate →
 * verify credentials against the environment → issue a session. The API route
 * stays thin and only maps the returned envelope onto a status code.
 *
 * Every rejection returns the same generic message so the endpoint cannot be
 * used to discover whether the email, the password, or the deployment
 * configuration was the thing that did not match.
 */

const UNKNOWN_CLIENT_ID = "unknown-client";
const GENERIC_CREDENTIAL_ERROR = "Invalid email or password";
const SIGNING_UNAVAILABLE_ERROR = "Sign-in is temporarily unavailable. Please try again later.";

/**
 * Extracts the client IP from a header source (`Request#headers` or the result
 * of `next/headers` `headers()`).
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
 * Resolves the identifier the rate limiter keys on.
 *
 * Accepts an optional Web `Request` so a route can pass its own request; falls
 * back to the ambient request headers when called from another server context.
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
 * Attempts an HR sign-in.
 *
 * Returns a discriminated envelope rather than throwing: the caller maps
 * `status` onto the response and serialises `data`. `token` is included for
 * server-side callers and is never part of `data`, so it cannot be leaked into
 * a response by accident.
 *
 * @param {{ email?: unknown, password?: unknown, clientIp?: string|null }} input
 * @returns {Promise<{
 *   status: 200|401|429|503,
 *   token?: string,
 *   data: { ok: boolean, error?: string, redirectUrl?: string }
 * }>}
 */
export async function loginHr({ email, password, clientIp = null }) {
  const ip = clientIp || (await getClientIdentifier());

  // 1. Rate limiting — checked before any credential work so a locked-out
  //    client cannot use this endpoint as an oracle or a CPU sink.
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

  // 2. Input validation at the trust boundary. Everything downstream reads the
  //    validated value, never the raw body.
  const validation = hrLoginSchema.safeParse({ email, password });
  if (!validation.success) {
    recordFailedAttempt(ip);
    return {
      status: 401,
      data: { ok: false, error: GENERIC_CREDENTIAL_ERROR },
    };
  }

  // 3. Deployment configuration.
  const rawExpectedEmail = process.env.HR_EMAIL || "hr@meelte.com";
  const rawExpectedPassword = process.env.HR_PASSWORD || "hr@meelte.com";

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

  // 4. Constant-time credential verification.
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

  // 5. Credentials are correct, so the attempt no longer counts against the
  //    limit even if session issuing fails below.
  resetRateLimit(ip);

  // 6. A correct password is useless without a signing secret. Report it as an
  //    unavailable dependency (503) instead of throwing a 500 with a digest.
  if (!isSessionSigningConfigured()) {
    return {
      status: 503,
      data: { ok: false, error: SIGNING_UNAVAILABLE_ERROR },
    };
  }

  const token = await issueHrSession(expectedEmail);

  return {
    status: 200,
    token,
    data: {
      ok: true,
      redirectUrl: "/hr/dashboard",
    },
  };
}
