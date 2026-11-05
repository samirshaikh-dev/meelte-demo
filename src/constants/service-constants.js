/**
 * App-wide constants for meelTe
 * Synchronized with src/config/site.js as the canonical source of truth.
 */
import {
  APP_NAME,
  SITE_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  SUPPORT_EMAIL,
  HR_EMAIL,
  PLAY_STORE_URL,
  TWITTER_HANDLE,
  SOCIAL_LINKS,
} from "@/config/site";
import {
  TARGET_CITIES,
  BRAND_COLORS,
} from "./app-constants";

const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[0-9][0-9\s().-]*$/,
  NON_DIGITS: /\D/g,
  DIGITS_ONLY: /^\d+$/,
  WHITESPACE: /\s+/g,
  SURROUNDING_QUOTES: /^["']|["']$/g,
  CONTROL_CHARACTERS: /[\u0000-\u001f\u007f]/,
  MULTILINE_CONTROL_CHARACTERS: /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/,
};

export {
  APP_NAME,
  SITE_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  SUPPORT_EMAIL,
  HR_EMAIL,
  PLAY_STORE_URL,
  TWITTER_HANDLE,
  SOCIAL_LINKS,
  TARGET_CITIES,
  BRAND_COLORS,
  REGEX,
};
