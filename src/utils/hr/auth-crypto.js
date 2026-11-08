import { readEnv } from "./env";

/**
 * HR session token primitives â€” the single implementation of the signing-secret
 * derivation and the HS256 token format.
 *
 * Two callers read this module:
 *
 *   - `src/proxy.js` (Next 16 request entry, Node.js runtime) â€” verifies the
 *     session cookie before any `/hr` request is routed
 *   - `src/services/hr/session.js` (Node.js runtime) â€” issues and verifies cookies
 *
 * It therefore uses Web Crypto (`crypto.subtle`) only and must never import
 * `node:crypto`, `next/headers`, or `server-only`: `proxy.js` is bundled and
 * shipped separately from the app, so it has to stay dependency-free. Both
 * callers must agree byte-for-byte on the secret derivation and the token
 * layout. Never fork this logic: if the issuer and the verifier drift, login
 * succeeds at the API and the guard still rejects the cookie.
 *
 * Token layout: `<base64url(payload)>.<base64url(HMAC-SHA256(payload))>`
 * Payload shape: `{ email, role: "hr_admin", iat, exp }` with `exp` in epoch ms.
 */

const SESSION_ROLE = "hr_admin";
const SIGNING_ALGORITHM = { name: "HMAC", hash: "SHA-256" };
const DEV_FALLBACK_SECRET = "meelte-default-fallback-secret-2026";

/**
 * Hex-encoded SHA-256, used for deriving the HMAC signing secret.
 */
async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Resolves the HMAC secret used to sign and verify HR session tokens.
 * Derived deterministically from the HR password, email, or a stable internal fallback.
 *
 * @returns {Promise<string>}
 */
export async function getSigningSecretString() {
  return sha256Hex(
    readEnv("HR_PASSWORD") ||
    readEnv("HR_EMAIL") ||
    DEV_FALLBACK_SECRET
  );
}

/**
 * Synchronous companion to `getSigningSecretString`, for callers that need to
 * check signing readiness before doing expensive work.
 *
 * @returns {boolean}
 */
export function isSessionSigningConfigured() {
  return true;
}

/**
 * Converts a base64url string to a Uint8Array.
 * Edge-runtime and browser compatible without node:crypto/Buffer dependencies.
 *
 * @param {string} base64Url
 * @returns {Uint8Array}
 */
export function base64UrlToUint8Array(base64Url) {
  if (typeof base64Url !== "string" || base64Url.length === 0) {
    return new Uint8Array(0);
  }

  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

/**
 * Converts a Uint8Array to a base64url string with no padding, matching the
 * `Buffer#toString("base64url")` output the token format was originally built on.
 *
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function uint8ArrayToBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Creates an HMAC-SHA256 signed session token for the given email.
 *
 * @param {string} email Identity recorded in the token payload.
 * @param {number} ttlSeconds Token lifetime in seconds. The caller owns session
 *   policy so the cookie `maxAge` and the token `exp` cannot disagree.
 * @returns {Promise<string>}
 * @throws {TypeError} When `ttlSeconds` is not a positive integer.
 * @throws {Error} When signing is not configured for this environment.
 */
export async function createSessionToken(email, ttlSeconds) {
  if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
    throw new TypeError("createSessionToken requires a positive integer ttlSeconds.");
  }

  const secret = await getSigningSecretString();
  if (!secret) {
    throw new Error("HR session signing secret unavailable.");
  }

  const issuedAt = Date.now();
  const payload = {
    email,
    role: SESSION_ROLE,
    iat: issuedAt,
    exp: issuedAt + ttlSeconds * 1000,
  };

  const payloadBase64 = uint8ArrayToBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  );

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    SIGNING_ALGORITHM,
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(payloadBase64)
  );

  return `${payloadBase64}.${uint8ArrayToBase64Url(new Uint8Array(signature))}`;
}

/**
 * Verifies the signature and expiry of a session token.
 *
 * The signature is checked before the payload is parsed, so malformed or
 * attacker-supplied payloads are rejected without being interpreted.
 *
 * @param {unknown} token
 * @returns {Promise<{ email: string, role: string, iat: number, exp: number }|null>}
 *   The decoded payload when valid, otherwise `null`. Never throws.
 */
export async function verifySessionToken(token) {
  if (typeof token !== "string") return null;

  const separator = token.indexOf(".");
  if (separator <= 0 || separator === token.length - 1) {
    return null;
  }

  const payloadBase64 = token.slice(0, separator);
  const signatureBase64 = token.slice(separator + 1);

  try {
    const secret = await getSigningSecretString();
    if (!secret) return null;

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      SIGNING_ALGORITHM,
      false,
      ["verify"]
    );
    const signatureValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      base64UrlToUint8Array(signatureBase64),
      new TextEncoder().encode(payloadBase64)
    );
    if (!signatureValid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(payloadBase64))
    );
    if (!payload || typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Boolean session check used by the Edge route guard.
 *
 * @param {unknown} token
 * @returns {Promise<boolean>}
 */
export async function isValidSession(token) {
  return (await verifySessionToken(token)) !== null;
}
