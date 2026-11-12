/**
 * Route segment config for the dynamic story-edit route.
 *
 * The story id only exists at request time, and the HR portal layout reads
 * `usePathname()` (runtime URL data) to decide whether to render the portal chrome.
 * Together those values cannot be resolved during prerender, so this segment opts out
 * of the static shell and is rendered per request instead — the same arrangement as
 * `src/app/hr/jobs/[id]/edit/layout.jsx`.
 *
 * This has to live in a Server Component module — `page.jsx` for this route is a
 * Client Component, and route segment config is rejected there. The proxy at
 * `src/proxy.js` remains the authentication gate for the route.
 */
export const instant = false;

export default function EditBlogPostLayout({ children }) {
  return children;
}
