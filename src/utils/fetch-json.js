import "server-only";

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRIES = 2;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

export class ExternalFetchError extends Error {
  constructor(message, { status = 0, body = null, url = "" } = {}) {
    super(message);
    this.name = "ExternalFetchError";
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

function getRetryDelay(response, attempt) {
  const retryAfter = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter >= 0) {
    return Math.min(retryAfter * 1000, 2000);
  }

  return Math.min(250 * 2 ** attempt, 2000);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * GET a JSON resource with a bounded timeout and retry policy for temporary
 * upstream failures. The caller supplies Next's fetch cache options so each
 * data source can choose its own revalidation window and cache tags.
 */
export async function fetchJson(
  url,
  {
    headers = {},
    next,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    accept,
  } = {}
) {
  const requestHeaders = {
    Accept: accept || "application/json",
    ...headers,
  };

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: requestHeaders,
        redirect: "error",
        signal: controller.signal,
        ...(next ? { next } : {}),
      });

      if (response.ok) {
        try {
          return await response.json();
        } catch {
          throw new ExternalFetchError("The upstream response was not valid JSON.", {
            status: response.status,
            url,
          });
        }
      }

      if (RETRYABLE_STATUSES.has(response.status) && attempt < retries) {
        await wait(getRetryDelay(response, attempt));
        continue;
      }

      let body = null;
      try {
        body = await response.json();
      } catch {
        // Keep the public error generic when the upstream body is not JSON.
      }

      throw new ExternalFetchError(`Upstream request failed with HTTP ${response.status}.`, {
        status: response.status,
        body,
        url,
      });
    } catch (error) {
      if (error instanceof ExternalFetchError) throw error;

      if (attempt < retries) {
        await wait(Math.min(250 * 2 ** attempt, 2000));
        continue;
      }

      throw new ExternalFetchError("The upstream request could not be completed.", { url });
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new ExternalFetchError("The upstream request could not be completed.", { url });
}
