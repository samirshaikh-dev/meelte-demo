import "server-only";
import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "@/utils/hr/auth-crypto";
import {
  HR_SESSION_COOKIE_NAME,
  HR_SESSION_COOKIE_PATH,
} from "@/utils/hr/session-cookie";

/**
 * HR session lifecycle: issue, read, clear.
 *
 * Token signing and verification live in `src/utils/hr/auth-crypto.js` because
 * `src/proxy.js` needs the same implementation. This module owns only the
 * Node-side cookie plumbing and the session lifetime policy, so the token `exp`
 * and the cookie `maxAge` are derived from one constant.
 */

/** 8 hours, matching the documented HR portal session length. */
export const HR_SESSION_TTL_SECONDS = 8 * 60 * 60;

/**
 * Builds the cookie attributes for both issuing and clearing the session.
 * `maxAge: 0` expires the cookie immediately.
 *
 * @param {number} maxAge
 */
function buildCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: HR_SESSION_COOKIE_PATH,
    maxAge,
  };
}

/**
 * Writes the session cookie. Returns `false` when called outside a
 * cookie-writable context (for example a Server Component render) instead of
 * throwing, so a caller can still complete its own work.
 *
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function setHrSessionCookie(token) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(HR_SESSION_COOKIE_NAME, token, buildCookieOptions(HR_SESSION_TTL_SECONDS));
    return true;
  } catch {
    return false;
  }
}

/**
 * Expires the session cookie immediately.
 *
 * @returns {Promise<boolean>}
 */
export async function clearHrSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(HR_SESSION_COOKIE_NAME, "", buildCookieOptions(0));
    return true;
  } catch {
    return false;
  }
}

/**
 * Issues a signed session token and writes it to the session cookie.
 *
 * @param {string} email Verified identity to record in the session.
 * @returns {Promise<string>} The signed token.
 */
export async function issueHrSession(email) {
  const token = await createSessionToken(email, HR_SESSION_TTL_SECONDS);
  await setHrSessionCookie(token);
  return token;
}

/**
 * Reads and verifies the current requester's session.
 *
 * @returns {Promise<{ authenticated: false }|{ authenticated: true, email: string }>}
 */
export async function getHrSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(HR_SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return { authenticated: false };
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload?.email) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      email: payload.email,
    };
  } catch {
    return { authenticated: false };
  }
}

/**
 * Invalidates the HR session by expiring the session cookie.
 *
 * @returns {Promise<{ ok: true, redirectUrl: string }>}
 */
export async function logoutHr() {
  await clearHrSessionCookie();
  return {
    ok: true,
    redirectUrl: "/hr/login",
  };
}
