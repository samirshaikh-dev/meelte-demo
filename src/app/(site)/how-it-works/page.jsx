import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
} from "@/lib/seo/structured-data";
import { APP_URL } from "@/config/site";
import {
  HOW_IT_WORKS_BREADCRUMBS,
  HowItWorksHero,
  RESIDENT_STEPS,
  HowItWorksSteps,
  HowItWorksRoles,
  HowItWorksBoundaries,
  HowItWorksFaq,
  getHowItWorksFaqJsonLd,
} from "@/components/sections/how-it-works";

export const metadata = buildPageMetadata({
  title: "How meelTe Works — Nearby Offers, Events & Chat",
  description:
    "How meelTe works: install the app on Android or iOS, allow location, then browse time-boxed shop offers and local events sorted by distance.",
  path: "/how-it-works",
  keywords: [
    "how meelTe works",
    "meelTe platform explained",
    "hyperlocal discovery app India",
    "local shop offers near me",
    "local events near me",
    "location based offers India",
    "meelTe for merchants",
    "meelTe for event hosts",
    "meelTe app walkthrough",
    "neighborhood discovery platform",
  ],
});

/** The three sides of the platform, matching <HowItWorksRoles> card for card. */
const ROLE_ITEMS = [
  {
    name: "Shops & service businesses",
    description:
      "Post one product or a catalogue of up to 100 with a price or discount and the dates the offer runs. Onboarded in person by the meelTe field team.",
    path: "/for-merchants",
  },
  {
    name: "Event hosts & clubs",
    description:
      "Publish an event with a date, time, map location and joining cost, then approve or reject join requests by group size.",
    path: "/how-it-works#roles",
  },
  {
    name: "Neighbours & new arrivals",
    description:
      "Follow shops and hosts, add friends, and talk one to one with text, documents and location, plus voice and video calls.",
    path: "/how-it-works#roles",
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
        name: "How meelTe works for a resident",
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
        name: "Who uses meelTe",
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
      getHowItWorksFaqJsonLd(),
    ].filter(Boolean),
  };
}

/**
 * /how-it-works explains the product mechanics, then sets the honest limits.
 *
 *   1. HowItWorksHero        what meelTe is, in one paragraph, plus the one action
 *   2. HowItWorksSteps       the four steps a resident actually goes through
 *   3. HowItWorksRoles       shops, hosts and neighbours, each linked outward
 *   4. HowItWorksBoundaries  what the platform does not do, and where location fits
 *   5. HowItWorksFaq         five mechanics questions, linked to /faq
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
        <HowItWorksFaq />
        {/* <FinalConversionCTA /> */}
      </main>

      <Footer />
    </div>
  );
}
