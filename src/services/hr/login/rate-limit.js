import "server-only";

/**
 * In-memory sliding-window rate limiter for HR authentication.
 * Prevents credential brute-forcing, password stuffing, and resource exhaustion.
 *
 * Lives in the HR service layer, not in a middleware folder: it holds no
 * request/response concern and is called directly by `loginHr`. It is the only
 * caller, so it is intentionally not re-exported from the service barrel.
 *
 * Scope note: this is per-process state. On multi-instance hosting each instance
 * tracks its own window, so the effective limit scales with instance count. A
 * shared store (Redis or similar) is needed before this can be treated as a
 * global control.
 */

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout window

// Map of identifier (IP / client key) -> { count: number, firstAttempt: number, lockedUntil: number }
const attemptsMap = new Map();

// Periodic cleanup of stale records every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of attemptsMap.entries()) {
      if (now > record.firstAttempt + WINDOW_MS && now > (record.lockedUntil || 0)) {
        attemptsMap.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

/**
 * Checks if the identifier is currently rate-limited.
 * @param {string} identifier - Client IP or compound identifier
 * @returns {{ isBlocked: boolean, remainingSeconds: number }}
 */
export function checkRateLimit(identifier) {
  const now = Date.now();
  const record = attemptsMap.get(identifier);

  if (!record) {
    return { isBlocked: false, remainingSeconds: 0 };
  }

  // Check if locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isBlocked: true, remainingSeconds };
  }

  // If window expired, reset
  if (now > record.firstAttempt + WINDOW_MS) {
    attemptsMap.delete(identifier);
    return { isBlocked: false, remainingSeconds: 0 };
  }

  return { isBlocked: false, remainingSeconds: 0 };
}

/**
 * Records a failed login attempt. Locks out if threshold exceeded.
 * @param {string} identifier
 * @returns {{ isLocked: boolean, remainingSeconds: number }}
 */
export function recordFailedAttempt(identifier) {
  const now = Date.now();
  let record = attemptsMap.get(identifier);

  if (!record || now > record.firstAttempt + WINDOW_MS) {
    record = { count: 1, firstAttempt: now, lockedUntil: 0 };
  } else {
    record.count += 1;
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + WINDOW_MS;
    attemptsMap.set(identifier, record);
    return { isLocked: true, remainingSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  attemptsMap.set(identifier, record);
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Resets rate limit records on successful authentication.
 * @param {string} identifier
 */
export function resetRateLimit(identifier) {
  attemptsMap.delete(identifier);
}
