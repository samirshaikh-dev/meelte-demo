/**
 * Edge-safe HR session cookie contract.
 *
 * The cookie name and path are shared by two modules that cannot import one
 * another:
 *
 *   - `src/proxy.js` (Next 16 request entry) — reads the cookie from the
 *     incoming request before routing. It must not pull in
 *     `src/services/hr/session.js`, which is server-only and depends on
 *     `next/headers`; `proxy.js` is bundled and shipped separately from the app.
 *   - `src/services/hr/session.js` — writes and clears the cookie.
 *
 * Both sides must agree on exactly one cookie name. When they drifted apart in
 * the past the failure mode was silent: `loginHr` would issue a valid session,
 * the guard would look for a different cookie, and an authenticated admin was
 * bounced straight back to `/hr/login`. Keep this module free of `server-only`,
 * Node built-ins, and `next/headers`.
 */

export const HR_SESSION_COOKIE_NAME = "meelte_hr_session";
export const HR_SESSION_COOKIE_PATH = "/hr";
