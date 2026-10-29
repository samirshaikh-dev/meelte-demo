import { APP_URL } from "../config/site";
import { CATEGORIES } from "../constants/app-constants";

// Stable release date for static pages to ensure search engine crawl trust & deterministic SSG
const STABLE_RELEASE_DATE = "2026-08-01T00:00:00.000Z";

export default function sitemap() {
  const siteUrl = APP_URL || "https://meelte.com";

  const staticPages = [
    {
      url: siteUrl,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/discover`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/merchant`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/careers`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/sitemap`,
      lastModified: STABLE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categoryPages = (CATEGORIES || []).map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    lastModified: STABLE_RELEASE_DATE,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
