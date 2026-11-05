/**
 * HR portal service barrel — the single import site for HR authentication.
 *
 * Only the surface callers actually consume is re-exported. Internal helpers
 * stay private to their own modules so this file cannot drift into a firehose:
 * `password.js` keeps its verification functions, `session.js` keeps its cookie
 * plumbing, and `@/utils/hr/auth-crypto.js` keeps the token primitives. Code
 * inside the service imports those directly; everything outside it imports here.
 *
 * Layering:
 *   - `password.js`   verifies credentials against the environment (node:crypto).
 *   - `session.js`    issues, reads, and clears the session cookie (next/headers).
 *   - `rate-limit.js` per-process sliding-window limiter, internal to `login.js`.
 *   - `login.js`      orchestrates one sign-in attempt and owns the response envelope.
 *   - `@/utils/hr/auth-crypto.js`    shared HS256 primitives, also used by `src/proxy.js`.
 *   - `@/utils/hr/session-cookie.js` shared cookie contract, also used by `src/proxy.js`.
 *
 * Used by `src/app/api/hr/{login,session,logout}/route.js`.
 */

export { getClientIdentifier, loginHr } from "./login";
export { getHrSession, logoutHr } from "./session";
