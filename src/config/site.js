/**
 * meelTe — Site Configuration & Brand Single Source of Truth
 * Guided by AI_RULE.md, project-context.md, and docs/Design.md
 */

import {
  TARGET_CITIES,
  ALL_COVERED_AREAS,
  PLATFORM_AREAS,
  BRAND_COLORS,
  PILLARS,
} from "../constants/app-constants";

export const APP_NAME = "meelTe";
export const SITE_NAME = "meelTe";
export const APP_TAGLINE = "Discover Opportunities. Build Connections. Create Experiences.";
export const APP_DESCRIPTION = "meelTe is a hyperlocal community platform connecting residents with nearby offers, events and people across India.";
/**
 * Canonical site origin, with no trailing slash.
 *
 * Every consumer concatenates paths directly (`${APP_URL}/about`), so a value
 * ending in `/` produced `https://…//about` in the sitemap, robots.txt and every
 * canonical tag. Normalising once here fixes all of them, regardless of how the
 * environment happens to be formatted.
 */
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
export const API_BASE_URL = process.env.NEXT_PUBLIC_meelTe_API_BASE_URL;
export const SUPPORT_EMAIL = "support@meelTe.com";
export const HR_EMAIL = "hr@meelTe.com";
export const CAREERS_EMAIL = HR_EMAIL;
export const CONTACT_PHONE = "+91-8884524444";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.meelTe.classico&pcampaignid=web_share";
// Live App Store listing. Both store URLs are promoted together everywhere the app is
// offered; change this one value and the navbar, mobile drawer, heroes and CTAs update.
export const APP_STORE_URL = "https://apps.apple.com/ng/app/meelTe/id6792304887";
export const APPLE_LOGO_URL = "https://meelTe.com/apple-touch-icon.png";
export const TWITTER_HANDLE = "@meelTeapp";
export const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "";
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export const SOCIAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/meelTe.official",
  FACEBOOK: "https://www.facebook.com/meelTe",
  TWITTER: "https://twitter.com/meelTeapp",
  LINKEDIN: "https://www.linkedin.com/company/meelTe/",
  YOUTUBE: "https://www.youtube.com/@meelTe",
  WHATSAPP: "",
};

export const SAME_AS_LINKS = [
  SOCIAL_LINKS.INSTAGRAM,
  SOCIAL_LINKS.FACEBOOK,
  SOCIAL_LINKS.TWITTER,
  SOCIAL_LINKS.LINKEDIN,
  SOCIAL_LINKS.YOUTUBE,
  PLAY_STORE_URL,
  APP_STORE_URL,
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
