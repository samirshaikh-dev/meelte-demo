/**
 * meelTe — Schema.org JSON-LD Structured Data Generators & Entity Graph
 * Conforms to Google Rich Results standards and AEO/GEO (Answer Engine Optimization).
 * Single Source of Truth: src/config/site.js
 * 
 * Principles: accurate to page content, @id cross-references, JSON-LD only, no fabricated markup.
 */

import {
  APP_NAME,
  SITE_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  SUPPORT_EMAIL,
  HR_EMAIL,
  CONTACT_PHONE,
  PLAY_STORE_URL,
  APP_STORE_URL,
  SAME_AS_LINKS,
} from "../../config/site";
import {
  TARGET_CITIES,
  ALL_COVERED_AREAS,
  PILLARS,
} from "../../constants/app-constants";
import { OG_IMAGE_PATH } from "./metadata";

export const SAME_AS = SAME_AS_LINKS;

/**
 * Brand logo referenced by Organization / publisher nodes.
 * Served from `src/app/icon.png` (512×512), which Next.js exposes at `/icon.png`.
 */
export const BRAND_LOGO_PATH = "/icon.png";

function toAbsUrl(path = "") {
  if (!path) return APP_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function toAbsImage(image = OG_IMAGE_PATH) {
  if (!image) return `${APP_URL}${OG_IMAGE_PATH}`;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${APP_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

/**
 * Long-tail, intent-rich search phrases associated with meelTe.
 * Strengthens GEO (Generative Engine Optimization) entity relationships and AI answer engine citations.
 */
export const LONGTAIL_KEYWORDS = [
  "hyperlocal community platform",
  "community app for local neighborhoods",
  "discover local events in India",
  "neighborhood meetups and gatherings",
  "connect with neighbors in new city",
  "meet like-minded people near me",
  "promote local business neighborhood",
  "local shop marketing platform India",
  "hyperlocal discovery app India",
  "find local food and dining nearby",
  "neighborhood fashion boutiques",
  "local wellness and fitness studios",
  "community-moderated local platform",
  "privacy-first community app",
  "location never sold or shared app",
  "create community events near me",
  "weekend events near me",
  "neighborhood artisan foods and cafes",
  "local commerce without middleman fees",
  "meelTe app download Google Play Store",
];

/**
 * Voice-search and conversational questions (AEO), framed around the problems
 * prospective community members, merchants and event hosts ask.
 */
export const VOICE_QUERIES = [
  "what is meelTe and how does it work",
  "how can I find local events happening near me this weekend",
  "where can I meet like-minded people after moving to a new city in India",
  "how can local merchants promote products and services on meelTe",
  "how does meelTe protect user location and data privacy",
  "how do I organize a community meetup or neighborhood gathering on meelTe",
  "which app helps me discover local artisan food and fashion boutiques nearby",
  "is meelTe free for community members and local organizers",
];

/**
 * Industries and domains meelTe bridges
 */
export const INDUSTRIES_SERVED = [
  "Hyperlocal Commerce",
  "Community Building & Social Networking",
  "Community Event Hosting",
  "SMB Local Marketing & Advertising",
  "Food & Beverage Discovery",
  "Retail & Local Boutiques",
  "Home & Professional Services",
  "Health & Wellness Centers",
];

/**
 * Core Hyperlocal Services offered by meelTe
 */
export const meelTe_SERVICES = [
  {
    id: "local-offers",
    name: "Nearby Shop Offers",
    category: "Discovery",
    description:
      "Browse time-boxed offers from nearby shops and service businesses, each with a price or discount and a fixed run of dates.",
    url: toAbsUrl("/for-merchants"),
  },
  {
    id: "local-events",
    name: "Community Event Hosting",
    category: "Events",
    description:
      "Residents, clubs and organisers publish local events with a joining cost, and approve attendees through join requests that state group size.",
    url: toAbsUrl("/how-it-works#roles"),
  },
  {
    id: "community-connection",
    name: "Neighborhood Community & Chat",
    category: "Community",
    description:
      "Connect with people you meet locally through friends, follows, one-to-one chat, and audio or video calls in a privacy-respecting environment.",
    url: toAbsUrl("/how-it-works#roles"),
  },
];

/**
 * Platform service nodes for the Organisation's OfferCatalog.
 *
 * These were previously emitted as `Offer` nodes with `price: "0"` and
 * `unitText: "Free Community Membership"`, asserting a price the business has not
 * published (project-context.md §13, docs/target_customer.md §4.4). They are now plain
 * `Service` nodes: they describe what meelTe does, and claim nothing about cost.
 */
const PLATFORM_SERVICE_NODES = meelTe_SERVICES.map((service) => ({
  "@type": "Service",
  name: service.name,
  serviceType: service.name,
  category: service.category,
  description: service.description,
  url: service.url,
  provider: {
    "@id": `${APP_URL}#organization`,
  },
  // `TARGET_CITIES` currently holds the country token ("India"), while the site copy and
  // the field-team onboarding narrative name Bengaluru, Gaya and Ranchi. Appending
  // ", India" unconditionally produced the malformed value "India, India", so the
  // qualifier is only added when the token is not already the country. See the note on
  // TARGET_CITIES in src/constants/app-constants.js for the confirmed coverage model.
  areaServed: TARGET_CITIES.map((city) => ({
    "@type": city === "India" ? "Country" : "AdministrativeArea",
    name: city === "India" || city.includes("India") ? city : `${city}, India`,
  })),
}));

/**
 * Returns Root Graph JSON-LD array for layout.jsx / homepage.
 * Emits WebSite, Organization, MobileApplication schemas with @id cross-references.
 */
export function getRootJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${APP_URL}#website`,
      name: SITE_NAME,
      alternateName: APP_NAME,
      url: APP_URL,
      description: APP_DESCRIPTION,
      inLanguage: "en-IN",
      keywords: LONGTAIL_KEYWORDS.join(", "),
      publisher: {
        "@id": `${APP_URL}#organization`,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "p"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${APP_URL}#organization`,
      name: SITE_NAME,
      alternateName: "meelTe Community Platform",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: toAbsImage(BRAND_LOGO_PATH),
        width: 512,
        height: 512,
      },
      image: toAbsImage(OG_IMAGE_PATH),
      email: SUPPORT_EMAIL,
      telephone: CONTACT_PHONE,
      slogan: APP_TAGLINE,
      description: APP_DESCRIPTION,
      sameAs: SAME_AS,
      inLanguage: ["en-IN", "hi", "kn"],
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      knowsAbout: INDUSTRIES_SERVED,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "meelTe Platform Features & Services",
        itemListElement: PLATFORM_SERVICE_NODES,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SUPPORT_EMAIL,
          availableLanguage: ["English", "Hindi", "Kannada"],
          areaServed: "IN",
        },
        {
          "@type": "ContactPoint",
          contactType: "human resources / recruitment",
          email: HR_EMAIL,
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "@id": `${APP_URL}#mobileapp`,
      name: "meelTe: Local Community & Events",
      operatingSystem: "Android, iOS",
      applicationCategory: "CommunityApplication",
      installUrl: PLAY_STORE_URL,
      downloadUrl: PLAY_STORE_URL,
      // Both live listings point at the same app, so neither platform is favoured in
      // the entity graph (`operatingSystem` above still names both).
      sameAs: [PLAY_STORE_URL, APP_STORE_URL],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      description:
        "Download meelTe on Android or iPhone to see time-boxed offers from nearby shops, request to join local events, and chat with people you meet around you.",
      inLanguage: "en-IN",
      isAccessibleForFree: true,
      publisher: {
        "@id": `${APP_URL}#organization`,
      },
    },
  ];
}

