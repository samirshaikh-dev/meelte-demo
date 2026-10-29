"use client";

/**
 * Centralised toast feedback contract (sonner).
 *
 * Why this file exists:
 * - ui-ux-engineer: every user action must give designed feedback, and the copy must be
 *   consistent. Four different forms previously phrased the same confirmation in four ways.
 * - accessibility-engineer: exactly ONE announcement per event. Pass an `id` so a repeated
 *   submit replaces the existing toast instead of stacking duplicate live-region announcements.
 * - frontend-engineer: durations are a UX decision, so they live in one place instead of being
 *   re-guessed per call site.
 *
 * Never call `toast.*` directly from a component; use these helpers so durations, dedupe ids,
 * and copy stay aligned with the Meelte design system.
 */

import { toast } from "sonner";
import { SUPPORT_EMAIL } from "@/config/site";

/** How long each toast stays on screen (ms). Errors get longer: they carry an action to take. */
export const TOAST_DURATION = {
  success: 5000,
  error: 7000,
  info: 4000,
};

/** Stable ids keep repeated submits from stacking duplicate announcements. */
export const TOAST_ID = {
  contact: "contact-feedback",
  merchant: "merchant-feedback",
  newsletter: "newsletter-feedback",
};

/**
 * Canonical user-facing copy. Keep every message honest about what actually happened.
 *
 * The merchant enquiry has no backend endpoint yet (AI_RULE.md §2.1), so the form hands
 * the enquiry to the user's mail client. The copy says that instead of claiming the
 * request was received.
 */
export const TOAST_COPY = {
  contactValidation: "Please fix the highlighted fields and try again.",
  contactHandoff: "Opening your email app with the message.",
  contactHandoffDescription: (email) =>
    `Send it to ${email} — nothing is submitted until you do.`,
  merchantValidation:
    "Please add your business name and phone number so we can reach you.",
  merchantHandoff: "Opening your email app with the enquiry details.",
  merchantHandoffDescription: (email) =>
    `Send it to ${email} — nothing is submitted until you do.`,
  newsletterInvalidEmail: "Please enter a valid email address.",
  newsletterSuccess: "You're subscribed. Neighborhood updates are on the way.",
  newsletterAlreadySubscribed: "You're already on the neighborhood update list.",
  newsletterNotConnected: `Newsletter signup isn't connected yet. Email ${SUPPORT_EMAIL} and we'll add you manually.`,
  newsletterError: "Couldn't subscribe right now. Please try again.",
};

/**
 * @param {string} message
 * @param {import("sonner").ExternalToast} [options]
 */
export function notifySuccess(message, options = {}) {
  return toast.success(message, { duration: TOAST_DURATION.success, ...options });
}

/**
 * @param {string} message
 * @param {import("sonner").ExternalToast} [options]
 */
export function notifyError(message, options = {}) {
  return toast.error(message, { duration: TOAST_DURATION.error, ...options });
}

/**
 * @param {string} message
 * @param {import("sonner").ExternalToast} [options]
 */
export function notifyInfo(message, options = {}) {
  return toast.info(message, { duration: TOAST_DURATION.info, ...options });
}
