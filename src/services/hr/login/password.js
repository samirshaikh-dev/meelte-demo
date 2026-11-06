import "server-only";
import crypto from "node:crypto";
import { stripEnvQuotes } from "@/utils/hr/env";

/**
 * Credential verification for the internal HR portal.
 *
 * Verification only — hashing is an operational task, not a runtime one, so the
 * digest is produced by `scripts/generate-hr-hash.mjs` and stored in
 * `HR_PASSWORD_HASH`. Keeping the write side out of the app means there is no
 * unused "hash a password at runtime" code path to drift from the generator.
 *
 * Stored format (also produced by the script):
 *   pbkdf2$<iterations>$<salt_hex>$<hash_hex>
 * A legacy `<salt_hex>:<hash_hex>` form is still accepted for older env files.
 */

const KEY_LEN = 64;
const DIGEST = "sha512";
const DEFAULT_ITERATIONS = 100000;
const MIN_ITERATIONS = 10000;
const MAX_ITERATIONS = 10000000;

/**
 * Constant-time buffer comparison. Rejects on length mismatch (length is not a
 * secret — both sides are already known to the server).
 *
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {boolean}
 */
function timingSafeEquals(a, b) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Constant-time string comparison for short, non-hashed values (the HR email).
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function safeStringCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  return timingSafeEquals(Buffer.from(a), Buffer.from(b));
}

/**
 * Securely verifies a candidate password against the `HR_PASSWORD_HASH` value.
 * Resists timing attacks with `crypto.timingSafeEqual` and fails closed on any
 * unparseable or out-of-range hash string.
 *
 * @param {string} candidatePassword
 * @param {string} storedHashString
 * @returns {boolean}
 */
export function verifyPassword(candidatePassword, storedHashString) {
  if (!candidatePassword || !storedHashString) {
    return false;
  }

  const cleanHash = stripEnvQuotes(storedHashString);
  if (!cleanHash) return false;

  try {
    // Format 1: pbkdf2$<iterations>$<salt>$<hash>
    if (cleanHash.startsWith("pbkdf2$")) {
      const parts = cleanHash.split("$");
      if (parts.length !== 4) return false;

      const iterations = Number.parseInt(parts[1], 10);
      const salt = parts[2];
      const expectedHashHex = parts[3];

      if (!Number.isInteger(iterations) || !salt || !expectedHashHex) return false;
      if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) return false;

      const derived = crypto.pbkdf2Sync(candidatePassword, salt, iterations, KEY_LEN, DIGEST);
      return timingSafeEquals(derived, Buffer.from(expectedHashHex, "hex"));
    }

    // Format 2: <salt>:<hash> (legacy PBKDF2 sha512)
    if (cleanHash.includes(":")) {
      const parts = cleanHash.split(":");
      if (parts.length !== 2) return false;

      const [salt, expectedHashHex] = parts;
      if (!salt || !expectedHashHex) return false;

      const derived = crypto.pbkdf2Sync(
        candidatePassword,
        salt,
        DEFAULT_ITERATIONS,
        KEY_LEN,
        DIGEST
      );
      return timingSafeEquals(derived, Buffer.from(expectedHashHex, "hex"));
    }

    // Format 3: plaintext credential, development only.
    // Allowed so a local .env can hold a throwaway password, refused in
    // production so a misconfigured deployment cannot silently store the HR
    // password in plaintext and compare it here.
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    return timingSafeEquals(Buffer.from(candidatePassword), Buffer.from(cleanHash));
  } catch {
    // Fail closed on any crypto or parsing anomaly.
    return false;
  }
}
