/**
 * Meelte — Site Configuration & Brand Single Source of Truth
 * Guided by AI_RULE.md, project-context.md, and docs/Design.md
 */

import {
  TARGET_CITIES,
  ALL_COVERED_AREAS,
  PLATFORM_AREAS,
  BRAND_COLORS,
  PILLARS,
} from "../constants/app-constants";

export const APP_NAME = "Meelte";
export const SITE_NAME = "Meelte";
export const APP_TAGLINE = "Discover Opportunities. Build Connections. Create Experiences.";
export const APP_DESCRIPTION = "Meelte is a hyper-local community platform connecting residents with nearby offers, events and people across India.";
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL;
export const API_BASE_URL = process.env.NEXT_PUBLIC_MEELTE_API_BASE_URL;
export const SUPPORT_EMAIL = "support@meelte.com";
export const HR_EMAIL = "hr@meelte.com";
export const CONTACT_PHONE = "+91-8884524444";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.meelte.classico&pcampaignid=web_share";
// Placeholder until the app developer supplies the iOS listing URL. Kept as "#" so the
// App Store button can ship in the navbar and footer without pointing at a wrong listing;
// replace this one value and both surfaces update (project-context.md §10 item 9).
export const APP_STORE_URL = "#";
export const APPLE_LOGO_URL = "https://meelte.com/apple-touch-icon.png";
export const TWITTER_HANDLE = "@meelteapp";
export const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "";
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export const SOCIAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/meelte.official",
  FACEBOOK: "https://www.facebook.com/meelTe",
  TWITTER: "https://twitter.com/meelteapp",
  LINKEDIN: "https://www.linkedin.com/company/meelte/",
  YOUTUBE: "https://www.youtube.com/@meelte",
  WHATSAPP: "",
};

export const SAME_AS_LINKS = [
  SOCIAL_LINKS.INSTAGRAM,
  SOCIAL_LINKS.FACEBOOK,
  SOCIAL_LINKS.TWITTER,
  SOCIAL_LINKS.LINKEDIN,
  SOCIAL_LINKS.YOUTUBE,
  PLAY_STORE_URL,
].filter(Boolean);


export const SITE_CONFIG = {
  SITE_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  API_BASE_URL,
  SUPPORT_EMAIL,
  HR_EMAIL,
  CONTACT_PHONE,
  PLAY_STORE_URL,
  APP_STORE_URL,
  TWITTER_HANDLE,
  SOCIAL_LINKS,
  SAME_AS_LINKS,
  TARGET_CITIES,
  ALL_COVERED_AREAS,
  PLATFORM_AREAS,
  BRAND_COLORS,
  PILLARS,
};

export default SITE_CONFIG;
