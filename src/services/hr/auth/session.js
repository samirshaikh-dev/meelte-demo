import "server-only";
import { cookies } from "next/headers";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} from "@/utils/hr/auth-crypto";
import {
  HR_ACCESS_COOKIE_NAME,
  HR_REFRESH_COOKIE_NAME,
  buildAccessCookieOptions,
  buildRefreshCookieOptions,
} from "@/utils/hr/session-cookie";

/**
 * Sets dual HttpOnly session cookies in the browser.
 *
 * @param {{ accessToken: string, refreshToken?: string }} tokens
 */
export async function setHrSessionCookies({ accessToken, refreshToken }) {
  try {
    const cookieStore = await cookies();

    if (accessToken) {
      cookieStore.set(HR_ACCESS_COOKIE_NAME, accessToken, buildAccessCookieOptions());
    }

    if (refreshToken) {
      cookieStore.set(HR_REFRESH_COOKIE_NAME, refreshToken, buildRefreshCookieOptions());
    }

    return true;
  } catch (error) {
    console.error("[Auth Session] Failed to set session cookies:", error.message);
    return false;
  }
}

/**
 * Clears both session cookies.
 */
export async function clearHrSessionCookies() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(HR_ACCESS_COOKIE_NAME, "", buildAccessCookieOptions(0));
    cookieStore.set(HR_REFRESH_COOKIE_NAME, "", buildRefreshCookieOptions(0));
    return true;
  } catch (error) {
    console.error("[Auth Session] Failed to clear session cookies:", error.message);
    return false;
  }
}

/**
 * Issues new session cookies for the HR user.
 *
 * @param {string} email
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export async function issueHrSession(email) {
  const accessToken = await createAccessToken({ email, role: "hr_admin" });
  const refreshToken = await createRefreshToken({ email, role: "hr_admin" });

  await setHrSessionCookies({ accessToken, refreshToken });
  return { accessToken, refreshToken };
}

/**
 * Verifies current active access token session.
 *
 * @returns {Promise<{ authenticated: boolean, email?: string }>}
 */
export async function getHrSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(HR_ACCESS_COOKIE_NAME)?.value;

    if (!token) {
      return { authenticated: false };
    }

    const payload = await verifyAccessToken(token);
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
 * Logs out the user by clearing cookies.
 *
 * @returns {Promise<{ ok: true, redirectUrl: string }>}
 */
export async function logoutHr() {
  await clearHrSessionCookies();
  return {
    ok: true,
    redirectUrl: "/hr/login",
  };
}

