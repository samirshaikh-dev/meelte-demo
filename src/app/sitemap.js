import { APP_URL } from "../config/site";
import { allLiveAds } from "@/services/supabase-services/ads/get-all-ads";
import { allLiveEvents } from "@/services/supabase-services/events/get-all-events";

// Stable release date for static pages to ensure search engine crawl trust & deterministic SSG
const STABLE_RELEASE_DATE = "2026-08-01T00:00:00.000Z";
const SITEMAP_REVALIDATE_SECONDS = 3600;

/**
 * XML sitemap.
 *
 * Only routes that actually exist are listed. Previous versions advertised
 * /jobs, /merchant, /sitemap and five /category/{slug} pages — none of which are
 * implemented — which sent crawlers to 404s (project-context.md §13 known issues).
 */
export default async function sitemap() {
  const siteUrl = APP_URL || "https://meelTe.com";

  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/for-merchants", changeFrequency: "weekly", priority: 0.9 },
    { path: "/how-it-works", changeFrequency: "monthly", priority: 0.9 },
    { path: "/events", changeFrequency: "hourly", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.85 },
    { path: "/signup", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
    { path: "/support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: STABLE_RELEASE_DATE,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const [ads, events] = await Promise.all([allLiveAds(), allLiveEvents()]);
    const dynamicEntries = [
      ...ads.filter((ad) => !ad.hasEnded).map((ad) => ({
        url: `${siteUrl}/ads/${encodeURIComponent(ad.id)}`,
        lastModified: ad.createdAt || STABLE_RELEASE_DATE,
        changeFrequency: "hourly",
        priority: 0.8,
      })),
      ...events.filter((event) => !event.hasEnded).map((event) => ({
        url: `${siteUrl}/events/${encodeURIComponent(event.id)}`,
        lastModified: event.createdAt || STABLE_RELEASE_DATE,
        changeFrequency: "hourly",
        priority: 0.8,
      })),
    ];

    return [...staticEntries, ...dynamicEntries];
  } catch {
    // A missing key or temporary upstream outage must not make the static
    // sitemap unavailable. Dynamic entries return on the next revalidation.
    return staticEntries;
  }
}
