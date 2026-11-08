import "server-only";
import crypto from "node:crypto";
import { stripEnvQuotes } from "@/utils/hr/env";

/**
 * Constant-time buffer comparison.
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
 * Constant-time string comparison for the HR email.
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
 * Constant-time password verification for the HR portal.
 *
 * @param {string} candidatePassword
 * @param {string} expectedPassword
 * @returns {boolean}
 */
export function verifyPassword(candidatePassword, expectedPassword) {
  if (!candidatePassword || !expectedPassword) {
    return false;
  }

  const cleanExpected = stripEnvQuotes(expectedPassword);
  if (!cleanExpected) return false;

  try {
    return timingSafeEquals(Buffer.from(candidatePassword), Buffer.from(cleanExpected));
  } catch {
    return false;
  }
}
