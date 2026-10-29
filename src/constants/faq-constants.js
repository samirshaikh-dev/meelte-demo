/**
 * Meelte — Frequently Asked Questions (FAQ) Data
 *
 * Single source of truth for every FAQ surface on the site:
 * - `src/data/faq.json` holds the content (imported by the dedicated `/faq` page,
 *   which emits its own FAQPage JSON-LD).
 * - This module re-exports the same list for shared consumers: the home page's
 *   JSON-LD graph (`src/app/page.js`) and the `FaqSection` accordion rendered on
 *   `/`, `/discover`, `/how-it-works`, and `/for-merchants`.
 *
 * Edit `src/data/faq.json` only — never duplicate the copy here, or the two
 * surfaces will drift apart.
 *
 * Copy rules for every entry (see `meelte-context.md` §3 "Claim guardrails"):
 * - Only describe capabilities that exist in the product (`docs/target_customer.md` §1).
 * - Never state a number, rating, customer count, or verification process that is not evidenced.
 * - The mobile app is live; the web app is "coming soon" — never imply otherwise.
 */

import faqData from "@/data/faq.json";

export const FAQ_ITEMS = faqData;

export default FAQ_ITEMS;
