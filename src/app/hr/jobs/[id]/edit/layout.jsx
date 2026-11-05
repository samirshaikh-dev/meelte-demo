/**
 * Route segment config for the dynamic job-edit route.
 *
 * The job id only exists at request time, and the HR portal layout reads
 * `usePathname()` (runtime URL data) to decide whether to render the portal chrome.
 * Together those values cannot be resolved during prerender, so this segment opts out
 * of the static shell and is rendered per request instead.
 *
 * This has to live in a Server Component module — `page.jsx` for this route is a
 * Client Component, and route segment config is rejected there. The proxy at
 * `src/proxy.js` remains the authentication gate for the route.
 */
export const instant = false;

export default function EditJobLayout({ children }) {
  return children;
}
