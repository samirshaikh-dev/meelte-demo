/**
 * Meelte — Schema.org JSON-LD Structured Data Generators & Entity Graph
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
  SAME_AS_LINKS,
} from "../../config/site";
import {
  TARGET_CITIES,
  ALL_COVERED_AREAS,
  CATEGORIES,
  PILLARS,
} from "../../constants/app-constants";

export const SAME_AS = SAME_AS_LINKS;

function toAbsUrl(path = "") {
  if (!path) return APP_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function toAbsImage(image = "/images/og-image.png") {
  if (!image) return `${APP_URL}/images/og-image.png`;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${APP_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

/**
 * Long-tail, intent-rich search phrases associated with Meelte.
 * Strengthens GEO (Generative Engine Optimization) entity relationships and AI answer engine citations.
 */
export const LONGTAIL_KEYWORDS = [
  "hyper-local community platform",
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
  "trusted home services near me",
  "local wellness and fitness studios",
  "post local jobs in India",
  "find local jobs near me",
  "free job posting for local businesses",
  "community-moderated local platform",
  "privacy-first community app",
  "location never sold or shared app",
  "create community events near me",
  "weekend events near me",
  "neighborhood artisan foods and cafes",
  "local commerce without middleman fees",
  "Meelte app download Google Play Store",
];

/**
 * Voice-search and conversational questions (AEO), framed around the problems
 * prospective community members, merchants, job seekers, and recruiters ask.
 */
export const VOICE_QUERIES = [
  "what is Meelte and how does it work",
  "how can I find local events happening near me this weekend",
  "where can I meet like-minded people after moving to a new city in India",
  "how can local merchants promote products and services on Meelte",
  "how do I post a local job opening on Meelte",
  "where can I find local jobs with direct resume submission",
  "how does Meelte protect user location and data privacy",
  "how do I organize a community meetup or neighborhood gathering on Meelte",
  "which app helps me discover local artisan food and fashion boutiques nearby",
  "is Meelte free for community members and local organizers",
];

/**
 * Industries and domains Meelte bridges
 */
export const INDUSTRIES_SERVED = [
  "Hyper-Local Commerce",
  "Community Building & Social Networking",
  "Event Organization & Ticketing",
  "Local Job Recruitment",
  "SMB Local Marketing & Advertising",
  "Food & Beverage Discovery",
  "Retail & Local Boutiques",
  "Home & Professional Services",
  "Health & Wellness Centers",
];

/**
 * Core Hyper-Local Services offered by Meelte
 */
export const MEELTE_SERVICES = [
  {
    id: "local-discovery",
    name: "Hyper-Local Discovery",
    category: "Discovery",
    description: "Browse nearby dining, fashion boutiques, wellness clinics, trusted services, and events across 5 curated categories.",
    url: toAbsUrl("/#categories"),
  },
  {
    id: "community-connection",
    name: "Neighborhood Community & Networking",
    category: "Community",
    description: "Connect with neighbors sharing language, cultural background, hobbies, and personal goals in a safe, privacy-respecting environment.",
    url: toAbsUrl("/about#community"),
  },
  {
    id: "event-publishing",
    name: "Community Event Creation & Hosting",
    category: "Events",
    description: "Organize, publish, and drive attendance for neighborhood gatherings, weekend workshops, cultural festivals, and sports meetups.",
    url: toAbsUrl("/#create"),
  },
  {
    id: "merchant-growth",
    name: "Grow with Meelte (SMB Local Marketing)",
    category: "Commerce",
    description: "Promote local products and services directly to nearby residents without prohibitive commission fees or advertising overhead.",
    url: toAbsUrl("/merchant"),
  },
  {
    id: "local-jobs-board",
    name: "Local Jobs Board & HR Recruitment",
    category: "Jobs",
    description: "Streamlined local job listings where candidates apply with resume uploads and local employers manage applications.",
    url: toAbsUrl("/jobs"),
  },
];

