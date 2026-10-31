import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DiscoverAreas } from "@/components/sections/discover";
import { FaqSection } from "@/components/sections/common";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getCollectionPageJsonLd,
  getFaqPageJsonLd,
} from "@/lib/seo/structured-data";
import { PLATFORM_AREAS } from "@/constants/app-constants";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { DiscoverHero } from "./_components/discover-hero";
import { DiscoverSteps } from "./_components/discover-steps";

const DISCOVER_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Discover" },
];

/**
 * /discover FAQ teaser.
 *
 * Drawn from `src/data/faq.json`, the single copy source. A first-time discover
 * visitor asks five things before installing: where it works, how to get the app,
 * how joining works, who handles payment, and whether it is safe. The full answer
 * set stays on /faq, linked from the section footer. Filtering (rather
 * than a hand-written copy of the answers) keeps the accordion and the FAQPage
 * schema identical.
 */
const DISCOVER_FAQ_IDS = ["faq-5", "faq-7", "faq-9", "faq-11", "faq-13"];
const DISCOVER_FAQS = FAQ_ITEMS.filter((faq) => DISCOVER_FAQ_IDS.includes(faq.id));

export const metadata = buildPageMetadata({
  title: "What's Nearby: Local Offers, Events & People",
  description:
    "Nearby shop offers, local events you can join, and one-to-one chat, sorted by distance. Live on Google Play and the App Store; web app coming soon.",
  path: "/discover",
  keywords: [
    "hyperlocal discovery app",
    "nearby offers",
    "local events near me",
    "community app India",
    "hyperlocal community platform",
    "event hosting app",
    "discover nearby shops",
    "meelte app",
  ],
});

/**
 * /discover describes what the Meelte app actually contains.
 *
 * The page follows a single conversion path — understand, see how it starts,
 * clear the objections, install:
 *   1. DiscoverHero      what it is and the primary action
 *   2. DiscoverAreas     the three capabilities, scannable
 *   3. DiscoverSteps     install → allow location → find something nearby
 *   4. FaqSection        five objection-handling questions, linked to /faq
 *   5. FinalConversionCTA  install for residents, onboarding for merchants
 *
 * The ItemList below is generated from PLATFORM_AREAS and points at the anchor ids
 * rendered by <DiscoverAreas>, so the structured data, the footer links and the
 * on-page sections all resolve to the same three targets. The earlier version
 * advertised five /discover#category fragments and fifteen invented businesses.
 * The FAQPage graph is built from exactly the questions rendered here.
 */
function getDiscoverJsonLd() {
  const collectionJsonLd = getCollectionPageJsonLd({
    name: "What you can do in Meelte",
    description:
      "Local offers from nearby shops, local events you can request to join, and one-to-one chat with the people and businesses you follow.",
    path: "/discover",
    items: PLATFORM_AREAS.map((area) => ({
      name: area.name,
      path: `/discover#${area.anchor}`,
    })),
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      collectionJsonLd,
      getFaqPageJsonLd(DISCOVER_FAQS),
      getBreadcrumbsJsonLd(DISCOVER_BREADCRUMBS),
    ].filter(Boolean),
  };
}

export default function DiscoverPage() {
  const jsonLd = getDiscoverJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Accessible Skip-to-Main-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <DiscoverHero />
        <DiscoverAreas />
        <DiscoverSteps />
        <FaqSection
          items={DISCOVER_FAQS}
          viewAllHref="/faq"
          title="Questions people ask before they install."
          description="Where Meelte works, how to get the app, how joining an event works, who handles payment, and how safety is handled."
        />
        <FinalConversionCTA />
      </main>

      <Footer />
    </div>
  );
}
