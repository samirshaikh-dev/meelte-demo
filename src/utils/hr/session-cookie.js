/**
 * Edge-safe HR session & cookie contract for Next.js.
 */

export const HR_ACCESS_COOKIE_NAME = "meelte_hr_access";
export const HR_REFRESH_COOKIE_NAME = "meelte_hr_refresh";
export const HR_SESSION_COOKIE_NAME = HR_ACCESS_COOKIE_NAME;

export const HR_ACCESS_COOKIE_PATH = "/";
export const HR_REFRESH_COOKIE_PATH = "/api/hr/auth";

/**
 * Parses duration strings like '15m', '1h', '1d', '7d' or raw numbers into seconds.
 *
 * @param {string|undefined} val
 * @param {number} defaultSec
 * @returns {number}
 */
export function parseDuration(val, defaultSec) {
  if (!val) return defaultSec;
  const str = String(val).trim().toLowerCase();
  const num = parseInt(str, 10);

  if (str.endsWith("m")) return num * 60;
  if (str.endsWith("h")) return num * 3600;
  if (str.endsWith("d")) return num * 86400;

  return num > 0 ? num : defaultSec;
}

export function getAccessCookieMaxAge() {
  return parseDuration(process.env.JWT_ACCESS_EXPIRES_IN, 15 * 60);
}

export function getRefreshCookieMaxAge() {
  return parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, 24 * 60 * 60);
}

export function buildAccessCookieOptions(maxAge = getAccessCookieMaxAge()) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: HR_ACCESS_COOKIE_PATH,
    maxAge,
  };
}

export function buildRefreshCookieOptions(maxAge = getRefreshCookieMaxAge()) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: HR_REFRESH_COOKIE_PATH,
    maxAge,
  };
}
