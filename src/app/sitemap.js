import { APP_URL } from "../config/site";

// Stable release date for static pages to ensure search engine crawl trust & deterministic SSG
const STABLE_RELEASE_DATE = "2026-08-01T00:00:00.000Z";

/**
 * XML sitemap.
 *
 * Only routes that actually exist are listed. Previous versions advertised
 * /jobs, /merchant, /sitemap and five /category/{slug} pages — none of which are
 * implemented — which sent crawlers to 404s (project-context.md §13 known issues).
 */
export default function sitemap() {
  const siteUrl = APP_URL || "https://meelte.com";

  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/discover", changeFrequency: "weekly", priority: 0.95 },
    { path: "/for-merchants", changeFrequency: "weekly", priority: 0.9 },
    { path: "/how-it-works", changeFrequency: "monthly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.85 },
    { path: "/signup", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
    { path: "/support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: STABLE_RELEASE_DATE,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
