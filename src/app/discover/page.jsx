import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DiscoverAreas } from "@/components/sections/discover";
import { TrustCredibilitySection, FaqSection } from "@/components/sections/common";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getCollectionPageJsonLd,
} from "@/lib/seo/structured-data";
import { PLATFORM_AREAS } from "@/constants/app-constants";
import { DiscoverHero } from "./_components/discover-hero";

const DISCOVER_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Discover" },
];

export const metadata = buildPageMetadata({
  title: "Nearby Offers, Events & People | Meelte",
  description:
    "See time-boxed offers from nearby shops, local events you can request to join, and one-to-one chat with people you meet. Meelte sorts everything by distance, live in Bengaluru, Gaya and Ranchi.",
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
 * The ItemList below is generated from PLATFORM_AREAS and points at the anchor ids
 * rendered by <DiscoverAreas>, so the structured data, the footer links and the
 * on-page sections all resolve to the same three targets. The earlier version
 * advertised five /discover#category fragments and fifteen invented businesses.
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
    "@graph": [collectionJsonLd, getBreadcrumbsJsonLd(DISCOVER_BREADCRUMBS)].filter(
      Boolean
    ),
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
        <TrustCredibilitySection />
        <FaqSection />
        <FinalConversionCTA />
      </main>

      <Footer />
    </div>
  );
}
