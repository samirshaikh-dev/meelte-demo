/**
 * Meelte — Application Domain Constants
 * Static catalogs, focus regions, brand color tokens, and product pillars.
 * Guided by docs/target_customer.md and docs/Design.md.
 */

/**
 * Coverage model — confirmed by the business (Oct 2026).
 *
 * Meelte is expanding to the whole of India. Today, three cities are actually being
 * worked by field executives: **Bengaluru**, **Gaya** and **Ranchi**. Those are the only
 * places where in-person shop onboarding happens, so that is what the page copy and
 * `areaServed` naming describe.
 *
 * The constants stay at country level on purpose: `areaServed` should not imply that a
 * resident of, say, Chennai is onboarded in person today. Do not swap these to a city
 * list without also revisiting the "onboarded in person by our field team" copy.
 */
export const TARGET_CITIES = ["India"];

export const ALL_COVERED_AREAS = ["India (Pan-India)"];

/** The three cities where the field team currently onboards shops in person. */
export const OPERATIONAL_HUBS = ["Bengaluru", "Gaya", "Ranchi"];

/**
 * The three areas of the Meelte product that actually exist today.
 *
 * Sourced from docs/target_customer.md §1 ("Core capabilities found in the code"):
 * local offers (ads), local events, and the social layer. Meelte's shop and event
 * records each carry their own category field, but the set of category values is
 * defined in the Flutter app repository and is not audited here — so the website
 * must not publish its own "N kinds of nearby business" taxonomy. Earlier versions
 * of this file did exactly that (Food/Fashion/Events/Services/Health) and the claim
 * had no product evidence.
 *
 * `anchor` must match the section id rendered on /discover so the footer links,
 * the on-page anchors, and the CollectionPage JSON-LD all resolve.
 */
export const PLATFORM_AREAS = [
  {
    id: "offers",
    name: "Local offers",
    anchor: "offers",
    tagline: "Time-boxed offers from nearby shops",
    description:
      "Shops post what is on offer with a price, a discount and the dates it runs. Every offer is time-boxed, so what you see nearby is current — and you can follow a shop to hear about its next one.",
    points: [
      "One product, or a shop catalogue of up to 100 items",
      "A price, a discount and the exact dates it runs",
      "One-tap Google Maps directions to the shop",
    ],
  },
  {
    id: "events",
    name: "Local events",
    anchor: "events",
    tagline: "Gatherings where the host controls the guest list",
    description:
      "Residents, clubs and organisers publish events with a date, a time, a location and a joining cost. You request to join — alone or with friends — and the host decides who comes.",
    points: [
      "Public or private events with a start and end time",
      "Join requests that state your group size, approved by the host",
      "Joining cost set by the host in ₹, paid directly to them",
    ],
  },
  {
    id: "people",
    name: "People & chat",
    anchor: "people",
    tagline: "Talk to the people and shops you meet locally",
    description:
      "Add friends, follow the shops and hosts you like, and talk one to one. Chat carries text, emoji, documents and location, and voice and video calls are built in. Finding new people is still rolling out.",
    points: [
      "Friends, follows and shop updates in one place",
      "1:1 chat with text, emoji, documents and location sharing",
      "Voice and video calls, plus block and report",
    ],
  },
];

/** Official brand design tokens */
export const BRAND_COLORS = {
  primary: "#6D3BB3",        // Mid Purple
  primaryDark: "#5B2E91",    // Royal Deep Purple
  primaryLight: "#7A45C4",   // Light Accent Purple
  accent: "#F59E0B",          // Amber / Gold
  accentHover: "#F4B740",
  canvas: "#F8F5FF",          // Ultra-light violet-tinted background
  card: "#FFFFFF",            // Pure White Card
  textPrimary: "#1F1F28",     // High contrast heading
  textSecondary: "#6B7280",   // Subtle meta text
  borderSubtle: "#ECECEC",
};

/** Product core pillars */
export const PILLARS = [
  {
    id: "discover",
    title: "Discover",
    description: "Explore local products, nearby dining, local services, and neighborhood happenings without the noise.",
  },
  {
    id: "connect",
    title: "Connect",
    description: "Find and meet people who share your language, culture, interests, and hobbies in your neighborhood.",
  },
  {
    id: "create",
    title: "Create",
    description: "Organize, publish, and host community events, interest clubs, and neighborhood gatherings.",
  },
  {
    id: "grow",
    title: "Grow",
    description: "Promote your local business, showcase products, and connect directly with nearby customers.",
  },
];

const appConstants = {
  TARGET_CITIES,
  ALL_COVERED_AREAS,
  OPERATIONAL_HUBS,
  PLATFORM_AREAS,
  BRAND_COLORS,
  PILLARS,
};

export default appConstants;
