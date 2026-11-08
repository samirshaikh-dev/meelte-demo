import { REGEX } from "@/constants/service-constants";

/**
 * Environment-value normalisation for the HR module.
 *
 * The same two operations — strip a wrapping pair of quotes, then trim — were
 * written out: in `auth-crypto.js`, in `login.js` (`HR_EMAIL` / `HR_PASSWORD`),
 * and inline in `password.js`. Three copies of one rule is how `HR_EMAIL="admin@meelte.com"` works in
 * one place and fails in another, so it lives here once.
 *
 * Kept free of `node:*`, `next/headers`, and `server-only`: `src/proxy.js`
 * bundles `auth-crypto.js`, which imports this module.
 */

/**
 * Removes the surrounding quotes an .env file may carry over and trims the
 * result. Non-string input yields an empty string, so callers never have to
 * null-check before parsing.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function stripEnvQuotes(value) {
  if (typeof value !== "string") return "";
  return value.replace(REGEX.SURROUNDING_QUOTES, "").trim();
}

/**
 * Reads an environment variable by name and normalises it the same way an
 * inline value would be normalised. Missing or empty variables return `""`.
 *
 * @param {string} name
 * @returns {string}
 */
export function readEnv(name) {
  return stripEnvQuotes(process.env[name]);
}
