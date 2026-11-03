import "server-only";

import { ExternalFetchError, fetchJson } from "@/utils/fetch-json";
import { getApiConfig } from "./config";
import { MEELTE_WEB_API_ERROR, MeelteWebApiError } from "./errors";

/**
 * Build a PostgREST RPC URL, dropping empty parameters so optional filters do
 * not arrive upstream as empty strings.
 */
export function buildUrl(endpoint, params = {}) {
  const { base } = getApiConfig();
  const url = new URL(`${base}/${endpoint}`);

  Object.entries(params).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(name, String(value));
    }
  });

  return url.toString();
}

/**
 * Call one PostgREST RPC with the anon key, the caller's cache window, and a
 * single error contract.
 *
 * 404/406 from PostgREST mean "this record is gone", not "the API is down", so
 * they map to NOT_FOUND and detail pages can render a clean 404. Everything
 * else collapses to a generic upstream error that never leaks the key or the
 * upstream URL.
 */
export async function request(endpoint, params, { accept, revalidate, tag } = {}) {
  const { key } = getApiConfig();
  let data;

  try {
    data = await fetchJson(buildUrl(endpoint, params), {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      accept,
      next: { revalidate, tags: [tag] },
    });
  } catch (error) {
    if (error instanceof MeelteWebApiError) throw error;
    if (error instanceof ExternalFetchError && [404, 406].includes(error.status)) {
      throw new MeelteWebApiError(MEELTE_WEB_API_ERROR.NOT_FOUND, "Resource not found.", {
        status: error.status,
        cause: error,
      });
    }
    throw new MeelteWebApiError("UPSTREAM_ERROR", "The meelTe Web API request failed.", {
      status: error?.status || 0,
      cause: error,
    });
  }

  return data;
}

/**
 * Unwrap a PostgREST single-object response.
 *
 * The `application/vnd.pgrst.object+json` Accept header returns a bare object,
 * but an array-wrapped response is tolerated so a contract drift upstream
 * degrades to "not found" instead of throwing.
 */
export function firstObject(data) {
  if (Array.isArray(data)) return data[0] || null;
  return data && typeof data === "object" ? data : null;
}