/**
 * Reusable Offer nodes for Meelte platform services
 */
const PLATFORM_OFFERS = MEELTE_SERVICES.map((service) => ({
  "@type": "Offer",
  price: "0",
  priceCurrency: "INR",
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: "0",
    priceCurrency: "INR",
    unitText: "Free Community Membership",
  },
  url: service.url,
  availability: "https://schema.org/InStock",
  itemOffered: {
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    category: service.category,
    description: service.description,
    url: service.url,
    provider: {
      "@id": `${APP_URL}#organization`,
    },
    areaServed: TARGET_CITIES.map((city) => ({
      "@type": "AdministrativeArea",
      name: `${city}, India`,
    })),
  },
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
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${APP_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
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
      alternateName: "Meelte Community Platform",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: toAbsImage("/images/logo.svg"),
        width: 512,
        height: 512,
      },
      image: toAbsImage("/images/og-image.png"),
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
        name: "Meelte Platform Features & Services",
        itemListElement: PLATFORM_OFFERS,
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
      name: "Meelte: Local Community & Events",
      operatingSystem: "Android, iOS, Web",
      applicationCategory: "CommunityApplication",
      installUrl: PLAY_STORE_URL,
      downloadUrl: PLAY_STORE_URL,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      description:
        "Download Meelte on Android to discover nearby events, connect with local people, support neighborhood merchants, and explore verified local job listings.",
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
 * JobPosting Schema generator for Meelte's local jobs board (/jobs/[id]).
 */
export function getJobPostingJsonLd(job) {
  if (!job) return null;

  const url = toAbsUrl(job.slug ? `/jobs/${job.slug}` : job.id ? `/jobs/${job.id}` : "/jobs");

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted || new Date().toISOString().split("T")[0],
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.hiringOrganization || SITE_NAME,
      ...(job.companyWebsite && { sameAs: toAbsUrl(job.companyWebsite) }),
      url: APP_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city || "Bengaluru",
        ...(job.state && { addressRegion: job.state }),
        addressCountry: "IN",
      },
    },
    ...(job.salaryMin && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.salaryCurrency || "INR",
        value: {
          "@type": "QuantitativeValue",
          minValue: Number(job.salaryMin),
          ...(job.salaryMax && { maxValue: Number(job.salaryMax) }),
          unitText: job.salaryUnit || "MONTH",
        },
      },
    }),
    applicantLocationRequirements: {
      "@type": "Country",
      name: "IN",
    },
    url,
    inLanguage: "en-IN",
    directApply: true,
  };
}

/**
 * Event Schema generator for Meelte's community gatherings (/events/[id]).
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
            addressLocality: event.city || "Bengaluru",
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
      addressLocality: business.city || "Bengaluru",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: business.city || "Bengaluru",
    },
  };
}

/**
 * CollectionPage + ItemList Schema for listings (Jobs, Events, Categories).
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
        url: toAbsImage("/images/logo.svg"),
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
 */
export function getContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${SITE_NAME}`,
    url: toAbsUrl("/contact"),
    description:
      "Get in touch with the Meelte team for community support, merchant onboarding, local event partnerships, and job posting inquiries.",
    inLanguage: "en-IN",
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
 */
export function getAboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME} — Our Mission & Community Story`,
    url: toAbsUrl("/about"),
    description:
      "Learn how Meelte was created to overcome local information overload and urban isolation by connecting neighbors, local events, and neighborhood businesses.",
    inLanguage: "en-IN",
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
  getJobPostingJsonLd,
  getEventJsonLd,
  getLocalBusinessJsonLd,
  getCollectionPageJsonLd,
  getArticleJsonLd,
  getPersonJsonLd,
  getWebPageJsonLd,
  getContactPageJsonLd,
  getAboutPageJsonLd,
  getSpeakableJsonLd,
  getJsonLdScript,
  mergeJsonLd,
};

export default structuredData;