/**
 * BreadcrumbList Schema generator.
 * Keeps breadcrumb navigation visually and structurally synchronized.
 * 
 * @param {Array<{ name: string; path: string }>} items - List of breadcrumb items
 */
export function getBreadcrumbsJsonLd(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsUrl(item.path),
    })),
  };
}

/**
 * FAQPage Schema generator for rich answer-engine optimization (AEO/GEO).
 * Only use when FAQs are actually rendered on the page.
 * 
 * @param {Array<{ question: string; answer: string }>} faqs
 */
export function getFaqPageJsonLd(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en-IN",
    mainEntity: faqs
      .filter((faq) => faq?.question && faq?.answer)
      .map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
  };
}

/**
 * Event Schema generator for meelTe's community gatherings (/events/[id]).
 */
export function getEventJsonLd(event) {
  if (!event) return null;

  const url = toAbsUrl(event.slug ? `/events/${event.slug}` : event.id ? `/events/${event.id}` : "/events");

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventAttendanceMode: event.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    inLanguage: "en-IN",
    location: event.isOnline
      ? {
        "@type": "VirtualLocation",
        url: event.url || url,
      }
      : {
        "@type": "Place",
        name: event.locationName || "Local Community Venue",
        address: {
          "@type": "PostalAddress",
          addressLocality: event.city || "India",
          addressCountry: "IN",
          ...(event.address && { streetAddress: event.address }),
        },
      },
    image: toAbsImage(event.image),
    organizer: {
      "@type": "Organization",
      name: event.organizerName || SITE_NAME,
      url: APP_URL,
      "@id": `${APP_URL}#organization`,
    },
    offers: {
      "@type": "Offer",
      price: event.price || "0",
      priceCurrency: event.currency || "INR",
      availability: "https://schema.org/InStock",
      url,
    },
    url,
  };
}

