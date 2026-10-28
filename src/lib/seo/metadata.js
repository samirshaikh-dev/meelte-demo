/**
 * Meelte — Global SEO Metadata & Viewport Configurations
 * Aligned with Next.js 16 App Router metadata standards, Meelte Brand Directives,
 * and AEO/GEO best practices.
 */

import {
  APP_NAME,
  SITE_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  TWITTER_HANDLE,
  GOOGLE_SITE_VERIFICATION,
  BING_SITE_VERIFICATION,
} from "../../config/site";
import { BRAND_COLORS } from "../../constants/app-constants";

/**
 * Normalize a path to a canonical absolute URL
 * @param {string} path
 */
function toAbsoluteUrl(path = "") {
  if (!path) return APP_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${APP_URL}${normalized}`;
}

/**
 * Normalize an image to an absolute URL
 * @param {string} image
 */
function toAbsoluteImage(image = "/images/og-image.png") {
  if (!image) return `${APP_URL}/images/og-image.png`;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const normalized = image.startsWith("/") ? image : `/${image}`;
  return `${APP_URL}${normalized}`;
}

/**
 * Root site metadata configuration for Next.js App Router (src/app/layout.jsx)
 * @type {import('next').Metadata}
 */
export const metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${SITE_NAME} — Hyper-Local Community, Events & Business Discovery`,
    template: `%s | ${SITE_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "Meelte",
    "hyper-local community platform",
    "local community app",
    "discover local events",
    "local business promotion",
    "local events Bengaluru",
    "local businesses Bengaluru",
    "local community Gaya",
    "local events Ranchi",
    "local jobs board India",
    "local jobs Bengaluru",
    "neighborhood community network",
    "connect with neighbors",
    "privacy-first community app",
    "local food discovery",
    "local fashion boutiques nearby",
    "local services nearby",
    "community health and wellness",
    "neighborhood meetups and gatherings",
    "grow local business online",
    "merchant advertising India",
    "hyperlocal discovery India",
    "community events near me",
    "weekend events near me",
    "find local jobs near me",
  ],
  authors: [{ name: SITE_NAME, url: APP_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Community & Local Commerce",
  applicationName: APP_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  ...((GOOGLE_SITE_VERIFICATION || BING_SITE_VERIFICATION) && {
    verification: {
      ...(GOOGLE_SITE_VERIFICATION && { google: GOOGLE_SITE_VERIFICATION }),
      ...(BING_SITE_VERIFICATION && { other: { "msvalidate.01": BING_SITE_VERIFICATION } }),
    },
  }),
  openGraph: {
    title: `${SITE_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: toAbsoluteImage("/images/og-image.png"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${APP_TAGLINE}`,
      },
    ],
    type: "website",
    locale: "en_IN",
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [toAbsoluteImage("/images/og-image.png")],
    creator: TWITTER_HANDLE || undefined,
    site: TWITTER_HANDLE || undefined,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  // Favicons / app icons are provided via Next.js file-based metadata conventions:
  // src/app/icon.png (browser tab + Android) and src/app/apple-icon.png (Apple touch icon).
  manifest: "/manifest.webmanifest",
};

/**
 * Root site viewport configuration for Next.js App Router
 * @type {import('next').Viewport}
 */
export const viewport = {
  themeColor: BRAND_COLORS.primary, // #6D3BB3 (Meelte Primary Purple)
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/**
 * Reusable helper to build contextual, canonical page-level metadata.
 * 
 * @param {Object} options
 * @param {string} options.title - Page title (will be suffixed with " | Meelte" by Next.js template)
 * @param {string} [options.description] - Page meta description
 * @param {string} [options.path] - Route path (e.g. "/about", "/merchant")
 * @param {string[]} [options.keywords] - Additional contextual keywords
 * @param {string} [options.image] - Custom OpenGraph image URL
 * @param {boolean} [options.noIndex] - Whether to disallow search indexing (e.g., error/admin pages)
 * @param {"website"|"article"} [options.type="website"] - OpenGraph type
 * @param {string[]} [options.authors] - Author names for article pages
 * @param {string} [options.publishedTime] - ISO 8601 publish time for articles
 * @param {string} [options.modifiedTime] - ISO 8601 modified time for articles
 * @param {import('next').Metadata["robots"]} [options.robots] - Override robots directive
 * @returns {import('next').Metadata}
 */
export function buildPageMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "",
  keywords = [],
  image = "/images/og-image.png",
  noIndex = false,
  type = "website",
  authors = [],
  publishedTime,
  modifiedTime,
  robots,
} = {}) {
  const pageUrl = toAbsoluteUrl(path);
  const pageTitle = title || `${SITE_NAME} — ${APP_TAGLINE}`;
  const ogImage = toAbsoluteImage(image);

  // Deduplicate keywords while preserving order
  const mergedKeywords = Array.from(
    new Set([...(keywords || [])].filter(Boolean))
  );

  const baseRobots = noIndex
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true };

  return {
    title,
    description,
    ...(mergedKeywords.length > 0 && { keywords: mergedKeywords }),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      type,
      locale: "en_IN",
      countryName: "India",
      ...(type === "article" && {
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        ...(authors.length > 0 && { authors }),
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
      creator: TWITTER_HANDLE || undefined,
      site: TWITTER_HANDLE || undefined,
    },
    ...(authors.length > 0 && { authors: authors.map((name) => ({ name })) }),
    robots: robots || baseRobots,
  };
}

/**
 * Build metadata for blog/article pages with proper article schema signals
 */
export function buildArticleMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "",
  keywords = [],
  image = "/images/og-image.png",
  authors = [SITE_NAME],
  publishedTime,
  modifiedTime,
  noIndex = false,
} = {}) {
  return buildPageMetadata({
    title,
    description,
    path,
    keywords,
    image,
    noIndex,
    type: "article",
    authors,
    publishedTime,
    modifiedTime,
  });
}

/**
 * Build metadata for collection/listing pages (jobs, events, categories)
 */
export function buildCollectionMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "",
  keywords = [],
  image = "/images/og-image.png",
  noIndex = false,
} = {}) {
  return buildPageMetadata({
    title,
    description,
    path,
    keywords,
    image,
    noIndex,
    type: "website",
  });
}

export default metadata;
