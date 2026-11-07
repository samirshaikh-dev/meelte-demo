import "server-only";

/**
 * In-memory sliding-window rate limiter for the public job application endpoint.
 * Protects against bot spam, automated resume flooding, and resource exhaustion.
 *
 * Scope note: This is per-process state. On multi-instance hosting, each instance
 * tracks its own window.
 */

const MAX_APPLICATIONS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window

// Map of IP -> Array of timestamp numbers
const rateLimitMap = new Map();

// Periodic cleanup every 15 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const recent = timestamps.filter((t) => now - t < WINDOW_MS);
      if (recent.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, recent);
      }
    }
  }, 15 * 60 * 1000).unref?.();
}

/**
 * Extracts client IP from standard proxy headers.
 *
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Checks whether the client IP has exceeded the application rate limit.
 *
 * @param {string} ip
 * @returns {{ allowed: boolean, retryAfterSeconds: number }}
 */
export function checkApplyRateLimit(ip) {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_APPLICATIONS_PER_WINDOW) {
    const oldestInWindow = timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

/**
 * Records a successful application attempt from the client IP.
 *
 * @param {string} ip
 */
export function recordApplyAttempt(ip) {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
}

