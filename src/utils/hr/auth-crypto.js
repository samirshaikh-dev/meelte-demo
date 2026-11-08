import { SignJWT, jwtVerify } from "jose";

const SESSION_ROLE = "hr_admin";

function getSecretKey(secret) {
  if (!secret) {
    throw new Error("Missing required JWT secret.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT Access Token using JWT_ACCESS_SECRET and JWT_ACCESS_EXPIRES_IN.
 *
 * @param {string|Object} input Email string or payload object
 * @returns {Promise<string>}
 */
export async function createAccessToken(input) {
  const payload = typeof input === "string" ? { email: input, role: SESSION_ROLE } : input;
  const secret = getSecretKey(process.env.JWT_ACCESS_SECRET);
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verifies a JWT Access Token using JWT_ACCESS_SECRET.
 *
 * @param {string} token
 * @returns {Promise<Object|null>}
 */
export async function verifyAccessToken(token) {
  if (!token || typeof token !== "string" || !process.env.JWT_ACCESS_SECRET) return null;

  try {
    const secret = getSecretKey(process.env.JWT_ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates a signed JWT Refresh Token using JWT_REFRESH_SECRET and JWT_REFRESH_EXPIRES_IN.
 *
 * @param {string|Object} input Email string or payload object
 * @returns {Promise<string>}
 */
export async function createRefreshToken(input) {
  const payload = typeof input === "string" ? { email: input, role: SESSION_ROLE } : input;
  const secret = getSecretKey(process.env.JWT_REFRESH_SECRET);
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "1d";

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verifies a JWT Refresh Token using JWT_REFRESH_SECRET.
 *
 * @param {string} token
 * @returns {Promise<Object|null>}
 */
export async function verifyRefreshToken(token) {
  if (!token || typeof token !== "string" || !process.env.JWT_REFRESH_SECRET) return null;

  try {
    const secret = getSecretKey(process.env.JWT_REFRESH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Aliases for proxy.js and existing imports
export const createSessionToken = createAccessToken;
export const verifySessionToken = verifyAccessToken;

export async function isValidSession(token) {
  return (await verifyAccessToken(token)) !== null;
}

export function isSessionSigningConfigured() {
  return Boolean(process.env.JWT_ACCESS_SECRET && process.env.JWT_REFRESH_SECRET);
}
