/**
 * Content and channel constants for the /contact route.
 *
 * Everything the page says lives here so the hero, the form and the details column
 * cannot drift apart, and so the metadata description and the `ContactPage` JSON-LD
 * share one string.
 *
 * The form's own validation copy stays in `src/validation/contacts/contact-validation.js`
 * — that module owns field errors, not page copy.
 *
 * Claim discipline: the only facts here are the ones already published on the page
 * and in `public/contact.md` — the support address, the phone number, the support
 * hours, and the registered office. No response-time promise, no "24/7", no
 * ticketing or live-chat claim.
 */

import { CONTACT_PHONE, SUPPORT_EMAIL } from "@/config/site";

/**
 * Single source for the trail.
 *
 * The previous version declared this array **twice** — once in `page.jsx` (with
 * `path` on the last item, feeding the JSON-LD) and once inside `contact-hero.jsx`
 * (without `path`). Two arrays for one trail is exactly the drift §2.6 exists to
 * prevent, and a last item without a `path` makes `getBreadcrumbsJsonLd` emit the
 * homepage URL for the current page.
 */
export const CONTACT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact Us", path: "/contact" },
];

/**
 * Shared by `buildPageMetadata` and the `ContactPage` JSON-LD. ≤155 characters.
 */
export const CONTACT_DESCRIPTION =
  "Contact Meelte for app support, merchant onboarding, event partnerships or feedback. Email, phone and a registered office in Bodh Gaya, Bihar.";

export const CONTACT_HERO = {
  badge: "Contact Us",
  titleLead: "How can we",
  titleAccent: "help?",
  lead: "Get in touch about app support, a local business, a community event, or feedback. Choose the route that works best for you.",
  formCta: "Write to our team",
  faqCta: "Browse FAQs",
};

/** The direct channels — the fastest route, so they sit in the hero. */
export const CONTACT_DIRECT = {
  eyebrow: "Prefer a direct route?",
  title: "Contact support",
  body: "For app help, account questions, privacy requests, or general enquiries.",
  hoursLabel: "Support hours",
  hours: "Monday–Friday, 9:00 AM–6:00 PM IST",
};

/** Channel values, resolved once. `phoneDisplay` is the grouped, readable form. */
export const CONTACT_CHANNELS = {
  email: SUPPORT_EMAIL,
  emailHref: `mailto:${SUPPORT_EMAIL}`,
  phoneDisplay: "+91 88845 24444",
  phoneHref: `tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`,
};

export const CONTACT_OFFICE = {
  title: "Registered office",
  company: "Meelte Private Limited",
  addressLines: [
    "Pratistha, Ward No. 14, LIC Gali, Upadhyay Bigha,",
    "Sujata Bypass, Rajapur, Bodh Gaya,",
    "Bihar 824231, India",
  ],
  mapLabel: "View office in Maps",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Pratistha,+Ward+No.+14,+LIC+Gali,+Upadhyay+Bigha,+Sujata+Bypass,+Rajapur,+Bodh+Gaya,+Bihar+824231",
};

export const CONTACT_PRIVACY =
  "Contact details are used for customer support and aren't shared with third parties or advertisers.";

/**
 * Form copy.
 *
 * The wording is unchanged from the previous implementation. What changed is that
 * the mailto handoff is now stated in the header and again beside the submit button,
 * because "Submit" alone reads like it sends a message — and nothing is sent until
 * the visitor sends the prepared email themselves.
 */
export const CONTACT_FORM = {
  eyebrow: "Send a message",
  title: "Tell us what you need",
  intro:
    "Share a few details and we'll prepare an email for you to review and send.",
  requiredNote: "Fields marked * are required.",
  footerNote:
    "The form opens a prepared email in your email app. Review it there and press send; it isn't sent automatically.",
  submit: "Submit",
  successTitle: "Your message is ready",
  successBodyBefore:
    "Your email app should have opened with a prepared message. Review it and press send to reach",
  successBodyAfter: ". Nothing is sent until you do.",
  successOpenAgain: "Open email app again",
  successReset: "Write another message",
};

/**
 * Field labels, hints and placeholders.
 *
 * `id` values are unchanged, so `FIELD_ORDER`, the `aria-describedby` error ids and
 * the focus-the-first-invalid-field logic all keep working.
 */
export const CONTACT_FIELDS = [
  {
    id: "topic",
    label: "What is this about?",
    placeholder: "e.g. General inquiry",
    required: true,
    type: "text",
    maxLengthKey: "topic",
  },
  {
    id: "name",
    label: "Full name",
    placeholder: "Your name",
    required: true,
    type: "text",
    autoComplete: "name",
    maxLengthKey: "name",
  },
  {
    id: "email",
    label: "Email address",
    placeholder: "you@example.com",
    required: true,
    type: "email",
    autoComplete: "email",
    maxLengthKey: "email",
  },
  {
    id: "phone",
    label: "Phone number",
    hint: "(optional)",
    placeholder: "+91 98765 43210",
    required: false,
    type: "tel",
    autoComplete: "tel",
    maxLengthKey: "phone",
  },
  {
    id: "city",
    label: "City or region",
    placeholder: "e.g. Bengaluru",
    required: true,
    type: "text",
    autoComplete: "address-level2",
    maxLengthKey: "city",
  },
  {
    id: "message",
    label: "Your message",
    placeholder: "How can we help?",
    required: true,
    type: "textarea",
    maxLengthKey: "message",
  },
];
