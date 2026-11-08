import "server-only";

/**
 * Sanitizes an error object into a serializable structure suitable for structured logging.
 *
 * @param {unknown} err
 * @returns {Record<string, unknown>}
 */
export function sanitizeError(err) {
  if (!err) return { message: "Unknown error" };

  if (err instanceof Error) {
    const errorObject = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };

    // Include custom error attributes if present (e.g. status code, response data)
    if ("code" in err) errorObject.code = err.code;
    if ("status" in err) errorObject.status = err.status;
    if ("statusCode" in err) errorObject.statusCode = err.statusCode;
    if ("cause" in err && err.cause) {
      errorObject.cause =
        err.cause instanceof Error
          ? {
              name: err.cause.name,
              message: err.cause.message,
              stack: err.cause.stack,
            }
          : String(err.cause);
    }

    return errorObject;
  }

  if (typeof err === "object") {
    try {
      return JSON.parse(JSON.stringify(err));
    } catch {
      return { raw: String(err) };
    }
  }

  return { message: String(err) };
}

/**
 * Masks sensitive email addresses (e.g., "u***r@domain.com").
 *
 * @param {string} email
 * @returns {string}
 */
export function maskEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) {
    return "[INVALID_EMAIL]";
  }

  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0] || "*"}***@${domain}`;
  }

  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

/**
 * Truncates oversized string values or payload buffers to prevent bloating logs.
 *
 * @param {unknown} value
 * @param {number} [maxLength=500]
 * @returns {unknown}
 */
export function truncatePayload(value, maxLength = 500) {
  if (typeof value === "string" && value.length > maxLength) {
    return `${value.slice(0, maxLength)}... [TRUNCATED ${value.length - maxLength} chars]`;
  }
  return value;
}

