/**
 * meelTe — Frequently Asked Questions (FAQ) Data
 *
 * Master directory data source:
 * - `src/data/faq.json` holds the complete FAQ catalog (imported by the dedicated
 *   `/faq` page with interactive category filtering, search, and full FAQPage JSON-LD).
 * - Individual marketing pages (`/`, `/for-merchants`, `/how-it-works`, `/signup`)
 *   use dedicated, page-specific FAQ sections colocated in their respective component directories
 *   (`HomeFaq`, `MerchantFaq`, `HowItWorksFaq`, `SignupFaq`), each paired with a matching
 *   Schema.org FAQPage generator.
 * - This module re-exports the master list for global consumers and backwards-compatible wrappers.
 */

import faqData from "@/data/faq.json";

export const FAQ_ITEMS = faqData;

export default FAQ_ITEMS;
