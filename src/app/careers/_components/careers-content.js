/**
 * Shared constants for the /careers route.
 *
 * Three things live here rather than in `page.jsx`:
 *
 * 1. The breadcrumb trail. Keeping it in one module means the visible trail
 *    rendered by <Breadcrumbs> and the BreadcrumbList JSON-LD emitted by the page
 *    cannot drift apart (AI_RULE.md §2.6), and the hero does not need its own
 *    duplicate copy of the array.
 * 2. The hiring state. "Not actively hiring" is the most important sentence on
 *    this page, so it is defined once and composed by the hero *and* by the WebPage
 *    JSON-LD node. The schema description must be the visible text verbatim, not a
 *    paraphrase, or the structured data stops matching the page (seo-engineer).
 * 3. The speculative-application mail draft, so the hero, the open-roles block and
 *    the closing CTA pre-fill the same subject and body.
 */

import { HR_EMAIL } from "@/config/site";

/** Keeps the visual breadcrumb and its BreadcrumbList schema in sync. */
export const CAREERS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
];

/** Recruitment address. Single source of truth is src/config/site.js. */
export const CAREERS_EMAIL = HR_EMAIL;

/**
 * The page's direct answer, in two halves so the address can be a real link in
 * the rendered copy while the schema still receives the whole sentence.
 */
export const CAREERS_STATUS_SENTENCE =
  "Meelte is not actively hiring. A speculative application is welcome";

/** `CAREERS_STATUS_SENTENCE` + the address, exactly as a reader sees it. */
export const CAREERS_DIRECT_ANSWER = `${CAREERS_STATUS_SENTENCE} — ${CAREERS_EMAIL}.`;

const CAREERS_SUBJECT = "Speculative application — Meelte";

const CAREERS_BODY = [
  "Hi Meelte team,",
  "",
  "I would like to be considered for a role at Meelte.",
  "",
  "Role I am interested in:",
  "Location or remote preference:",
  "LinkedIn / GitHub / portfolio:",
  "",
  "Thanks,",
].join("\n");

/** Pre-filled mailto used by the hero, the open-roles block and the closing CTA. */
export const CAREERS_EMAIL_HREF = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
  CAREERS_SUBJECT
)}&body=${encodeURIComponent(CAREERS_BODY)}`;

/**
 * In-page anchors. The `id` values must stay in step with the `id` attributes of
 * CareersValues, CareersBenefits and CareersOpenRoles.
 */
export const CAREERS_ON_THIS_PAGE = [
  { id: "values", label: "What we value" },
  { id: "benefits", label: "Perks & benefits" },
  { id: "open-roles", label: "Open roles" },
];

export default CAREERS_BREADCRUMBS;
