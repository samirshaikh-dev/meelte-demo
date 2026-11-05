import { NextResponse } from "next/server";
import { isValidSession } from "@/utils/hr/auth-crypto";
import { HR_SESSION_COOKIE_NAME } from "@/utils/hr/session-cookie";

/**
 * Next.js 16 request entry point (`proxy.js` — renamed from `middleware.js` in
 * Next 16, where it defaults to the Node.js runtime).
 *
 * Next.js only runs pre-request logic from this convention file, resolved to
 * `src/proxy.js` or `<root>/proxy.js`, sitting beside `app/`. Deleting it does
 * not "move" the guard anywhere — it disables it, and every `/hr/*` page
 * becomes reachable without a session. That is why the exported function lives
 * here and not behind another wrapper: this is the one place Next looks.
 *
 * The `/hr` pages are statically prerendered, so this guard is the only thing
 * standing between the public internet and the HR portal.
 *
 * Exports exactly one function, named `proxy`, per the file convention.
 * `export const runtime` is rejected by Next in this file.
 */

const HR_LOGIN_PATH = "/hr/login";
const HR_DASHBOARD_PATH = "/hr/dashboard";

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function isLoginPath(pathname) {
  return pathname === "/hr/login" || pathname === "/hr/login/";
}

/**
 * Guards `/hr` and `/hr/*`: unauthenticated visitors are sent to the sign-in
 * page, and an authenticated visitor who lands on the sign-in page is sent on
 * to the dashboard.
 *
 * @param {import("next/server").NextRequest} request
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // The matcher already scopes this, but keep the check so editing the matcher
  // below can never expose the guard to unrelated routes.
  if (!pathname.startsWith("/hr")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(HR_SESSION_COOKIE_NAME)?.value;
  const authenticated = await isValidSession(sessionCookie);
  const isLoginPage = isLoginPath(pathname);

  if (authenticated && isLoginPage) {
    return NextResponse.redirect(new URL(HR_DASHBOARD_PATH, request.url));
  }

  if (!authenticated && !isLoginPage) {
    return NextResponse.redirect(new URL(HR_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hr", "/hr/:path*"],
};
