/**
 * Meelte — Application Domain Constants
 * Static catalogs, focus regions, brand color tokens, and product pillars.
 * Guided by docs/target_customer.md and docs/color-theme.md.
 */

/** Focus coverage for hyper-local services, events, and advertising */
export const TARGET_CITIES = ["India"];

export const ALL_COVERED_AREAS = ["India (Pan-India)"];

/** Core hyper-local discovery categories */
export const CATEGORIES = [
  {
    id: "food",
    name: "Food",
    slug: "food",
    tagline: "Local dining, artisan foods & neighborhood cafes",
    description: "Discover authentic local eateries, homemade bakes, street food specialties, and nearby cafes.",
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    tagline: "Local boutiques, apparel & handmade accessories",
    description: "Shop directly from neighborhood boutiques, regional designers, and artisanal tailors.",
  },
  {
    id: "events",
    name: "Events",
    slug: "events",
    tagline: "Community meetups, cultural festivals & sports",
    description: "Find weekend gatherings, tech meetups, art workshops, and cultural events happening near you.",
  },
  {
    id: "services",
    name: "Services",
    slug: "services",
    tagline: "Home services, repairs & trusted professionals",
    description: "Connect with verified local mechanics, plumbers, tutors, freelance pros, and home repair experts.",
  },
  {
    id: "health",
    name: "Health",
    slug: "health",
    tagline: "Clinics, fitness studios & holistic wellness",
    description: "Locate neighborhood yoga studios, dental clinics, physiotherapy centers, and fitness trainers.",
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
    description: "Explore local products, nearby dining, trusted services, and neighborhood happenings without the noise.",
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
  CATEGORIES,
  BRAND_COLORS,
  PILLARS,
};

export default appConstants;
