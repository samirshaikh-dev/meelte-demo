import "server-only";
import { cookies } from "next/headers";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "@/utils/hr/auth-crypto";
import { HR_REFRESH_COOKIE_NAME } from "@/utils/hr/session-cookie";
import { setHrSessionCookies, clearHrSessionCookies } from "./session";

/**
 * Validates the refresh token and rotates both tokens.
 *
 * @returns {Promise<{
 *   status: 200|401,
 *   data: { ok: boolean, error?: string, accessToken?: string }
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

  // Issue rotated access and refresh tokens
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
    },
  };
}