/**
 * Product schema for a public meelTe ad returned by web_get_ad.
 * Only public fields are accepted, and a price is emitted only when the API
 * actually provides final_price. Discount-only ads must not receive an
 * invented price in structured data.
 */
export function getPublicAdJsonLd(ad) {
  if (!ad?.id || !ad?.productName || ad.hasEnded) return null;

  const url = toAbsUrl(`/ads/${encodeURIComponent(ad.id)}`);
  const hasPrice = typeof ad.finalPrice === "number" && Number.isFinite(ad.finalPrice) && ad.finalPrice >= 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ad.productName,
    ...(ad.description && { description: ad.description }),
    ...(ad.photoUrl && { image: [toAbsImage(ad.photoUrl)] }),
    ...(ad.brandName && {
      brand: {
        "@type": "Brand",
        name: ad.brandName,
      },
    }),
    ...(ad.category && { category: ad.category }),
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      ...(hasPrice && { price: ad.finalPrice }),
      ...(ad.startAt && { validFrom: ad.startAt }),
      ...(ad.endAt && { priceValidUntil: ad.endAt }),
      availability: "https://schema.org/InStock",
    },
  };
}

/**
 * Event schema for a public meelTe event returned by web_get_event.
 * The organizer is the public host name only; internal user ids never enter
 * this object.
 */
export function getPublicEventJsonLd(event) {
  if (!event?.id || !event?.title || !event?.startTime || event.hasEnded) return null;

  const url = toAbsUrl(`/events/${encodeURIComponent(event.id)}`);
  const address = {
    "@type": "PostalAddress",
    ...(event.address && { streetAddress: event.address }),
    ...(event.city && { addressLocality: event.city }),
    ...(event.state && { addressRegion: event.state }),
    addressCountry: event.country || "IN",
  };
  const hasCoordinates =
    typeof event.lat === "number" &&
    Number.isFinite(event.lat) &&
    typeof event.lng === "number" &&
    Number.isFinite(event.lng);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.description && { description: event.description }),
    ...(event.coverUrl && { image: [toAbsImage(event.coverUrl)] }),
    startDate: event.startTime,
    ...(event.endTime && { endDate: event.endTime }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      ...(event.locationName && { name: event.locationName }),
      address,
      ...(hasCoordinates && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: event.lat,
          longitude: event.lng,
        },
      }),
    },
    ...(event.creatorName && {
      organizer: {
        "@type": "Person",
        name: event.creatorName,
      },
    }),
    offers: {
      "@type": "Offer",
      url,
      price: typeof event.cost === "number" && event.cost >= 0 ? event.cost : 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    ...(event.cost === 0 && { isAccessibleForFree: true }),
    url,
  };
}

/**
 * LocalBusiness Schema generator for neighborhood merchants and shops.
 */
