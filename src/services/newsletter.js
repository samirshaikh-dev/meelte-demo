// Newsletter subscription client for the dedicated external Meelte backend.
// Architecture rule (AI_RULE.md §2.1): no local `app/api/**` routes. This site talks to the
// external backend only, so every request is issued from the browser against API_BASE_URL.

import { API_BASE_URL, API_ENDPOINTS } from "./api_constants";

/** Resolved once at module load so callers can branch on configuration cheaply. */
export const NEWSLETTER_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}${API_ENDPOINTS.NEWSLETTER}`
  : null;

/** Error codes let the UI show honest copy instead of a generic "something went wrong". */
export const NEWSLETTER_ERROR = {
  NOT_CONFIGURED: "NOT_CONFIGURED",
  ALREADY_SUBSCRIBED: "ALREADY_SUBSCRIBED",
  FAILED: "FAILED",
};

function createNewsletterError(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

/**
 * Subscribe an email address to neighborhood updates.
 *
 * @param {string} email
 * @returns {Promise<object>} Parsed backend response body (may be empty).
 * @throws {Error & { code: string }} when the endpoint is missing or the backend rejects.
 */
export async function submitNewsletterSubscription(email) {
  if (!NEWSLETTER_ENDPOINT) {
    throw createNewsletterError(
      NEWSLETTER_ERROR.NOT_CONFIGURED,
      "NEXT_PUBLIC_MEELTE_API_BASE_URL is not configured."
    );
  }

  let response;

  try {
    response = await fetch(NEWSLETTER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    throw createNewsletterError(
      NEWSLETTER_ERROR.FAILED,
      "Network request failed."
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw createNewsletterError(
      response.status === 409
        ? NEWSLETTER_ERROR.ALREADY_SUBSCRIBED
        : NEWSLETTER_ERROR.FAILED,
      body?.message
    );
  }

  return response.json().catch(() => ({}));
}
