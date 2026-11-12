/**
 * Same-origin guard for cookie-authenticated Route Handlers.
 *
 * Why this exists in one place: the HR endpoints previously compared
 * `new URL(origin).host` against the raw `host` header inside each route file.
 * That comparison is only valid when the edge proxy forwards the browser's
 * `Host` unchanged. Behind Firebase App Hosting (Cloud Run + Envoy) the header
 * the app receives is not guaranteed to be the public domain, so every
 * browser POST — including a genuine same-origin one from `/hr/login` — was
 * rejected with `403 {"error":"Cross-site request blocked."}`.
 *
 * The guard therefore compares against every host the request could legitimately
 * claim to be: the `host` header (the browser cannot set it) and the canonical
 * site origin from `NEXT_PUBLIC_SITE_URL`, with ports stripped on both sides
 * (`meelte.com:443` === `meelte.com`) and the `www.` sibling allowed.
 *
 * `x-forwarded-host` is deliberately NOT trusted: browsers can set it on a
 * cross-origin `fetch`, so accepting it would let any site satisfy its own
 * `Origin` check and defeat the guard.
 *
 * That keeps the CSRF defence intact while making it independent of how the
 * platform rewrites headers. `sameSite: "lax"` on the session cookies remains
 * the primary defence; this is the second layer.
 */

import { APP_URL } from "@/config/site";

/**
 * Lower-cases a host value and removes any port, so `MeelTe.com:443` and
 * `meelte.com` compare equal.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function normalizeHost(value) {
  if (!value) return "";
  return value.trim().toLowerCase().replace(/:\d+$/, "");
}

/**
 * Collects every hostname this request can legitimately be served from.
 *
 * @param {Request} request
 * @returns {Set<string>}
 */
function trustedHosts(request) {
  const hosts = new Set();

  /** Adds `host` plus its `www.`/apex sibling, since both serve the same app. */
  const addHost = (host) => {
    if (!host) return;
    hosts.add(host);
    hosts.add(host.startsWith("www.") ? host.slice(4) : `www.${host}`);
  };

  for (const headerName of ["host"]) {
    const headerValue = request.headers.get(headerName);
    if (!headerValue) continue;

    // Proxies may append to the header, producing a comma-separated pile.
    for (const part of headerValue.split(",")) {
      addHost(normalizeHost(part));
    }
  }

  // Always trust the canonical production domain (and its www sibling)
  addHost("meelte.com");

  if (APP_URL) {
    try {
      addHost(normalizeHost(new URL(APP_URL).host));
    } catch {
      // A malformed NEXT_PUBLIC_SITE_URL must not crash a request; the
      // header-derived hosts above still apply.
    }
  }

  return hosts;
}

/**
 * Returns true when the request may act on cookie-authenticated state.
 *
 * Rejects:
 *   - an opaque `Origin: null` (sandboxed iframe, data: URL, some redirect chains),
 *   - any origin host that is neither the request's own host nor the canonical
 *     site origin,
 *   - a non-http(s) origin, or an unparseable one.
 *
 * Allows a missing `Origin` header: same-origin navigation and non-browser
 * clients (curl, server-to-server) send none, and a browser that omits it on a
 * state-changing request cannot be distinguished from those callers.
 *
 * @param {Request} request
 * @returns {boolean}
 */
export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");

  if (!origin) return true;
  if (origin === "null") return false;

  let originHost;
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    originHost = normalizeHost(parsed.host);
  } catch {
    return false;
  }

  const hosts = trustedHosts(request);
  if (hosts.has(originHost)) return true;

  // Log the denial with the host values only — never cookies, tokens or bodies.
  // This is the signal that distinguishes "someone is probing" from
  // "the platform rewrote a header again".
  console.warn("[security] blocked cross-origin request", {
    path: safePath(request),
    originHost,
    trustedHosts: [...hosts],
  });

  return false;
}

/**
 * @param {Request} request
 * @returns {string}
 */
function safePath(request) {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "unknown";
  }
}