export function getLocalBusinessJsonLd(business) {
  if (!business) return null;

  const url = business.url ? toAbsUrl(business.url) : toAbsUrl("/merchant");

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    image: toAbsImage(business.image),
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    priceRange: business.priceRange || "₹₹",
    url,
    inLanguage: "en-IN",
    address: {
      "@type": "PostalAddress",
      ...(business.address && { streetAddress: business.address }),
      addressLocality: business.city || "India",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": business.city ? "City" : "Country",
      name: business.city || "India",
    },
  };
}

/**
 * CollectionPage + ItemList Schema for listings (offers, events, people).
 */
export function getCollectionPageJsonLd({ name, description, path, items = [] } = {}) {
  if (!name || !path) return null;
  const validItems = Array.isArray(items) ? items.filter((i) => i?.name && i?.path) : [];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: toAbsUrl(path),
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${APP_URL}#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: validItems.length,
      itemListElement: validItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: toAbsUrl(item.path),
      })),
    },
  };
}

/**
 * Article/BlogPosting schema for blog posts
 */
export function getArticleJsonLd(article = {}) {
  if (!article?.title || !article?.url) return null;

  const url = toAbsUrl(article.url);
  const image = toAbsImage(article.image);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: [image],
    url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    inLanguage: "en-IN",
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: SITE_NAME, "@id": `${APP_URL}#organization` },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      "@id": `${APP_URL}#organization`,
      logo: {
        "@type": "ImageObject",
        url: toAbsImage(BRAND_LOGO_PATH),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isAccessibleForFree: true,
  };
}

/**
 * Person schema for authors/leadership
 */
export function getPersonJsonLd(person = {}) {
  if (!person?.name) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.description && { description: person.description }),
    ...(person.image && { image: toAbsImage(person.image) }),
    worksFor: person.worksFor
      ? person.worksFor
      : { "@type": "Organization", name: SITE_NAME, "@id": `${APP_URL}#organization` },
    sameAs: Array.isArray(person.sameAs) ? person.sameAs.filter(Boolean) : undefined,
    url: person.url ? toAbsUrl(person.url) : undefined,
    inLanguage: "en-IN",
  };
}

/**
 * WebPage schema with optional speakable
 */
export function getWebPageJsonLd({ name, description, path, speakableSelectors = ["h1", "h2", "p"] } = {}) {
  if (!name || !path) return null;
  const url = toAbsUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${APP_URL}#website` },
    about: { "@id": `${APP_URL}#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableSelectors,
    },
  };
}

/**
 * ContactPage Schema for /contact.
 *
 * `description` is passed in from `CONTACT_DESCRIPTION` so the structured data and
 * the meta description are one string. The previous hardcoded value ("community
 * support, merchant onboarding, and local event partnerships") appeared nowhere on
 * the page, which is the drift AI_RULE.md §2.3 exists to prevent.
 *
 * The page is a `ContactPage` about the organisation, so the node carries `@id`,
 * `isPartOf` (the root `WebSite`) and `about` (`Organization`) the same way
 * `/about` does. `mainEntity` keeps the contactable properties — email, telephone,
 * URL — alongside the `@id` reference, because a crawler reading this page alone
 * should still be able to resolve the support address; the full Organization node
 * comes from the root graph in layout.js.
 */
export function getContactPageJsonLd({ description } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${APP_URL}/contact#webpage`,
    name: `Contact ${SITE_NAME}`,
    url: toAbsUrl("/contact"),
    description:
      description ||
      `Contact ${SITE_NAME} for app support, merchant onboarding, event partnerships or feedback.`,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${APP_URL}#website` },
    about: { "@id": `${APP_URL}#organization` },
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      "@id": `${APP_URL}#organization`,
      email: SUPPORT_EMAIL,
      telephone: CONTACT_PHONE,
      url: APP_URL,
    },
  };
}

