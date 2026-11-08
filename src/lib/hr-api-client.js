/**
 * Authenticated API client for the HR portal.
 *
 * Automatically handles silent Refresh Token Rotation (RTR):
 *   1. Issues the requested fetch call.
 *   2. If a 401 Unauthorized is returned (e.g. 15-min access token expired),
 *      it calls `/api/hr/auth/refresh` to rotate tokens.
 *   3. If refresh succeeds, it retries the original request seamlessly.
 *   4. If refresh fails, it redirects the browser to `/hr/login`.
 */

let refreshPromise = null;

export async function fetchWithAuth(url, options = {}) {
  const mergedHeaders = {
    "X-Requested-With": "XMLHttpRequest",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  // If request succeeded or failed with a non-auth error, return immediately
  if (response.status !== 401) {
    return response;
  }

  // Prevent multiple concurrent refresh requests
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshRes = await fetch("/api/hr/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const data = await refreshRes.json();
        return data.ok === true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  const refreshed = await refreshPromise;

  if (refreshed) {
    // Retry the original request once with fresh credentials
    return fetch(url, {
      ...options,
      headers: mergedHeaders,
    });
  }

  // Session is completely dead, redirect to login
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/hr/login";
  }

  return response;
}
