import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/sections/common";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getFaqPageJsonLd,
} from "@/lib/seo/structured-data";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { APP_URL } from "@/config/site";
import {
  HOW_IT_WORKS_BREADCRUMBS,
  HowItWorksHero,
} from "./_components/how-it-works-hero";
import { RESIDENT_STEPS, HowItWorksSteps } from "./_components/how-it-works-steps";
import { HowItWorksRoles } from "./_components/how-it-works-roles";
import { HowItWorksBoundaries } from "./_components/how-it-works-boundaries";

export const metadata = buildPageMetadata({
  title: "How Meelte Works — Nearby Offers, Events & Chat",
  description:
    "How Meelte works: install the app on Android or iOS, allow location, then browse time-boxed shop offers and local events sorted by distance.",
  path: "/how-it-works",
  keywords: [
    "how Meelte works",
    "Meelte platform explained",
    "hyperlocal discovery app India",
    "local shop offers near me",
    "local events near me",
    "location based offers India",
    "Meelte for merchants",
    "Meelte for event hosts",
    "Meelte app walkthrough",
    "neighborhood discovery platform",
  ],
});

/**
 * /how-it-works FAQ teaser.
 *
 * Drawn from `src/data/faq.json`, the single copy source, so the accordion and the
 * FAQPage graph below can never disagree. The five questions cover what this page
 * explains — what the platform is, where it runs, how a join request works, who
 * handles money, and how the social side works today — and the full set stays on
 * /faq, linked from the section footer.
 *
 * `faq-7` and `faq-17` (where to download, iPhone and browser availability) are
 * answered in full on /faq and in the hero's availability line; the five questions
 * here stay on mechanics.
 */
const HOW_IT_WORKS_FAQ_IDS = ["faq-1", "faq-5", "faq-9", "faq-11", "faq-19"];
const HOW_IT_WORKS_FAQS = FAQ_ITEMS.filter((faq) =>
  HOW_IT_WORKS_FAQ_IDS.includes(faq.id)
);

/** The three sides of the platform, matching <HowItWorksRoles> card for card. */
const ROLE_ITEMS = [
  {
    name: "Shops & service businesses",
    description:
      "Post one product or a catalogue of up to 100 with a price or discount and the dates the offer runs. Onboarded in person by the Meelte field team.",
    path: "/for-merchants",
  },
  {
    name: "Event hosts & clubs",
    description:
      "Publish an event with a date, time, map location and joining cost, then approve or reject join requests by group size.",
    path: "/discover#events",
  },
  {
    name: "Neighbours & new arrivals",
    description:
      "Follow shops and hosts, add friends, and talk one to one with text, documents and location, plus voice and video calls.",
    path: "/discover#people",
  },
];

/**
 * JSON-LD for /how-it-works.
 *
 * HowTo quotes the four resident steps straight from `RESIDENT_STEPS` (so the
 * markup cannot paraphrase what the page shows), ItemList mirrors
 * <HowItWorksRoles> and links each role at the page that covers it in full, and
 * BreadcrumbList comes from the same array the visible <Breadcrumbs> renders
 * (AI_RULE.md §2.6). The FAQPage is built from exactly the questions rendered by
 * <FaqSection>.
 */
function getHowItWorksJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `${APP_URL}/how-it-works#howto`,
        name: "How Meelte works for a resident",
        description:
          "Install the app on Android or iOS, allow location so listings sort by distance, browse time-boxed shop offers and local events, then settle directly with the shop or host.",
        url: `${APP_URL}/how-it-works`,
        inLanguage: "en-IN",
        step: RESIDENT_STEPS.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${APP_URL}/how-it-works#roles`,
        name: "Who uses Meelte",
        description:
          "The three sides of the platform: shops and service businesses, event hosts and clubs, and neighbours and new arrivals.",
        numberOfItems: ROLE_ITEMS.length,
        itemListElement: ROLE_ITEMS.map((role, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: role.name,
          description: role.description,
          url: `${APP_URL}${role.path}`,
        })),
      },
      getBreadcrumbsJsonLd(HOW_IT_WORKS_BREADCRUMBS),
      getFaqPageJsonLd(HOW_IT_WORKS_FAQS),
    ].filter(Boolean),
  };
}

/**
 * /how-it-works explains the product mechanics, then sets the honest limits.
 *
 *   1. HowItWorksHero        what Meelte is, in one paragraph, plus the one action
 *   2. HowItWorksSteps       the four steps a resident actually goes through
 *   3. HowItWorksRoles       shops, hosts and neighbours, each linked outward
 *   4. HowItWorksBoundaries  what the platform does not do, and where location fits
 *   5. FaqSection            five mechanics questions, linked to /faq
 *   6. FinalConversionCTA    install for residents, onboarding for merchants
 *
 * Every section is a server component: the copy is identical for every visitor,
 * and the previous tabbed ecosystem explorer, duplicated homepage walkthrough and
 * unverified trust band were removed rather than restyled.
 */
export default function HowItWorksPage() {
  const jsonLd = getHowItWorksJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org JSON-LD — HowTo + ItemList + BreadcrumbList + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <HowItWorksHero />
        <HowItWorksSteps />
        <HowItWorksRoles />
        <HowItWorksBoundaries />
        <FaqSection
          items={HOW_IT_WORKS_FAQS}
          viewAllHref="/faq"
          title="How the platform actually behaves."
          description="What Meelte is, where it runs, how a join request works, who handles the money, and how the social side works today."
        />
        <FinalConversionCTA />
      </main>

      <Footer />
    </div>
  );
}