/**
 * AboutPage Schema for /about.
 *
 * `name` matches the visible `<h1>` ("About meelTe") and `description` is the same
 * string as the page's meta description, so the structured data cannot claim more
 * than the page says. The previous values ("Our Mission & Community Story",
 * "local information overload and urban isolation") appeared nowhere on the page —
 * they came from the internal problem statement in project-context.md §2 — which
 * violates AI_RULE.md §2.3.
 *
 * `AboutPage` with `mainEntity → Organization` is the correct type for a company
 * about page; the Organization node itself comes from the root graph in layout.js,
 * so it is referenced by `@id` rather than repeated.
 */
export function getAboutPageJsonLd({ description } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${APP_URL}/about#webpage`,
    name: `About ${SITE_NAME}`,
    url: toAbsUrl("/about"),
    description:
      description ||
      `${SITE_NAME} is a hyperlocal community app for India: nearby shop offers, local events you can ask to join, and the people you follow.`,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${APP_URL}#website` },
    about: { "@id": `${APP_URL}#organization` },
    mainEntity: {
      "@id": `${APP_URL}#organization`,
    },
  };
}

/**
 * SpeakableSpecification Schema for AI/Voice-search citation.
 */
export function getSpeakableJsonLd(cssSelector = ["h1", "h2", "p"]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector,
    },
  };
}

/**
 * Serialize JSON-LD to a script tag string (useful for non-React injection contexts)
 */
export function getJsonLdScript(jsonLd) {
  if (!jsonLd) return "";
  const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  const filtered = data.filter(Boolean);
  if (filtered.length === 0) return "";
  return `<script type="application/ld+json">${JSON.stringify(filtered.length === 1 ? filtered[0] : filtered).replace(/</g, "\\u003c")}</script>`;
}

/**
 * Generates Schema.org JobPosting structured data for an active opening.
 * Conforms to Google Search Central JobPosting rich result standards.
 */
export function getJobPostingJsonLd(job) {
  if (!job || !job.title) return null;

  const jobUrl = toAbsUrl(`/careers/${job.slug || job.id}`);

  // Map employment type string to schema.org enum
  const empMap = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACTOR",
    internship: "INTERN",
  };
  const normalizedType = (job.employmentType || "full-time").toLowerCase();
  const employmentType = empMap[normalizedType] || "FULL_TIME";

  const node = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.responsibilities || `${job.title} position at meelTe.`,
    identifier: {
      "@type": "PropertyValue",
      name: SITE_NAME,
      value: job.id,
    },
    datePosted: job.createdAt || new Date().toISOString().split("T")[0],
    validThrough: job.deadline || undefined,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: APP_URL,
      logo: toAbsImage(BRAND_LOGO_PATH),
    },
    url: jobUrl,
  };

  // Workplace & Location mapping
  const isRemote = (job.workplaceType || "").toLowerCase() === "remote";
  if (isRemote) {
    node.jobLocationType = "TELECOMMUTE";
    node.applicantLocationRequirements = {
      "@type": "Country",
      name: "India",
    };
  } else {
    node.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    };
  }

  // Base salary if provided
  if (job.salaryMin || job.salaryMax) {
    node.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin || undefined,
        maxValue: job.salaryMax || undefined,
        unitText: (job.salaryPeriod || "").toLowerCase().includes("month") ? "MONTH" : "YEAR",
      },
    };
  }

  return node;
}

/**
 * Merge multiple JSON-LD objects/arrays safely
 */
export function mergeJsonLd(...items) {
  const result = [];
  for (const item of items) {
    if (!item) continue;
    if (Array.isArray(item)) {
      result.push(...item.filter(Boolean));
    } else {
      result.push(item);
    }
  }
  return result;
}

const structuredData = {
  getRootJsonLd,
  getBreadcrumbsJsonLd,
  getFaqPageJsonLd,
  getEventJsonLd,
  getPublicAdJsonLd,
  getPublicEventJsonLd,
  getLocalBusinessJsonLd,
  getCollectionPageJsonLd,
  getArticleJsonLd,
  getPersonJsonLd,
  getWebPageJsonLd,
  getContactPageJsonLd,
  getAboutPageJsonLd,
  getJobPostingJsonLd,
  getSpeakableJsonLd,
  getJsonLdScript,
  mergeJsonLd,
};

export default structuredData;
